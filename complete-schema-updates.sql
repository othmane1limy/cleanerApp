
-- Complete Schema Updates for CleanFinder App
-- Run this after your base tables are created

-- =============================================
-- 1. Add missing columns to existing tables
-- =============================================

-- Add missing columns to cleaner_profiles if they don't exist
DO $$ 
BEGIN
    -- Add is_available column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cleaner_profiles' AND column_name='is_available') THEN
        ALTER TABLE cleaner_profiles ADD COLUMN is_available BOOLEAN DEFAULT true;
    END IF;
    
    -- Add latitude/longitude/location_address if not already added
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cleaner_profiles' AND column_name='latitude') THEN
        ALTER TABLE cleaner_profiles ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cleaner_profiles' AND column_name='longitude') THEN
        ALTER TABLE cleaner_profiles ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cleaner_profiles' AND column_name='location_address') THEN
        ALTER TABLE cleaner_profiles ADD COLUMN location_address TEXT;
    END IF;
END $$;

-- Add missing columns to client_profiles if they don't exist
DO $$ 
BEGIN
    -- Add latitude/longitude/location_address if not already added
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='client_profiles' AND column_name='latitude') THEN
        ALTER TABLE client_profiles ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='client_profiles' AND column_name='longitude') THEN
        ALTER TABLE client_profiles ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='client_profiles' AND column_name='location_address') THEN
        ALTER TABLE client_profiles ADD COLUMN location_address TEXT;
    END IF;
END $$;

-- Add missing columns to bookings table
DO $$ 
BEGIN
    -- Add missing status values and other columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='client_location') THEN
        ALTER TABLE bookings ADD COLUMN client_location JSONB;
    END IF;
    
    -- Add price column if missing (some views reference this)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='price') THEN
        ALTER TABLE bookings ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- Update booking status constraint to include missing statuses
DO $$
BEGIN
    -- Drop existing constraint
    ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
    
    -- Add updated constraint with all status values
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'on_way', 'arrived', 'in_progress', 'completed', 'cancelled'));
EXCEPTION
    WHEN OTHERS THEN
        -- Constraint might not exist, continue
        NULL;
END $$;

-- =============================================
-- 2. Create indexes for location-based queries
-- =============================================
CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_location ON cleaner_profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_client_profiles_location ON client_profiles(latitude, longitude);

-- =============================================
-- 3. Update RLS policies for trigger functionality
-- =============================================

-- Add policies to allow trigger inserts
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow trigger insert for clients" ON client_profiles;
    DROP POLICY IF EXISTS "Allow trigger insert for cleaners" ON cleaner_profiles;
    
    -- Create new policies
    CREATE POLICY "Allow trigger insert for clients"
    ON client_profiles
    FOR INSERT
    WITH CHECK (true);

    CREATE POLICY "Allow trigger insert for cleaners"
    ON cleaner_profiles
    FOR INSERT
    WITH CHECK (true);
EXCEPTION
    WHEN OTHERS THEN
        -- Policies might already exist, continue
        NULL;
END $$;

-- =============================================
-- 4. Update profile creation trigger function
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile immediately when user is created
    -- Check if profile already exists
    IF NOT EXISTS (
        SELECT 1 FROM client_profiles WHERE user_id = NEW.id
    ) AND NOT EXISTS (
        SELECT 1 FROM cleaner_profiles WHERE user_id = NEW.id
    ) THEN
        -- Get user type from metadata
        IF NEW.raw_user_meta_data->>'user_type' = 'cleaner' THEN
            -- Create cleaner profile
            INSERT INTO cleaner_profiles (
                user_id,
                first_name,
                last_name,
                phone,
                business_name,
                national_id,
                business_license,
                vehicle_registration,
                service_area,
                is_mobile,
                has_garage,
                garage_address,
                working_hours,
                is_available
            ) VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'phone', ''),
                COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'national_id', ''),
                COALESCE(NEW.raw_user_meta_data->>'business_license', ''),
                COALESCE(NEW.raw_user_meta_data->>'vehicle_registration', ''),
                COALESCE(NEW.raw_user_meta_data->>'service_area', ''),
                COALESCE((NEW.raw_user_meta_data->>'is_mobile')::boolean, true),
                COALESCE((NEW.raw_user_meta_data->>'has_garage')::boolean, false),
                COALESCE(NEW.raw_user_meta_data->>'garage_address', ''),
                COALESCE(NEW.raw_user_meta_data->>'working_hours', '{"start": "08:00", "end": "18:00"}'),
                COALESCE((NEW.raw_user_meta_data->>'is_available')::boolean, true)
            );
        ELSE
            -- Create client profile (default)
            INSERT INTO client_profiles (
                user_id,
                first_name,
                last_name,
                phone,
                address
            ) VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
                COALESCE(NEW.raw_user_meta_data->>'phone', ''),
                COALESCE(NEW.raw_user_meta_data->>'address', '')
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 5. Create earnings view with correct column name
-- =============================================
DROP VIEW IF EXISTS cleaner_earnings;
CREATE VIEW cleaner_earnings AS
SELECT 
  cleaner_id,
  SUM(COALESCE(total_price, price, 0)) AS total_earnings,
  DATE_TRUNC('week', created_at) AS week,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS completed_bookings
FROM bookings 
WHERE status = 'completed' AND (total_price IS NOT NULL OR price IS NOT NULL)
GROUP BY cleaner_id, week, month;

-- =============================================
-- 6. Enable realtime for bookings table
-- =============================================
DO $$
BEGIN
    -- This will only work if the publication exists
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
EXCEPTION
    WHEN duplicate_object THEN
        -- Table already added to publication
        NULL;
    WHEN undefined_object THEN
        -- Publication doesn't exist, skip
        NULL;
END $$;

-- =============================================
-- 7. Create/update timestamp triggers
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON client_profiles;
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cleaner_profiles_updated_at ON cleaner_profiles;
CREATE TRIGGER update_cleaner_profiles_updated_at BEFORE UPDATE ON cleaner_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cleaner_services_updated_at ON cleaner_services;
CREATE TRIGGER update_cleaner_services_updated_at BEFORE UPDATE ON cleaner_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 8. Fix any potential data issues
-- =============================================

-- Update any existing bookings to have the price column populated from total_price
DO $$
BEGIN
    UPDATE bookings 
    SET price = total_price 
    WHERE price IS NULL AND total_price IS NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        -- Column might not exist yet, skip
        NULL;
END $$;

-- =============================================
-- 9. Create additional useful indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_is_available ON cleaner_profiles(is_available);
CREATE INDEX IF NOT EXISTS idx_cleaner_profiles_is_active ON cleaner_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_cleaner_services_is_active ON cleaner_services(is_active);
