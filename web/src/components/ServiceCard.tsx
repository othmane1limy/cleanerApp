'use client'

import { Card, CardBody, Button, Chip, Avatar } from '@nextui-org/react'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'

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

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const formatCurrency = (amount: number) => {
    return `${amount} MAD`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) {
      return `${mins}min`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${mins}min`
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {service.description}
            </p>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(service.price)}
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="flex flex-wrap gap-1 mb-4">
          {service.serviceTypes.slice(0, 3).map((type) => (
            <Chip key={type} size="sm" variant="flat" color="primary">
              {type}
            </Chip>
          ))}
          {service.serviceTypes.length > 3 && (
            <Chip size="sm" variant="flat" color="default">
              +{service.serviceTypes.length - 3} more
            </Chip>
          )}
        </div>

        {/* Cleaner Info */}
        <div className="flex items-center mb-4">
          <Avatar
            size="sm"
            name={service.cleaner.name}
            src={service.cleaner.avatar}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {service.cleaner.name}
              </span>
              {service.cleaner.verified && (
                <CheckCircle size={14} className="text-green-500 ml-1" />
              )}
            </div>
            <div className="flex items-center mt-1">
              <Star size={12} className="text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-sm text-gray-600">
                {service.rating} ({service.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Duration and Location */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatDuration(service.duration)}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span className="truncate max-w-24">
              {service.location.address}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <Button
          color="primary"
          className="w-full"
          size="md"
        >
          Book Now
        </Button>
      </CardBody>
    </Card>
  )
}
