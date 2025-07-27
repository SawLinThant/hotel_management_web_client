import React from 'react';
import PropertyCard from '@/components/molecules/PropertyCard';
import Icon from '@/components/atoms/Icon';
import { Property } from '@/types/property';

interface PropertySectionProps {
  title: string;
  properties: Property[];
  showRating?: boolean;
  showPrice?: boolean;
  showMapLink?: boolean;
  className?: string;
}

const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  properties,
  showRating = false,
  showPrice = false,
  showMapLink = false,
  className
}) => {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {showMapLink && (
            <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <Icon name="map" size="sm" />
              <span>Show On Map</span>
            </a>
          )}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showRating={showRating}
              showPrice={showPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertySection; 