
-- Users table is automatically created by Supabase Auth

-- Client Profiles
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaner Profiles
CREATE TABLE cleaner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  business_name VARCHAR(200),
  national_id VARCHAR(50) NOT NULL,
  business_license VARCHAR(100),
  vehicle_registration VARCHAR(50),
  service_area VARCHAR(200) NOT NULL,
  is_mobile BOOLEAN DEFAULT true,
  has_garage BOOLEAN DEFAULT false,
  garage_address TEXT,
  working_hours JSONB DEFAULT '{"start": "08:00", "end": "18:00"}',
  is_active BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaner Services
CREATE TABLE cleaner_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID REFERENCES cleaner_profiles(user_id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cleaner Images/Gallery
CREATE TABLE cleaner_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID REFERENCES cleaner_profiles(user_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(200),
  is_cover BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES cleaner_profiles(user_id) ON DELETE CASCADE,
  service_id UUID REFERENCES cleaner_services(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  booking_type VARCHAR(20) DEFAULT 'mobile' CHECK (booking_type IN ('mobile', 'garage')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  client_address TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES cleaner_profiles(user_id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cleaner_profiles_user_id ON cleaner_profiles(user_id);
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_cleaner_services_cleaner_id ON cleaner_services(cleaner_id);
CREATE INDEX idx_cleaner_images_cleaner_id ON cleaner_images(cleaner_id);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_cleaner_id ON bookings(cleaner_id);
CREATE INDEX idx_reviews_cleaner_id ON reviews(cleaner_id);

-- Enable Row Level Security (RLS)
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_profiles
CREATE POLICY "Users can view all client profiles" ON client_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own client profile" ON client_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own client profile" ON client_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own client profile" ON client_profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cleaner_profiles
CREATE POLICY "Users can view all cleaner profiles" ON cleaner_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own cleaner profile" ON cleaner_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cleaner profile" ON cleaner_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cleaner profile" ON cleaner_profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cleaner_services
CREATE POLICY "Users can view all cleaner services" ON cleaner_services FOR SELECT USING (true);
CREATE POLICY "Cleaners can manage their own services" ON cleaner_services FOR ALL USING (
  auth.uid() = cleaner_id OR 
  auth.uid() IN (SELECT user_id FROM cleaner_profiles WHERE user_id = cleaner_services.cleaner_id)
);

-- RLS Policies for cleaner_images
CREATE POLICY "Users can view all cleaner images" ON cleaner_images FOR SELECT USING (true);
CREATE POLICY "Cleaners can manage their own images" ON cleaner_images FOR ALL USING (
  auth.uid() = cleaner_id OR 
  auth.uid() IN (SELECT user_id FROM cleaner_profiles WHERE user_id = cleaner_images.cleaner_id)
);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = cleaner_id
);
CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = cleaner_id
);

-- RLS Policies for reviews
CREATE POLICY "Users can view all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Clients can create reviews for their bookings" ON reviews FOR INSERT WITH CHECK (
  auth.uid() = client_id AND 
  EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND client_id = auth.uid())
);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = client_id);
