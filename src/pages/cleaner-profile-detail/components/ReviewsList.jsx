import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReviewsList = ({ reviews, language, overallRating, totalReviews }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const getTimeAgo = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInDays = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
    
    if (language === 'ar') {
      if (diffInDays === 0) return 'اليوم';
      if (diffInDays === 1) return 'أمس';
      if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
      if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
      return `منذ ${Math.floor(diffInDays / 30)} أشهر`;
    } else {
      if (diffInDays === 0) return 'Aujourd\'hui';
      if (diffInDays === 1) return 'Hier';
      if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
      if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
      return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={`${
          index < rating 
            ? 'text-warning fill-current' :'text-muted-foreground/30'
        }`}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[review.rating] = (distribution?.[review?.rating] || 0) + 1;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const getServiceTypeText = (serviceType) => {
    const serviceMap = {
      exterior: language === 'ar' ? 'غسيل خارجي' : 'Lavage extérieur',
      interior: language === 'ar' ? 'تنظيف داخلي' : 'Nettoyage intérieur',
      complete: language === 'ar' ? 'خدمة شاملة' : 'Service complet',
      detailing: language === 'ar' ? 'تفصيل متقدم' : 'Détailing avancé'
    };
    return serviceMap?.[serviceType] || serviceType;
  };

  const filteredReviews = selectedFilter === 'all' 
    ? displayedReviews 
    : displayedReviews?.filter(review => review?.rating === parseInt(selectedFilter));

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="font-data font-bold text-3xl text-foreground mb-1">
              {overallRating}
            </div>
            <div className="flex items-center justify-center mb-1">
              {renderStars(Math.round(overallRating))}
            </div>
            <div className="font-caption text-xs text-muted-foreground">
              {totalReviews} {language === 'ar' ? 'تقييم' : 'avis'}
            </div>
          </div>

          <div className="flex-1 ml-6 rtl:ml-0 rtl:mr-6">
            {[5, 4, 3, 2, 1]?.map(rating => {
              const count = ratingDistribution?.[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                  <span className="font-data text-xs text-muted-foreground w-3">
                    {rating}
                  </span>
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div 
                      className="bg-warning rounded-full h-2 smooth-transition"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-data text-xs text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            {language === 'ar' ? 'الكل' : 'Tous'}
          </Button>
          {[5, 4, 3, 2, 1]?.map(rating => {
            const count = ratingDistribution?.[rating] || 0;
            if (count === 0) return null;
            
            return (
              <Button
                key={rating}
                variant={selectedFilter === rating?.toString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(rating?.toString())}
              >
                {rating}⭐ ({count})
                              </Button>
            );
          })}
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews?.map((review) => (
          <div key={review?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              {/* Reviewer Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={review?.customerAvatar}
                  alt={review?.customerName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-heading font-medium text-sm text-foreground">
                      {review?.customerName}
                    </h4>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex items-center">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="font-caption text-xs text-muted-foreground">
                        {getTimeAgo(review?.date)}
                      </span>
                    </div>
                  </div>

                  {review?.isVerified && (
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Icon name="CheckCircle" size={14} className="text-success" />
                      <span className="font-caption text-xs text-success">
                        {language === 'ar' ? 'موثق' : 'Vérifié'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Type */}
                {review?.serviceType && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getServiceTypeText(review?.serviceType)}
                    </span>
                  </div>
                )}

                {/* Review Content */}
                <p className="font-body text-sm text-foreground leading-relaxed mb-3">
                  {review?.comment}
                </p>

                {/* Review Photos */}
                {review?.photos && review?.photos?.length > 0 && (
                  <div className="flex space-x-2 rtl:space-x-reverse mb-3">
                    {review?.photos?.slice(0, 3)?.map((photo, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {review?.photos?.length > 3 && (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <span className="font-data text-xs text-muted-foreground">
                          +{review?.photos?.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ThumbsUp"
                    iconPosition="left"
                    iconSize={14}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {language === 'ar' ? 'مفيد' : 'Utile'} ({review?.helpfulCount || 0})
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageCircle"
                    iconPosition="left"
                    iconSize={14}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {language === 'ar' ? 'رد' : 'Répondre'}
                  </Button>
                </div>

                {/* Cleaner Response */}
                {review?.cleanerResponse && (
                  <div className="mt-3 pl-4 rtl:pl-0 rtl:pr-4 border-l-2 rtl:border-l-0 rtl:border-r-2 border-primary/20">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <Icon name="MessageSquare" size={14} className="text-primary" />
                      <span className="font-heading font-medium text-sm text-primary">
                        {language === 'ar' ? 'رد المنظف' : 'Réponse du nettoyeur'}
                      </span>
                      <span className="font-caption text-xs text-muted-foreground">
                        {getTimeAgo(review?.cleanerResponse?.date)}
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">
                      {review?.cleanerResponse?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {!showAllReviews && reviews?.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(true)}
            iconName="ChevronDown"
            iconPosition="right"
            iconSize={16}
          >
            {language === 'ar' 
              ? `عرض جميع التقييمات (${reviews?.length - 3} أكثر)` 
              : `Voir tous les avis (${reviews?.length - 3} de plus)`
            }
          </Button>
        </div>
      )}
      {/* Empty State */}
      {reviews?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-lg text-foreground mb-2">
            {language === 'ar' ? 'لا توجد تقييمات بعد' : 'Aucun avis pour le moment'}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {language === 'ar' ?'كن أول من يترك تقييماً لهذا المنظف' :'Soyez le premier à laisser un avis pour ce nettoyeur'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;