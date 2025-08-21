'use client'

import { useState } from 'react'

type UserRole = 'CLIENT' | 'CLEANER' | 'ADMIN'

interface User {
  id: string
  email: string
  role: UserRole
  emailVerified: boolean
  profile?: any
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email: email,
        role: 'CLIENT',
        emailVerified: true,
        profile: {
          name: 'John Doe',
          phone: '+212123456789'
        }
      }
      
      setUser(mockUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (type: 'client' | 'cleaner', data: any) => {
    setIsLoading(true)
    try {
      // Mock registration - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email: data.email,
        role: type === 'client' ? 'CLIENT' : 'CLEANER',
        emailVerified: false,
        profile: {
          name: data.name,
          phone: data.phone
        }
      }
      
      setUser(mockUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
  }

  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true)
    try {
      // Mock verification - in real app would call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (user) {
        setUser({
          ...user,
          emailVerified: true
        })
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    verifyEmail,
  }
}
