
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Client Profiles Table
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaner Profiles Table
CREATE TABLE cleaner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    national_id TEXT NOT NULL,
    vehicle_registration TEXT,
    business_license TEXT,
    business_name TEXT,
    service_area TEXT NOT NULL,
    is_mobile BOOLEAN DEFAULT true,
    has_garage BOOLEAN DEFAULT false,
    garage_address TEXT,
    working_hours JSONB DEFAULT '{"start": "08:00", "end": "18:00"}',
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(2,1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    profile_image TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE cleaner_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER DEFAULT 60, -- in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE cleaner_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cleaner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES cleaner_services(id),
    booking_type TEXT CHECK (booking_type IN ('mobile', 'garage')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    location_address TEXT,
    location_coordinates POINT,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cleaner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_profiles
CREATE POLICY "Users can view their own client profile" ON client_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own client profile" ON client_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own client profile" ON client_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cleaner_profiles
CREATE POLICY "Everyone can view active cleaner profiles" ON cleaner_profiles
    FOR SELECT USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Cleaners can update their own profile" ON cleaner_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Cleaners can insert their own profile" ON cleaner_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cleaner_services
CREATE POLICY "Everyone can view active services" ON cleaner_services
    FOR SELECT USING (is_active = true OR auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can insert their own services" ON cleaner_services
    FOR INSERT WITH CHECK (auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can update their own services" ON cleaner_services
    FOR UPDATE USING (auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can delete their own services" ON cleaner_services
    FOR DELETE USING (auth.uid() = cleaner_id);

-- RLS Policies for cleaner_gallery
CREATE POLICY "Everyone can view gallery images" ON cleaner_gallery
    FOR SELECT USING (true);

CREATE POLICY "Cleaners can insert their own gallery images" ON cleaner_gallery
    FOR INSERT WITH CHECK (auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can update their own gallery images" ON cleaner_gallery
    FOR UPDATE USING (auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can delete their own gallery images" ON cleaner_gallery
    FOR DELETE USING (auth.uid() = cleaner_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = cleaner_id);

CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Cleaners can update bookings" ON bookings
    FOR UPDATE USING (auth.uid() = cleaner_id);

CREATE POLICY "Clients can update their own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = client_id);

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Clients can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cleaner_profiles_updated_at BEFORE UPDATE ON cleaner_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_cleaner_profiles_active ON cleaner_profiles(is_active);
CREATE INDEX idx_cleaner_profiles_service_area ON cleaner_profiles(service_area);
CREATE INDEX idx_cleaner_profiles_user_id ON cleaner_profiles(user_id);
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_cleaner_services_cleaner_id ON cleaner_services(cleaner_id);
CREATE INDEX idx_cleaner_services_active ON cleaner_services(is_active);
CREATE INDEX idx_cleaner_gallery_cleaner_id ON cleaner_gallery(cleaner_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_cleaner ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_cleaner ON reviews(cleaner_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);

-- Functions to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'user_type' = 'client' THEN
    INSERT INTO client_profiles (user_id, first_name, last_name, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.raw_user_meta_data->>'phone'
    );
  ELSIF NEW.raw_user_meta_data->>'user_type' = 'cleaner' THEN
    INSERT INTO cleaner_profiles (
      user_id, first_name, last_name, phone, business_name,
      national_id, business_license, vehicle_registration,
      service_area, is_mobile, has_garage, garage_address
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'business_name',
      COALESCE(NEW.raw_user_meta_data->>'national_id', ''),
      NEW.raw_user_meta_data->>'business_license',
      NEW.raw_user_meta_data->>'vehicle_registration',
      COALESCE(NEW.raw_user_meta_data->>'service_area', ''),
      COALESCE((NEW.raw_user_meta_data->>'is_mobile')::boolean, true),
      COALESCE((NEW.raw_user_meta_data->>'has_garage')::boolean, false),
      NEW.raw_user_meta_data->>'garage_address'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
