import React from 'react';
import Icon from '../../../components/AppIcon';

const RatingFilter = ({ 
  selectedRating = '', 
  onChange = () => {}, 
  language = 'fr' 
}) => {
  const ratingOptions = [
    {
      value: '4.5',
      label: language === 'ar' ? '4.5+ نجوم' : '4.5+ étoiles',
      description: language === 'ar' ? 'ممتاز' : 'Excellent',
      count: 45
    },
    {
      value: '4.0',
      label: language === 'ar' ? '4.0+ نجوم' : '4.0+ étoiles',
      description: language === 'ar' ? 'جيد جداً' : 'Très bien',
      count: 128
    },
    {
      value: '3.5',
      label: language === 'ar' ? '3.5+ نجوم' : '3.5+ étoiles',
      description: language === 'ar' ? 'جيد' : 'Bien',
      count: 234
    },
    {
      value: '3.0',
      label: language === 'ar' ? '3.0+ نجوم' : '3.0+ étoiles',
      description: language === 'ar' ? 'مقبول' : 'Acceptable',
      count: 312
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars?.push(
          <Icon key={i} name="Star" size={14} className="text-accent fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars?.push(
          <Icon key={i} name="StarHalf" size={14} className="text-accent fill-current" />
        );
      } else {
        stars?.push(
          <Icon key={i} name="Star" size={14} className="text-muted-foreground" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="space-y-3">
      {ratingOptions?.map((option) => (
        <div
          key={option?.value}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedRating === option?.value
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }`}
          onClick={() => onChange(selectedRating === option?.value ? '' : option?.value)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {renderStars(parseFloat(option?.value))}
              </div>
              
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  {option?.label}
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  {option?.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-caption text-xs text-muted-foreground">
                ({option?.count})
              </span>
              {selectedRating === option?.value && (
                <Icon name="Check" size={16} className="text-primary" />
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Rating Distribution */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <h4 className="font-body text-sm font-medium text-foreground mb-3">
          {language === 'ar' ? 'توزيع التقييمات:' : 'Distribution des notes:'}
        </h4>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1]?.map((star) => (
            <div key={star} className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-caption text-xs text-muted-foreground w-3">
                {star}
              </span>
              <Icon name="Star" size={12} className="text-accent" />
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ 
                    width: `${star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 8 : star === 2 ? 2 : 0}%` 
                  }}
                />
              </div>
              <span className="font-data text-xs text-muted-foreground w-8 text-right rtl:text-left">
                {star === 5 ? '65%' : star === 4 ? '25%' : star === 3 ? '8%' : star === 2 ? '2%' : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;