'use client'

import { useState, useCallback } from 'react'

interface Location {
  lat: number
  lng: number
  address?: string
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      const newLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      // Try to get address from coordinates (mock for now)
      try {
        // In a real app, you'd use a reverse geocoding service
        newLocation.address = 'Casablanca, Morocco'
      } catch (geocodeError) {
        console.warn('Failed to get address from coordinates:', geocodeError)
      }

      setLocation(newLocation)
    } catch (geoError: any) {
      let errorMessage = 'Failed to get location'
      
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user.'
          break
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.'
          break
        case geoError.TIMEOUT:
          errorMessage = 'Location request timed out.'
          break
        default:
          errorMessage = 'An unknown error occurred while retrieving location.'
          break
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    location,
    isLoading,
    error,
    requestLocation,
  }
}
