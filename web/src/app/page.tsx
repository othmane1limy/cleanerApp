'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Users, Shield, Sparkles, ArrowRight, Phone } from 'lucide-react';

// Mock data for demonstration with beautiful example services
const mockServices = [
  {
    id: '1',
    name: 'Premium Car Wash',
    description: 'Complete interior and exterior cleaning with premium products and hand-wax finish',
    price: 150,
    currency: 'MAD',
    duration: '2h',
    category: 'premium',
    tags: ['exterior', 'interior', 'wax', 'vacuum'],
    cleaner: {
      name: 'Ahmed El Mansouri',
      rating: 4.9,
      reviewCount: 127,
      verified: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
    },
    location: {
      city: 'Casablanca',
      country: 'Morocco',
      distance: '2.3 km'
    },
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop&auto=format&q=80',
  },
  {
    id: '2',
    name: 'Quick Exterior Clean',
    description: 'Fast and efficient exterior wash perfect for busy schedules',
    price: 80,
    currency: 'MAD',
    duration: '45min',
    category: 'quick',
    tags: ['exterior', 'quick', 'eco-friendly'],
    cleaner: {
      name: 'Youssef Benali',
      rating: 4.7,
      reviewCount: 89,
      verified: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
    },
    location: {
      city: 'Casablanca',
      country: 'Morocco',
      distance: '1.8 km'
    },
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=250&fit=crop&auto=format&q=80',
  },
  {
    id: '3',
    name: 'Deep Interior Clean',
    description: 'Comprehensive interior detailing with leather conditioning and carpet deep clean',
    price: 120,
    currency: 'MAD',
    duration: '1.5h',
    category: 'interior',
    tags: ['interior', 'leather', 'carpet', 'sanitize'],
    cleaner: {
      name: 'Fatima Zahra',
      rating: 4.8,
      reviewCount: 156,
      verified: true,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format&q=80'
    },
    location: {
      city: 'Casablanca',
      country: 'Morocco',
      distance: '3.1 km'
    },
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop&auto=format&q=80',
  },
];

const ServiceCard = ({ service }: { service: any }) => (
  <div className="service-card animate-fadeInUp group cursor-pointer">
    <div className="relative overflow-hidden rounded-lg mb-4">
      <img 
        src={service.image} 
        alt={service.name}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3">
        <span className="price-badge">
          {service.price} {service.currency}
        </span>
      </div>
    </div>
    
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src={service.cleaner.image} 
            alt={service.cleaner.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-900">{service.cleaner.name}</span>
              {service.cleaner.verified && (
                <Shield className="w-3 h-3 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 rating" fill="currentColor" />
              <span className="rating-text">{service.cleaner.rating} ({service.cleaner.reviewCount})</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="location-badge">
            <MapPin className="w-3 h-3" />
            {service.location.distance}
          </div>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {service.duration}
          </div>
        </div>
      </div>
      
      <button className="btn-primary w-full mt-4 flex items-center justify-center space-x-2">
        <span>Book Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState(mockServices);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const filtered = mockServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredServices(filtered);
  }, [searchTerm]);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Glass Morphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mr-2" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Professional Car Cleaning Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              Find Professional 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}Cleaning Services
              </span>
              <br />Near You
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Connect with verified cleaners in Casablanca. Book instantly, track in real-time, pay securely.
            </p>
          </div>

          {/* Search Section with Glass Effect */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            <div className="glass max-w-2xl mx-auto p-4">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for cleaning services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-box flex-1"
                />
                <button className="btn-primary px-8">
                  Search
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4 text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">Casablanca, Morocco • {filteredServices.length} services available</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 transition-all duration-1000 delay-500 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0 translate-y-10'}`}>
            {[
              { number: '500+', label: 'Happy Customers', icon: Users },
              { number: '50+', label: 'Verified Cleaners', icon: Shield },
              { number: '1000+', label: 'Services Completed', icon: Sparkles },
              { number: '4.8★', label: 'Average Rating', icon: Star },
            ].map((stat, index) => (
              <div key={stat.label} className="glass p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Popular Cleaning Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our verified professional cleaners with top ratings and excellent reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div key={service.id} style={{animationDelay: `${index * 100}ms`}}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 animate-fadeInUp">
              <div className="glass max-w-md mx-auto p-8">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">
                  No services found matching "{searchTerm}"
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 glass mx-4 my-8 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your car cleaned in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Find Services',
                description: 'Browse cleaners near you with ratings, prices, and real customer reviews',
                icon: Search,
                color: 'from-blue-500 to-purple-500'
              },
              {
                step: '02',
                title: 'Book Instantly',
                description: 'Choose your preferred time slot and confirm your booking in seconds',
                icon: Clock,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Track & Pay',
                description: 'Track cleaner location in real-time and pay securely after completion',
                icon: MapPin,
                color: 'from-pink-500 to-red-500'
              },
            ].map((item, index) => (
              <div key={item.step} className="text-center animate-fadeInUp" style={{animationDelay: `${index * 200}ms`}}>
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <item.icon className="text-white" size={32} />
                </div>
                <div className="text-sm font-bold text-gray-400 mb-2">STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12 text-white/90">
              Join thousands of satisfied customers and professional cleaners in Casablanca
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="btn-secondary text-lg px-12 py-4 inline-flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Book a Service</span>
              </button>
              <button className="btn-primary text-lg px-12 py-4 inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30">
                <Shield className="w-5 h-5" />
                <span>Become a Cleaner</span>
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-2 text-white/80">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Need help? Call +212 5XX-XXXX-XX</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
