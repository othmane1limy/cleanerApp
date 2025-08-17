-- Fix existing users who don't have profiles
-- Run this script in your Supabase SQL editor to create profiles for existing users

-- First, let's see what users exist without profiles
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data,
    CASE 
        WHEN cp.user_id IS NOT NULL THEN 'Has client profile'
        WHEN clp.user_id IS NOT NULL THEN 'Has cleaner profile'
        ELSE 'No profile'
    END as profile_status
FROM auth.users u
LEFT JOIN client_profiles cp ON u.id = cp.user_id
LEFT JOIN cleaner_profiles clp ON u.id = clp.user_id
WHERE cp.user_id IS NULL AND clp.user_id IS NULL;

-- Create client profiles for users without profiles (assuming they are clients)
INSERT INTO client_profiles (
    user_id,
    first_name,
    last_name,
    phone,
    address
)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(u.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(u.raw_user_meta_data->>'phone', ''),
    COALESCE(u.raw_user_meta_data->>'address', '')
FROM auth.users u
LEFT JOIN client_profiles cp ON u.id = cp.user_id
LEFT JOIN cleaner_profiles clp ON u.id = clp.user_id
WHERE cp.user_id IS NULL 
    AND clp.user_id IS NULL 
    AND u.raw_user_meta_data->>'user_type' != 'cleaner';

-- Create cleaner profiles for users without profiles who are cleaners
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
)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(u.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(u.raw_user_meta_data->>'phone', ''),
    COALESCE(u.raw_user_meta_data->>'business_name', ''),
    COALESCE(u.raw_user_meta_data->>'national_id', ''),
    COALESCE(u.raw_user_meta_data->>'business_license', ''),
    COALESCE(u.raw_user_meta_data->>'vehicle_registration', ''),
    COALESCE(u.raw_user_meta_data->>'service_area', 'Unknown'),
    COALESCE((u.raw_user_meta_data->>'is_mobile')::boolean, true),
    COALESCE((u.raw_user_meta_data->>'has_garage')::boolean, false),
    COALESCE(u.raw_user_meta_data->>'garage_address', ''),
    COALESCE(u.raw_user_meta_data->>'working_hours', '{"start": "08:00", "end": "18:00"}')
FROM auth.users u
LEFT JOIN client_profiles cp ON u.id = cp.user_id
LEFT JOIN cleaner_profiles clp ON u.id = clp.user_id
WHERE cp.user_id IS NULL 
    AND clp.user_id IS NULL 
    AND u.raw_user_meta_data->>'user_type' = 'cleaner';

-- Verify the fix
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'user_type' as user_type,
    CASE 
        WHEN cp.user_id IS NOT NULL THEN 'Has client profile'
        WHEN clp.user_id IS NOT NULL THEN 'Has cleaner profile'
        ELSE 'No profile'
    END as profile_status
FROM auth.users u
LEFT JOIN client_profiles cp ON u.id = cp.user_id
LEFT JOIN cleaner_profiles clp ON u.id = clp.user_id
ORDER BY u.created_at DESC;
