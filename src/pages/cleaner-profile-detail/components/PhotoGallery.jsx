import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PhotoGallery = ({ photos, language }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setCurrentIndex(0);
  };

  const navigatePhoto = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % photos?.length
      : (currentIndex - 1 + photos?.length) % photos?.length;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos?.[newIndex]);
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      before: language === 'ar' ? 'قبل' : 'Avant',
      after: language === 'ar' ? 'بعد' : 'Après',
      process: language === 'ar' ? 'أثناء العمل' : 'En cours',
      equipment: language === 'ar' ? 'المعدات' : 'Équipement',
      workspace: language === 'ar' ? 'مكان العمل' : 'Espace de travail'
    };
    return categoryMap?.[category] || category;
  };

  // Group photos by category
  const groupedPhotos = photos?.reduce((acc, photo, index) => {
    const category = photo?.category || 'general';
    if (!acc?.[category]) {
      acc[category] = [];
    }
    acc?.[category]?.push({ ...photo, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedPhotos)?.map(([category, categoryPhotos]) => (
        <div key={category}>
          <h3 className="font-heading font-semibold text-base text-foreground mb-3 flex items-center space-x-2 rtl:space-x-reverse">
            <Icon 
              name={category === 'before' ? 'ArrowLeft' : category === 'after' ? 'ArrowRight' : 'Camera'} 
              size={16} 
              className="text-primary" 
            />
            <span>{getCategoryText(category)}</span>
            <span className="font-data text-sm text-muted-foreground">
              ({categoryPhotos?.length})
            </span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryPhotos?.map((photo) => (
              <div
                key={photo?.originalIndex}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:shadow-interactive smooth-transition"
                onClick={() => openLightbox(photo, photo?.originalIndex)}
              >
                <Image
                  src={photo?.url}
                  alt={photo?.caption || `${getCategoryText(category)} photo`}
                  className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 smooth-transition flex items-center justify-center">
                  <Icon 
                    name="ZoomIn" 
                    size={24} 
                    color="white" 
                    className="opacity-0 group-hover:opacity-100 smooth-transition" 
                  />
                </div>

                {/* Photo Info */}
                {photo?.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="font-caption text-xs text-white truncate">
                      {photo?.caption}
                    </p>
                  </div>
                )}

                {/* Before/After Badge */}
                {(category === 'before' || category === 'after') && (
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      category === 'before' 
                        ? 'bg-warning/90 text-white' :'bg-success/90 text-white'
                    }`}>
                      {getCategoryText(category)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-200 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
              iconName="X"
              iconSize={20}
            />

            {/* Navigation Buttons */}
            {photos?.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  iconName="ChevronLeft"
                  iconSize={24}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
                  iconName="ChevronRight"
                  iconSize={24}
                />
              </>
            )}

            {/* Image */}
            <div className="relative">
              <Image
                src={selectedPhoto?.url}
                alt={selectedPhoto?.caption || 'Gallery photo'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <div className="text-white">
                  {selectedPhoto?.caption && (
                    <h4 className="font-heading font-medium text-lg mb-1">
                      {selectedPhoto?.caption}
                    </h4>
                  )}
                  <div className="flex items-center justify-between text-sm opacity-80">
                    <span>
                      {getCategoryText(selectedPhoto?.category || 'general')}
                    </span>
                    <span>
                      {currentIndex + 1} / {photos?.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {photos?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Camera" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-heading font-medium text-lg text-foreground mb-2">
            {language === 'ar' ? 'لا توجد صور متاحة' : 'Aucune photo disponible'}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {language === 'ar' ?'سيتم إضافة صور العمل قريباً' :'Les photos de travail seront ajoutées bientôt'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;