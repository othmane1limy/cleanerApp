'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  rating: number
  reviewCount: number
  location: {
    lat: number
    lng: number
    address: string
  }
  cleaner: {
    id: string
    name: string
    avatar?: string
    verified: boolean
  }
  serviceTypes: string[]
  duration: number
  availability: string[]
}

interface UseServicesParams {
  lat?: number
  lng?: number
  radius?: number
  search?: string
}

export function useServices(params: UseServicesParams = {}) {
  const [data, setData] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Mock data for now - in real app, this would be an API call
        const mockServices: Service[] = [
          {
            id: '1',
            name: 'Premium Car Wash',
            description: 'Complete interior and exterior cleaning with premium products',
            price: 150,
            rating: 4.8,
            reviewCount: 127,
            location: {
              lat: 33.5731,
              lng: -7.5898,
              address: 'Casablanca, Morocco'
            },
            cleaner: {
              id: '1',
              name: 'Ahmed El Mansouri',
              verified: true
            },
            serviceTypes: ['exterior', 'interior', 'wax'],
            duration: 120,
            availability: ['morning', 'afternoon']
          },
          {
            id: '2',
            name: 'Quick Exterior Clean',
            description: 'Fast exterior wash and dry for busy schedules',
            price: 80,
            rating: 4.6,
            reviewCount: 89,
            location: {
              lat: 33.5890,
              lng: -7.6110,
              address: 'Casablanca, Morocco'
            },
            cleaner: {
              id: '2',
              name: 'Fatima Zahra',
              verified: true
            },
            serviceTypes: ['exterior'],
            duration: 45,
            availability: ['morning', 'afternoon', 'evening']
          },
          {
            id: '3',
            name: 'Deep Interior Detail',
            description: 'Thorough interior cleaning including seats, carpets, and dashboard',
            price: 120,
            rating: 4.9,
            reviewCount: 156,
            location: {
              lat: 33.5650,
              lng: -7.6000,
              address: 'Casablanca, Morocco'
            },
            cleaner: {
              id: '3',
              name: 'Youssef Benali',
              verified: true
            },
            serviceTypes: ['interior', 'vacuum', 'sanitize'],
            duration: 90,
            availability: ['afternoon']
          }
        ]

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Filter by search if provided
        let filteredServices = mockServices
        if (params.search) {
          filteredServices = mockServices.filter(service =>
            service.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            service.description.toLowerCase().includes(params.search!.toLowerCase())
          )
        }

        setData(filteredServices)
      } catch (err) {
        setError('Failed to fetch services')
        console.error('Error fetching services:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [params.lat, params.lng, params.radius, params.search])

  return {
    data,
    isLoading,
    error,
  }
}
