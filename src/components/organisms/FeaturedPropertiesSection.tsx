import React from 'react';
import PropertyCard from '@/components/molecules/PropertyCard';
import { Property } from '@/types/property';

interface FeaturedPropertiesSectionProps {
  title: string;
  properties: Property[];
  className?: string;
}

const FeaturedPropertiesSection: React.FC<FeaturedPropertiesSectionProps> = ({
  title,
  properties,
  className
}) => {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Properties Grid - 2 rows of 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              showPrice={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection; 