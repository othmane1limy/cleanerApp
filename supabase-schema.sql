
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Client Profiles Table
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
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
    is_active BOOLEAN DEFAULT false,
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
    duration INTEGER, -- in minutes
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

-- RLS Policies
CREATE POLICY "Users can view their own client profile" ON client_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own client profile" ON client_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own client profile" ON client_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view active cleaner profiles" ON cleaner_profiles
    FOR SELECT USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Cleaners can update their own profile" ON cleaner_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Cleaners can insert their own profile" ON cleaner_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view active services" ON cleaner_services
    FOR SELECT USING (is_active = true OR auth.uid() = cleaner_id);

CREATE POLICY "Cleaners can manage their own services" ON cleaner_services
    FOR ALL USING (auth.uid() = cleaner_id);

CREATE POLICY "Everyone can view gallery images" ON cleaner_gallery
    FOR SELECT USING (true);

CREATE POLICY "Cleaners can manage their own gallery" ON cleaner_gallery
    FOR ALL USING (auth.uid() = cleaner_id);

CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = cleaner_id);

CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Cleaners can update bookings" ON bookings
    FOR UPDATE USING (auth.uid() = cleaner_id);

CREATE POLICY "Users can view reviews for their bookings" ON reviews
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = cleaner_id);

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
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_cleaner ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_cleaner ON reviews(cleaner_id);
