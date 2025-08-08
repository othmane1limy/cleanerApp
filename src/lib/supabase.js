
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authService = {
  // Sign up user (client or cleaner)
  async signUp(email, password, userType, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...userData
        }
      }
    })
    
    if (data.user && !error) {
      // Create profile in respective table
      const profileTable = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles'
      const profileData = {
        user_id: data.user.id,
        ...userData
      }
      
      const { error: profileError } = await supabase
        .from(profileTable)
        .insert([profileData])
        
      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }
    
    return { data, error }
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  async getUserProfile(userId, userType) {
    const table = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles'
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
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
        cleaner_services(*),
        cleaner_images(*),
        reviews(rating, comment, created_at, client_profiles(first_name, last_name))
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

    const { data, error } = await query
    return { data, error }
  },

  // Get single cleaner by ID
  async getCleanerById(cleanerId) {
    const { data, error } = await supabase
      .from('cleaner_profiles')
      .select(`
        *,
        cleaner_services(*),
        cleaner_images(*),
        reviews(*, client_profiles(first_name, last_name))
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
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select(`
        *,
        cleaner_profiles(first_name, last_name, business_name, phone),
        cleaner_services(name, price)
      `)
      .single()
    return { data, error }
  },

  // Get bookings for user
  async getUserBookings(userId, userType = 'client') {
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
    return { data, error }
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
    const { data, error } = await supabase
      .from('client_profiles')
      .update(profileData)
      .eq('user_id', clientId)
      .select()
      .single()
    return { data, error }
  },

  // Get client profile
  async getProfile(clientId) {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('user_id', clientId)
      .single()
    return { data, error }
  }
}
