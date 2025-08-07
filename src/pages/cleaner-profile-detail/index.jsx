
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { cleanerService, reviewService } from '../../lib/supabase';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import ProfileHero from './components/ProfileHero';
import TabNavigation from './components/TabNavigation';
import ServicesList from './components/ServicesList';
import PhotoGallery from './components/PhotoGallery';
import ReviewsList from './components/ReviewsList';
import AvailabilitySchedule from './components/AvailabilitySchedule';
import ActionBar from './components/ActionBar';
import Button from '../../components/ui/Button';

const CleanerProfileDetail = () => {
  const [language, setLanguage] = useState('fr');
  const [activeTab, setActiveTab] = useState('services');
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [cleanerData, setCleanerData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cleanerId } = useParams();

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('cleanfinder-language') || 'fr';
    setLanguage(savedLanguage);
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Get user location for distance calculation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          });
        },
        () => {
          // Fallback to Casablanca coordinates
          setUserLocation({ lat: 33.5731, lng: -7.5898 });
        }
      );
    } else {
      setUserLocation({ lat: 33.5731, lng: -7.5898 });
    }
  }, []);

  // Fetch cleaner data from Supabase
  useEffect(() => {
    const fetchCleanerData = async () => {
      if (!cleanerId) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Fetch cleaner profile with services and gallery
        const { data: cleaner, error: cleanerError } = await cleanerService.getCleanerById(cleanerId);
        
        if (cleanerError) {
          console.error('Error fetching cleaner:', cleanerError);
          setError('Failed to load cleaner profile');
          return;
        }

        if (!cleaner) {
          setError('Cleaner not found');
          return;
        }

        // Transform cleaner data to match component expectations
        const transformedCleaner = {
          id: cleaner.user_id,
          name: `${cleaner.first_name} ${cleaner.last_name}`,
          businessName: cleaner.business_name,
          profileImage: cleaner.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          rating: cleaner.rating || 0,
          totalReviews: cleaner.total_reviews || 0,
          isOnline: cleaner.is_active,
          serviceType: cleaner.is_mobile ? "mobile" : "garage",
          phone: cleaner.phone,
          completedJobs: 0, // This would need to be calculated from bookings
          responseTime: "< 15min", // This would need to be calculated
          experienceYears: 5, // This would need to be added to schema
          distance: 2.3, // This would need to be calculated based on user location
          location: {
            lat: 33.5731, // This would need to be stored in schema
            lng: -7.5898,
            address: cleaner.service_area
          },
          description: cleaner.bio || (language === 'ar' 
            ? `خبير في تنظيف السيارات. أقدم خدمات تنظيف عالية الجودة باستخدام منتجات صديقة للبيئة.`
            : `Expert en nettoyage automobile. Je propose des services de nettoyage de haute qualité en utilisant des produits écologiques.`),
          certifications: [], // This would need to be added to schema
          isActive: cleaner.is_active,
          hasMobile: cleaner.is_mobile,
          hasGarage: cleaner.has_garage,
          garageAddress: cleaner.garage_address,
          workingHours: cleaner.working_hours
        };

        setCleanerData(transformedCleaner);

        // Transform services data
        const transformedServices = cleaner.cleaner_services?.map(service => ({
          id: service.id,
          type: service.name.toLowerCase().includes('exterior') ? 'exterior' : 
                service.name.toLowerCase().includes('interior') ? 'interior' : 'complete',
          name: service.name,
          description: service.description || '',
          price: parseFloat(service.price),
          duration: service.duration || 60,
          isPopular: false, // This would need to be calculated
          isEco: true, // This would need to be added to schema
          includes: [] // This would need to be added to schema
        })) || [];

        setServicesData(transformedServices);

        // Transform gallery data
        const transformedGallery = cleaner.cleaner_gallery?.map(image => ({
          url: image.image_url,
          caption: image.caption || '',
          category: "work" // This would need to be added to schema
        })) || [];

        setGalleryPhotos(transformedGallery);

        // Transform reviews data
        const transformedReviews = cleaner.reviews?.map(review => ({
          id: review.id,
          customerName: `${review.client_profiles?.first_name} ${review.client_profiles?.last_name}`,
          customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
          rating: review.rating,
          date: new Date(review.created_at),
          serviceType: "complete",
          comment: review.comment,
          isVerified: true,
          helpfulCount: 0 // This would need to be added to schema
        })) || [];

        setReviewsData(transformedReviews);

      } catch (error) {
        console.error('Error fetching cleaner data:', error);
        setError('Failed to load cleaner profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCleanerData();
  }, [cleanerId, language]);

  // Mock availability schedule (this would need to be implemented in schema)
  const availabilitySchedule = {
    monday: {
      isAvailable: true,
      startTime: "08:00",
      endTime: "18:00",
      slots: [
        { startTime: "08:00", duration: 60, isAvailable: true },
        { startTime: "09:30", duration: 60, isAvailable: false },
        { startTime: "11:00", duration: 90, isAvailable: true },
        { startTime: "14:00", duration: 60, isAvailable: true },
        { startTime: "15:30", duration: 90, isAvailable: true },
        { startTime: "17:00", duration: 60, isAvailable: false }
      ]
    },
    tuesday: {
      isAvailable: true,
      startTime: "08:00", 
      endTime: "18:00",
      slots: [
        { startTime: "08:00", duration: 90, isAvailable: true },
        { startTime: "10:00", duration: 60, isAvailable: true },
        { startTime: "11:30", duration: 60, isAvailable: true },
        { startTime: "14:00", duration: 90, isAvailable: false },
        { startTime: "16:00", duration: 60, isAvailable: true }
      ]
    },
    wednesday: {
      isAvailable: true,
      startTime: "08:00",
      endTime: "18:00", 
      slots: [
        { startTime: "08:00", duration: 60, isAvailable: false },
        { startTime: "09:30", duration: 90, isAvailable: true },
        { startTime: "11:30", duration: 60, isAvailable: true },
        { startTime: "14:00", duration: 60, isAvailable: true },
        { startTime: "15:30", duration: 90, isAvailable: true }
      ]
    },
    thursday: {
      isAvailable: true,
      startTime: "08:00",
      endTime: "18:00",
      slots: [
        { startTime: "08:00", duration: 90, isAvailable: true },
        { startTime: "10:00", duration: 60, isAvailable: true },
        { startTime: "14:00", duration: 90, isAvailable: true },
        { startTime: "16:00", duration: 60, isAvailable: false }
      ]
    },
    friday: {
      isAvailable: true,
      startTime: "08:00",
      endTime: "17:00",
      slots: [
        { startTime: "08:00", duration: 60, isAvailable: true },
        { startTime: "09:30", duration: 90, isAvailable: true },
        { startTime: "14:00", duration: 60, isAvailable: true },
        { startTime: "15:30", duration: 60, isAvailable: false }
      ]
    },
    saturday: {
      isAvailable: true,
      startTime: "09:00",
      endTime: "16:00",
      slots: [
        { startTime: "09:00", duration: 90, isAvailable: true },
        { startTime: "11:00", duration: 60, isAvailable: true },
        { startTime: "14:00", duration: 90, isAvailable: true }
      ]
    },
    sunday: {
      isAvailable: false,
      slots: []
    }
  };

  // Calculate distance (mock calculation)
  const calculateDistance = () => {
    if (!userLocation || !cleanerData) return cleanerData?.distance || 0;
    // Mock distance calculation - in real app would use proper geolocation
    return cleanerData?.distance || 0;
  };

  // Handle actions
  const handleCall = () => {
    if (cleanerData?.phone) {
      window.location.href = `tel:${cleanerData.phone}`;
    }
  };

  const handleDirections = () => {
    const { lat, lng } = cleanerData?.location || {};
    if (lat && lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const handleBooking = (route) => {
    navigate(route, { 
      state: { 
        cleaner: cleanerData, 
        selectedService: servicesData?.[0] 
      } 
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cleanerData?.name,
        text: `${language === 'ar' ? 'شاهد ملف' : 'Voir le profil de'} ${cleanerData?.name}`,
        url: window.location.href
      });
    }
  };

  const handleSave = () => {
    // Handle save/bookmark functionality
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  // Tab counts
  const tabCounts = {
    services: servicesData?.length || 0,
    photos: galleryPhotos?.length || 0,
    reviews: reviewsData?.length || 0
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          showViewToggle={false}
          onLanguageChange={handleLanguageChange}
        />
        <div className="pt-15 px-4 lg:px-6 py-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {language === 'ar' ? 'خطأ في تحميل البيانات' : 'Erreur de chargement'}
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {language === 'ar' ? 'إعادة المحاولة' : 'Réessayer'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !cleanerData) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          showViewToggle={false}
          onLanguageChange={handleLanguageChange}
        />
        <div className="pt-15">
          <div className="animate-pulse">
            {/* Hero Skeleton */}
            <div className="px-4 lg:px-6 pt-6 pb-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-muted rounded-full"></div>
                <div className="space-y-2 text-center">
                  <div className="h-6 bg-muted rounded w-48"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
              </div>
            </div>

            {/* Tab Skeleton */}
            <div className="border-b border-border">
              <div className="flex space-x-4 px-4 lg:px-6">
                {[1, 2, 3, 4]?.map(i => (
                  <div key={i} className="h-10 bg-muted rounded w-20"></div>
                ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 lg:p-6 space-y-4">
              {[1, 2, 3]?.map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        showViewToggle={false}
        onLanguageChange={handleLanguageChange}
      />
      <NavigationBreadcrumb 
        language={language}
        customActions={
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              iconName="Heart"
              iconSize={16}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              iconName="Share"
              iconSize={16}
            />
          </div>
        }
      />
      <div className="pt-15 pb-32 md:pb-24">
        {/* Profile Hero */}
        <ProfileHero 
          cleaner={cleanerData}
          language={language}
          distance={calculateDistance()}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
          counts={tabCounts}
        />

        {/* Tab Content */}
        <div className="px-4 lg:px-6 py-6">
          {activeTab === 'services' && (
            <ServicesList 
              services={servicesData}
              language={language}
            />
          )}

          {activeTab === 'gallery' && (
            <PhotoGallery 
              photos={galleryPhotos}
              language={language}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsList 
              reviews={reviewsData}
              language={language}
              overallRating={cleanerData?.rating}
              totalReviews={cleanerData?.totalReviews}
            />
          )}

          {activeTab === 'availability' && (
            <AvailabilitySchedule 
              schedule={availabilitySchedule}
              language={language}
            />
          )}
        </div>
      </div>
      {/* Action Bar */}
      <ActionBar
        cleaner={cleanerData}
        language={language}
        onCall={handleCall}
        onDirections={handleDirections}
        onBooking={handleBooking}
        onShare={handleShare}
        onSave={handleSave}
      />
    </div>
  );
};

export default CleanerProfileDetail;
