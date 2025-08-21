import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

export class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = Cookies.get('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors and token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = Cookies.get('refreshToken')
            if (refreshToken) {
              const response = await this.instance.post('/auth/refresh', {
                refreshToken,
              })

              const { accessToken, refreshToken: newRefreshToken } = response.data
              Cookies.set('accessToken', accessToken)
              Cookies.set('refreshToken', newRefreshToken)

              originalRequest.headers.Authorization = `Bearer ${accessToken}`
              return this.instance(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }

        // Handle other errors
        const message = error.response?.data?.message || error.message || 'An error occurred'
        toast.error(message)

        return Promise.reject(error)
      }
    )
  }

  // Authentication endpoints
  auth = {
    register: (type: 'client' | 'cleaner', data: any) =>
      this.instance.post(`/auth/register/${type}`, data),
    login: (data: { email: string; password: string }) =>
      this.instance.post('/auth/login', data),
    verifyEmail: (data: { email: string; code: string }) =>
      this.instance.post('/auth/verify-email', data),
    logout: () => this.instance.post('/auth/logout'),
    refresh: (refreshToken: string) =>
      this.instance.post('/auth/refresh', { refreshToken }),
  }

  // User endpoints
  users = {
    getProfile: () => this.instance.get('/users/profile'),
    updateClientProfile: (data: any) => this.instance.put('/users/profile/client', data),
    updateCleanerProfile: (data: any) => this.instance.put('/users/profile/cleaner', data),
    updateAvailability: (active: boolean) => this.instance.put('/users/cleaner/availability', { active }),
    updateLocation: (lat: number, lng: number) => this.instance.put('/users/cleaner/location', { lat, lng }),
    uploadDocument: (file: FormData) => this.instance.post('/users/cleaner/documents', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getDocuments: () => this.instance.get('/users/cleaner/documents'),
    createLocation: (data: any) => this.instance.post('/users/locations', data),
    getLocations: () => this.instance.get('/users/locations'),
    deleteLocation: (locationId: string) => this.instance.delete(`/users/locations/${locationId}`),
    getCleanerStats: () => this.instance.get('/users/cleaner/stats'),
    searchCleaners: (params: any) => this.instance.get('/users/cleaners/search', { params }),
  }

  // Services endpoints
  services = {
    getCategories: () => this.instance.get('/services/categories'),
    search: (params: any) => this.instance.get('/services/search', { params }),
    getStatistics: () => this.instance.get('/services/statistics'),
    getAll: () => this.instance.get('/services'),
    getById: (id: string) => this.instance.get(`/services/${id}`),
    getMyServices: () => this.instance.get('/services/cleaner/my-services'),
    createService: (data: any) => this.instance.post('/services/cleaner/my-services', data),
    updateService: (id: string, data: any) => this.instance.put(`/services/cleaner/my-services/${id}`, data),
    deleteService: (id: string) => this.instance.delete(`/services/cleaner/my-services/${id}`),
    getServiceAddons: (serviceId: string) => this.instance.get(`/services/cleaner/my-services/${serviceId}/addons`),
    createAddon: (serviceId: string, data: any) => this.instance.post(`/services/cleaner/my-services/${serviceId}/addons`, data),
    updateAddon: (addonId: string, data: any) => this.instance.put(`/services/cleaner/addons/${addonId}`, data),
    deleteAddon: (addonId: string) => this.instance.delete(`/services/cleaner/addons/${addonId}`),
    getServicePhotos: (serviceId: string) => this.instance.get(`/services/cleaner/my-services/${serviceId}/photos`),
    uploadPhoto: (serviceId: string, file: FormData) => this.instance.post(`/services/cleaner/my-services/${serviceId}/photos`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deletePhoto: (photoId: string) => this.instance.delete(`/services/cleaner/photos/${photoId}`),
  }

  // Bookings endpoints
  bookings = {
    create: (data: any) => this.instance.post('/bookings', data),
    getAll: (params?: any) => this.instance.get('/bookings', { params }),
    getById: (id: string) => this.instance.get(`/bookings/${id}`),
    updateStatus: (id: string, status: string, meta?: any) => 
      this.instance.put(`/bookings/${id}/status`, { status, meta }),
    confirm: (id: string, reviewData?: any) => this.instance.post(`/bookings/${id}/confirm`, reviewData),
    cancel: (id: string, reason?: string) => this.instance.post(`/bookings/${id}/cancel`, { reason }),
    track: (id: string) => this.instance.get(`/bookings/${id}/track`),
    getHistory: (id: string) => this.instance.get(`/bookings/${id}/history`),
    getPending: () => this.instance.get('/bookings/cleaner/pending'),
    getCleanerBookings: (status?: string) => this.instance.get('/bookings/cleaner/my-bookings', {
      params: status ? { status } : {},
    }),
  }

  // Payments endpoints
  payments = {
    getWallet: () => this.instance.get('/payments/wallet'),
    getTransactions: (params?: any) => this.instance.get('/payments/wallet/transactions', { params }),
    getStatistics: () => this.instance.get('/payments/wallet/statistics'),
    initiateRecharge: (amountMad: number) => this.instance.post('/payments/recharge/initiate', { amountMad }),
    completeRecharge: (paypalOrderId: string) => this.instance.post('/payments/recharge/complete', { paypalOrderId }),
    getCommissions: (params?: any) => this.instance.get('/payments/commissions', { params }),
    getCommissionSummary: () => this.instance.get('/payments/commissions/summary'),
  }

  // Admin endpoints
  admin = {
    getDashboard: () => this.instance.get('/admin/dashboard'),
    getAnalytics: (params?: any) => this.instance.get('/admin/analytics', { params }),
    getSystemHealth: () => this.instance.get('/admin/health'),
    getUsers: (params?: any) => this.instance.get('/admin/users', { params }),
    getUserDetails: (userId: string) => this.instance.get(`/admin/users/${userId}`),
    getPendingVerifications: () => this.instance.get('/admin/verifications/pending'),
    reviewDocument: (documentId: string, status: string, reason?: string) =>
      this.instance.put(`/admin/verifications/documents/${documentId}`, { status, reason }),
    updateCleanerVerification: (cleanerId: string, verified: boolean, reason?: string) =>
      this.instance.put(`/admin/verifications/cleaner/${cleanerId}`, { verified, reason }),
    getDisputes: (params?: any) => this.instance.get('/admin/disputes', { params }),
    getDisputeDetails: (disputeId: string) => this.instance.get(`/admin/disputes/${disputeId}`),
    resolveDispute: (disputeId: string, status: string, resolutionNote: string) =>
      this.instance.put(`/admin/disputes/${disputeId}/resolve`, { status, resolutionNote }),
    getFraudFlags: (params?: any) => this.instance.get('/admin/fraud-flags', { params }),
    createFraudFlag: (data: any) => this.instance.post('/admin/fraud-flags', data),
    getAuditLogs: (params?: any) => this.instance.get('/admin/audit-logs', { params }),
    getModerationQueue: () => this.instance.get('/admin/moderation-queue'),
    updateSettings: (settings: any) => this.instance.put('/admin/settings', settings),
  }

  // Health endpoints
  health = {
    check: () => this.instance.get('/health'),
    ready: () => this.instance.get('/health/ready'),
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
