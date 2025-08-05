import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock cleaner data
  const cleanerData = {
    id: "cleaner_001",
    name: "Ahmed Benali",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    totalReviews: 127,
    isOnline: true,
    serviceType: "mobile",
    phone: "+212661234567",
    email: "ahmed.benali@cleanfinder.ma",
    completedJobs: 342,
    responseTime: "< 15min",
    experienceYears: 5,
    distance: 2.3,
    location: {
      lat: 33.5731,
      lng: -7.5898,
      address: language === 'ar' ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'
    },
    description: language === 'ar' 
      ? `خبير في تنظيف السيارات مع أكثر من 5 سنوات من الخبرة. أقدم خدمات تنظيف عالية الجودة باستخدام منتجات صديقة للبيئة. متخصص في التنظيف الداخلي والخارجي والتلميع المتقدم.`
      : `Expert en nettoyage automobile avec plus de 5 ans d'expérience. Je propose des services de nettoyage de haute qualité en utilisant des produits écologiques. Spécialisé dans le nettoyage intérieur, extérieur et le détailing avancé.`,
    certifications: [
      language === 'ar' ? 'شهادة تنظيف السيارات المهنية' : 'Certification Nettoyage Auto Professionnel',
      language === 'ar' ? 'تدريب المنتجات البيئية' : 'Formation Produits Écologiques'
    ]
  };

  // Mock services data
  const servicesData = [
    {
      id: "service_001",
      type: "exterior",
      name: language === 'ar' ? 'غسيل خارجي شامل' : 'Lavage extérieur complet',
      description: language === 'ar' ?'غسيل شامل للجزء الخارجي من السيارة مع تنظيف الإطارات والجنوط وتلميع الهيكل' :'Lavage complet de l\'extérieur avec nettoyage des pneus, jantes et lustrage de la carrosserie',
      price: 80,
      originalPrice: 100,
      duration: 45,
      isPopular: true,
      isEco: true,
      includes: [
        language === 'ar' ? 'غسيل الهيكل' : 'Lavage carrosserie',
        language === 'ar' ? 'تنظيف الإطارات' : 'Nettoyage pneus',
        language === 'ar' ? 'تلميع الزجاج' : 'Lustrage vitres',
        language === 'ar' ? 'تنظيف الجنوط' : 'Nettoyage jantes'
      ]
    },
    {
      id: "service_002", 
      type: "interior",
      name: language === 'ar' ? 'تنظيف داخلي متقدم' : 'Nettoyage intérieur avancé',
      description: language === 'ar' ?'تنظيف عميق للمقاعد والسجاد ولوحة القيادة مع تعطير وتعقيم' :'Nettoyage en profondeur des sièges, tapis, tableau de bord avec parfumage et désinfection',
      price: 120,
      duration: 60,
      isPopular: false,
      isEco: true,
      includes: [
        language === 'ar' ? 'تنظيف المقاعد' : 'Nettoyage sièges',
        language === 'ar' ? 'تنظيف السجاد' : 'Nettoyage tapis',
        language === 'ar' ? 'تلميع لوحة القيادة' : 'Lustrage tableau de bord',
        language === 'ar' ? 'تعطير وتعقيم' : 'Parfumage et désinfection'
      ]
    },
    {
      id: "service_003",
      type: "complete",
      name: language === 'ar' ? 'خدمة شاملة' : 'Service complet',
      description: language === 'ar' ?'خدمة تنظيف شاملة تجمع بين التنظيف الداخلي والخارجي مع التلميع' :'Service de nettoyage complet combinant intérieur, extérieur et lustrage',
      price: 180,
      originalPrice: 220,
      duration: 90,
      isPopular: true,
      isEco: true,
      includes: [
        language === 'ar' ? 'جميع خدمات التنظيف الخارجي' : 'Tous services extérieur',
        language === 'ar' ? 'جميع خدمات التنظيف الداخلي' : 'Tous services intérieur',
        language === 'ar' ? 'تلميع متقدم' : 'Lustrage avancé',
        language === 'ar' ? 'حماية الطلاء' : 'Protection peinture'
      ]
    },
    {
      id: "service_004",
      type: "detailing",
      name: language === 'ar' ? 'تفصيل متقدم' : 'Détailing premium',
      description: language === 'ar' ?'خدمة تفصيل متقدمة مع تلميع احترافي وحماية طويلة المدى' :'Service de détailing premium avec lustrage professionnel et protection longue durée',
      price: 300,
      duration: 150,
      isPopular: false,
      isEco: false,
      includes: [
        language === 'ar' ? 'تنظيف عميق شامل' : 'Nettoyage complet approfondi',
        language === 'ar' ? 'تلميع احترافي' : 'Lustrage professionnel',
        language === 'ar' ? 'حماية السيراميك' : 'Protection céramique',
        language === 'ar' ? 'تنظيف المحرك' : 'Nettoyage moteur'
      ]
    }
  ];

  // Mock gallery photos
  const galleryPhotos = [
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'قبل التنظيف - سيارة متسخة' : 'Avant nettoyage - Voiture sale',
      category: "before"
    },
    {
      url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'بعد التنظيف - نتيجة مثالية' : 'Après nettoyage - Résultat parfait',
      category: "after"
    },
    {
      url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'تنظيف المقاعد الجلدية' : 'Nettoyage sièges cuir',
      category: "process"
    },
    {
      url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'تلميع الهيكل الخارجي' : 'Lustrage carrosserie extérieure',
      category: "process"
    },
    {
      url: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'معدات التنظيف المهنية' : 'Équipement professionnel',
      category: "equipment"
    },
    {
      url: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400&h=300&fit=crop",
      caption: language === 'ar' ? 'مساحة العمل المنظمة' : 'Espace de travail organisé',
      category: "workspace"
    }
  ];

  // Mock reviews data
  const reviewsData = [
    {
      id: "review_001",
      customerName: "Youssef Alami",
      customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      date: new Date(Date.now() - 86400000 * 2),
      serviceType: "complete",
      comment: language === 'ar'
        ? `خدمة ممتازة جداً! أحمد محترف حقيقي وقام بتنظيف سيارتي بشكل مثالي. النتيجة فاقت توقعاتي والسعر معقول جداً. أنصح به بشدة!`
        : `Service excellent ! Ahmed est un vrai professionnel qui a nettoyé ma voiture parfaitement. Le résultat a dépassé mes attentes et le prix est très raisonnable. Je le recommande vivement !`,
      isVerified: true,
      helpfulCount: 12,
      photos: [
        "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=100&h=100&fit=crop"
      ],
      cleanerResponse: {
        date: new Date(Date.now() - 86400000 * 1),
        message: language === 'ar'
          ? `شكراً لك يوسف على هذا التقييم الرائع! سعيد جداً أن الخدمة أعجبتك. أتطلع للعمل معك مرة أخرى قريباً.`
          : `Merci Youssef pour cet excellent avis ! Je suis très heureux que le service vous ait plu. J'ai hâte de travailler avec vous à nouveau bientôt.`
      }
    },
    {
      id: "review_002",
      customerName: "Fatima Benkirane",
      customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      date: new Date(Date.now() - 86400000 * 5),
      serviceType: "interior",
      comment: language === 'ar'? `تنظيف داخلي رائع! المقاعد أصبحت كالجديدة والرائحة منعشة جداً. أحمد دقيق في عمله ومهذب في التعامل.`: `Nettoyage intérieur fantastique ! Les sièges sont comme neufs et l'odeur est très fraîche. Ahmed est précis dans son travail et poli dans ses relations.`,
      isVerified: true,
      helpfulCount: 8
    },
    {
      id: "review_003",
      customerName: "Omar Tazi",
      customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      date: new Date(Date.now() - 86400000 * 10),
      serviceType: "exterior",
      comment: language === 'ar'
        ? `خدمة جيدة جداً، السيارة أصبحت لامعة ونظيفة. الوقت كان أطول قليلاً من المتوقع لكن النتيجة ممتازة.`
        : `Très bon service, la voiture est brillante et propre. Le temps était un peu plus long que prévu mais le résultat est excellent.`,
      isVerified: false,
      helpfulCount: 5
    }
  ];

  // Mock availability schedule
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
    if (!userLocation) return cleanerData?.distance;
    // Mock distance calculation - in real app would use proper geolocation
    return cleanerData?.distance;
  };

  // Handle actions
  const handleCall = () => {
    window.location.href = `tel:${cleanerData?.phone}`;
  };

  const handleDirections = () => {
    const { lat, lng } = cleanerData?.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleBooking = (route) => {
    navigate(route, { 
      state: { 
        cleaner: cleanerData, 
        selectedService: cleanerData?.services?.[0] 
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
    services: servicesData?.length,
    photos: galleryPhotos?.length,
    reviews: reviewsData?.length
  };

  // Loading state
  if (isLoading) {
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
        onCall={() => window.open(`tel:${cleanerData?.phone}`)}
        onDirections={() => window.open(`https://maps.google.com/?q=${cleanerData?.address}`)}
        onBooking={handleBooking}
        onShare={handleShare}
        onSave={handleSave}
      />
    </div>
  );
};

export default CleanerProfileDetail;