import React from 'react';
import { Property } from '@/types/property';
import Icon from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  showRating?: boolean;
  showPrice?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showRating = false,
  showPrice = false,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow', className)}>
      {/* Image Container */}
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/400/300';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}
        
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <Icon name="heart" className="text-gray-600" size="sm" />
        </button>
        
        {/* Rating Stars */}
        {showRating && property.rating && (
          <div className="absolute top-3 left-3 flex">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="star"
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(property.rating!) ? 'text-yellow-400' : 'text-gray-300'
                )}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Price */}
        {showPrice && property.price && (
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {property.price}
          </div>
        )}
        
        {/* Image Dots (for featured properties) */}
        {showPrice && (
          <div className="flex space-x-1 mb-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        
        {/* Address */}
        <p className="text-gray-600 text-sm mb-3">
          {property.address}
        </p>
        
        {/* Features */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Icon name="bed" size="sm" />
            <span>{property.features.beds}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="bath" size="sm" />
            <span>{property.features.baths}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="car" size="sm" />
            <span>{property.features.parking}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 