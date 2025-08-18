import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authService = {
  // Sign up user (client or cleaner) - profile created immediately by database trigger
  async signUp(email, password, userType, userData) {
    try {
      console.log('Starting signUp process for:', email, userType);
      console.log('User data being passed:', userData);
      
      // Store user data in auth metadata - database trigger will create profile immediately
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            ...userData // Store all profile data directly in metadata
          }
        }
      })
      
      console.log('Supabase auth response:', { data, error });
      
      if (error) {
        console.error('Auth signup error:', error)
        return { data: null, error }
      }
      
      if (data.user) {
        console.log('User created successfully, profile should be created automatically by database trigger');
        console.log('User metadata:', data.user.user_metadata);
        
        // Wait longer for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to get the created profile with retry logic
        const maxRetries = 5;
        let profileData = null;
        let profileError = null;
        
        for (let i = 0; i < maxRetries; i++) {
          try {
            const profileTable = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles';
            console.log(`Checking for profile in table: ${profileTable} (attempt ${i + 1}/${maxRetries})`);
            
            const { data: checkProfileData, error: checkProfileError } = await supabase
              .from(profileTable)
              .select('*')
              .eq('user_id', data.user.id)
              .single();
              
            if (checkProfileError) {
              console.error(`Profile check ${i + 1} failed:`, checkProfileError);
              profileError = checkProfileError;
              
              if (i < maxRetries - 1) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                continue;
              }
            } else {
              console.log('Profile created successfully by trigger:', checkProfileData);
              profileData = checkProfileData;
              break;
            }
          } catch (profileCheckError) {
            console.error(`Profile check ${i + 1} exception:`, profileCheckError);
            if (i === maxRetries - 1) {
              profileError = profileCheckError;
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
        }
        
        if (!profileData) {
          console.error('Profile not created after maximum retries');
          console.error('Final profile error:', profileError);
        }
      }
      
      // No email verification required - user can login immediately
      return { 
        data, 
        error: null,
        requiresEmailVerification: false
      }
    } catch (error) {
      console.error('Signup exception:', error)
      return { data: null, error }
    }
  },

  // Sign in user
  async signIn(email, password) {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error }
      }
      
      if (data?.user) {
        console.log('Sign in successful for user:', data.user.id);
        console.log('User metadata:', data.user.user_metadata);
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Signin exception:', error)
      return { data: null, error }
    }
  },

  // Sign out user
  async signOut() {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
      
      return { error }
    } catch (error) {
      console.error('Signout exception:', error)
      return { error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Get current user error:', error);
        return null;
      }
      
      console.log('Current user:', user?.id || 'none');
      return user
    } catch (error) {
      console.error('Get current user exception:', error)
      return null
    }
  },

  // Get user profile with better error handling
  async getUserProfile(userId, userType) {
    try {
      console.log(`Getting user profile for ${userId} (${userType})`);
      
      if (!userId || !userType) {
        console.error('Missing userId or userType');
        return { data: null, error: { message: 'Missing userId or userType' } };
      }
      
      const table = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles'
      console.log(`Querying table: ${table}`);
      console.log('Profile data:');
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Get user profile error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        console.log('Profile retrieved successfully:', !!data);
      }
      return { data, error }
    } catch (error) {
      console.error('Get user profile exception:', error)
      return { data: null, error }
    }
  },

  // Check if user has profile (no email verification needed)
  async checkUserProfile() {
    try {
      console.log('Checking user profile...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting user:', userError);
        return { hasProfile: false, user: null, profile: null }
      }
      
      if (!user) {
        console.log('No authenticated user found');
        return { hasProfile: false, user: null, profile: null }
      }
      
      console.log('User found:', user.id);
      
      const userType = user.user_metadata?.user_type
      if (!userType) {
        console.log('No user type found in metadata');
        return { hasProfile: false, user, profile: null }
      }
      
      console.log('User type:', userType);
      
      const { data: profileData, error: profileError } = await this.getUserProfile(user.id, userType)
      
      if (profileError) {
        console.error('Error getting profile during check:', profileError);
        return { hasProfile: false, user, profile: null }
      }
      
      const hasProfile = !!profileData;
      console.log('Profile check result:', { hasProfile, profileExists: !!profileData });
      
      return { 
        hasProfile, 
        user,
        profile: profileData
      }
    } catch (error) {
      console.error('Check user profile exception:', error)
      return { hasProfile: false, user: null, profile: null }
    }
  }
}

