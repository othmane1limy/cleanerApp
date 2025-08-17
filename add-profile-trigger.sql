-- Add profile creation trigger and function
-- This should be run AFTER the main schema is already created

-- Function to automatically create user profile immediately after user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile immediately when user is created (no email confirmation required)
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
                working_hours
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
                COALESCE(NEW.raw_user_meta_data->>'working_hours', '{"start": "08:00", "end": "18:00"}')
            );
            
            RAISE NOTICE 'Created cleaner profile for user %', NEW.id;
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
            
            RAISE NOTICE 'Created client profile for user %', NEW.id;
        END IF;
    ELSE
        RAISE NOTICE 'Profile already exists for user %, skipping creation', NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
-- This trigger will fire when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Test the function (optional - you can remove this)
-- SELECT handle_new_user();