// Cleaner service functions
export const cleanerService = {
  // Get all active cleaners with services
  async getCleaners(filters = {}) {
    let query = supabase
      .from('cleaner_profiles')
      .select(`
        *,
        cleaner_services!cleaner_services_cleaner_id_fkey(*)
      `)
      .eq('is_active', true)

    if (filters.service_area) {
      query = query.ilike('service_area', `%${filters.service_area}%`)
    }

    if (filters.is_mobile !== undefined) {
      query = query.eq('is_mobile', filters.is_mobile)
    }

    if (filters.has_garage !== undefined) {
      query = query.eq('has_garage', filters.has_garage)
    }

    if (filters.search) {
      query = query.or(`
        first_name.ilike.%${filters.search}%,
        last_name.ilike.%${filters.search}%,
        business_name.ilike.%${filters.search}%,
        service_area.ilike.%${filters.search}%
      `)
    }

    if (filters.availability !== undefined) {
      query = query.eq('is_available', filters.availability)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Search cleaners with enhanced filtering
  async searchCleaners(searchTerm, filters = {}) {
    try {
      console.log('Searching cleaners with term:', searchTerm);
      
      let query = supabase
        .from('cleaner_profiles')
        .select(`
          *,
          cleaner_services!cleaner_services_cleaner_id_fkey(*)
        `)
        .eq('is_active', true);

      if (searchTerm) {
        // Search in multiple fields
        query = query.or(`
          first_name.ilike.%${searchTerm}%,
          last_name.ilike.%${searchTerm}%,
          business_name.ilike.%${searchTerm}%,
          service_area.ilike.%${searchTerm}%,
          bio.ilike.%${searchTerm}%
        `);
      }

      // Apply additional filters
      if (filters.service_area) {
        query = query.ilike('service_area', `%${filters.service_area}%`);
      }

      if (filters.is_mobile !== undefined) {
        query = query.eq('is_mobile', filters.is_mobile);
      }

      if (filters.has_garage !== undefined) {
        query = query.eq('has_garage', filters.has_garage);
      }

      if (filters.is_available !== undefined) {
        query = query.eq('is_available', filters.is_available);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) {
        console.error('Search cleaners error:', error);
      } else {
        console.log(`Found ${data?.length || 0} cleaners`);
      }
        
      return { data, error };
    } catch (error) {
      console.error('Search cleaners exception:', error);
      return { data: null, error };
    }
  },

  // Get single cleaner by ID
  async getCleanerById(cleanerId) {
    const { data, error } = await supabase
      .from('cleaner_profiles')
      .select(`
        *,
        cleaner_services!cleaner_services_cleaner_id_fkey(*)
      `)
      .eq('user_id', cleanerId)
      .single()
    return { data, error }
  },

  // Update cleaner profile
  async updateProfile(cleanerId, profileData) {
    const { data, error } = await supabase
      .from('cleaner_profiles')
      .update(profileData)
      .eq('user_id', cleanerId)
      .select()
      .single()
    return { data, error }
  },

  // Update availability status
  async updateAvailability(cleanerId, isAvailable) {
    const { data, error } = await supabase
      .from('cleaner_profiles')
      .update({ is_available: isAvailable })
      .eq('user_id', cleanerId)
      .select()
      .single()
    return { data, error }
  },

  // Get cleaner earnings
  async getEarnings(cleanerId) {
    const { data, error } = await supabase
      .from('cleaner_earnings')
      .select('*')
      .eq('cleaner_id', cleanerId)
      .order('month', { ascending: false })
    return { data, error }
  },

  // Get total earnings
  async getTotalEarnings(cleanerId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('price')
      .eq('cleaner_id', cleanerId)
      .eq('status', 'completed')

    const totalEarnings = data?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0
    return { data: totalEarnings, error }
  },

  // Get cleaner services
  async getServices(cleanerId) {
    const { data, error } = await supabase
      .from('cleaner_services')
      .select('*')
      .eq('cleaner_id', cleanerId)
      .eq('is_active', true)
    return { data, error }
  },

  // Add service
  async addService(cleanerId, serviceData) {
    const { data, error } = await supabase
      .from('cleaner_services')
      .insert({
        cleaner_id: cleanerId,
        ...serviceData
      })
      .select()
      .single()
    return { data, error }
  },

  // Update service
  async updateService(serviceId, serviceData) {
    const { data, error } = await supabase
      .from('cleaner_services')
      .update(serviceData)
      .eq('id', serviceId)
      .select()
      .single()
    return { data, error }
  },

  // Delete service
  async deleteService(serviceId) {
    const { error } = await supabase
      .from('cleaner_services')
      .delete()
      .eq('id', serviceId)
    return { error }
  },

  // Get gallery images
  async getGallery(cleanerId) {
    const { data, error } = await supabase
      .from('cleaner_images')
      .select('*')
      .eq('cleaner_id', cleanerId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Add gallery image
  async addGalleryImage(cleanerId, imageData) {
    const { data, error } = await supabase
      .from('cleaner_images')
      .insert({
        cleaner_id: cleanerId,
        ...imageData
      })
      .select()
      .single()
    return { data, error }
  },

  // Delete gallery image
  async deleteGalleryImage(imageId) {
    const { error } = await supabase
      .from('cleaner_images')
      .delete()
      .eq('id', imageId)
    return { error }
  }
}

// Booking service functions
export const bookingService = {
  // Create booking
  async createBooking(bookingData) {
    try {
      console.log('Creating booking with data:', bookingData);
      
      // Get service details to copy price
      let servicePrice = bookingData.total_price;
      if (bookingData.service_id) {
        const { data: serviceData } = await supabase
          .from('cleaner_services')
          .select('price')
          .eq('id', bookingData.service_id)
          .single();
        
        if (serviceData) {
          servicePrice = serviceData.price;
        }
      }
      
      const bookingToInsert = {
        ...bookingData,
        price: servicePrice // Copy service price to booking
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingToInsert)
        .select(`
          *,
          cleaner_profiles(first_name, last_name, business_name, phone),
          cleaner_services(name, price)
        `)
        .single()
        
      if (error) {
        console.error('Booking creation error:', error);
      } else {
        console.log('Booking created successfully:', data?.id);
      }
        
      return { data, error }
    } catch (error) {
      console.error('Booking creation exception:', error);
      return { data: null, error }
    }
  },

  // Get bookings for user
  async getUserBookings(userId, userType = 'client') {
    try {
      console.log(`Getting bookings for user ${userId} (${userType})`);
      
      const column = userType === 'client' ? 'client_id' : 'cleaner_id'
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cleaner_profiles(first_name, last_name, business_name, phone),
          client_profiles(first_name, last_name, phone),
          cleaner_services(name, price)
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false })
        
      if (error) {
        console.error('Get user bookings error:', error);
      } else {
        console.log(`Found ${data?.length || 0} bookings for user`);
      }
        
      return { data, error }
    } catch (error) {
      console.error('Get user bookings exception:', error);
      return { data: null, error }
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()
    return { data, error }
  },

  // Get single booking
  async getBookingById(bookingId) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        cleaner_profiles(first_name, last_name, business_name, phone),
        client_profiles(first_name, last_name, phone),
        cleaner_services(name, price, description)
      `)
      .eq('id', bookingId)
      .single()
    return { data, error }
  },

  // Subscribe to booking updates
  subscribeToBookings(userId, userType, callback) {
    const column = userType === 'client' ? 'client_id' : 'cleaner_id';
    
    const subscription = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${column}=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return subscription;
  },

  // Unsubscribe from bookings
  unsubscribeFromBookings(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

// Review service functions
export const reviewService = {
  // Create review
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()

    if (!error) {
      // Update cleaner's average rating
      await this.updateCleanerRating(reviewData.cleaner_id)
    }

    return { data, error }
  },

  // Get reviews for cleaner
  async getCleanerReviews(cleanerId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        client_profiles(first_name, last_name)
      `)
      .eq('cleaner_id', cleanerId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Update cleaner's average rating
  async updateCleanerRating(cleanerId) {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('cleaner_id', cleanerId)

    if (reviews && reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      const totalReviews = reviews.length

      await supabase
        .from('cleaner_profiles')
        .update({ 
          rating: parseFloat(avgRating.toFixed(1)), 
          total_reviews: totalReviews 
        })
        .eq('user_id', cleanerId)
    }
  }
}

// Client service functions
export const clientService = {
  // Update client profile
  async updateProfile(clientId, profileData) {
    try {
      console.log('Updating client profile for:', clientId);
      console.log('Profile data:', profileData);
      
      const { data, error } = await supabase
        .from('client_profiles')
        .update(profileData)
        .eq('user_id', clientId)
        .select()
        .single()
        
      if (error) {
        console.error('Client profile update error:', error);
      } else {
        console.log('Client profile updated successfully');
      }
        
      return { data, error }
    } catch (error) {
      console.error('Client profile update exception:', error);
      return { data: null, error }
    }
  },

  // Get client profile
  async getProfile(clientId) {
    try {
      console.log('Getting client profile for:', clientId);
      
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', clientId)
        .single()
        
      if (error) {
        console.error('Get client profile error:', error);
      } else {
        console.log('Client profile retrieved:', !!data);
      }
        
      return { data, error }
    } catch (error) {
      console.error('Get client profile exception:', error);
      return { data: null, error }
    }
  }
}