"use client"

import React, { useState } from 'react';
import SearchBar from '@/components/molecules/SearchBar';
import { SearchFilters } from '@/types/property';

interface HeroSectionProps {
  dict: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ dict }) => {
  const [activeCategory, setActiveCategory] = useState<'rooms' | 'flats' | 'hostels' | 'villas'>('rooms');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 0,
    category: 'rooms'
  });

  const categories = [
    { key: 'rooms', label: dict.home.categories.rooms },
    { key: 'flats', label: dict.home.categories.flats },
    { key: 'hostels', label: dict.home.categories.hostels },
    { key: 'villas', label: dict.home.categories.villas }
  ] as const;

  const handleCategoryChange = (category: typeof activeCategory) => {
    setActiveCategory(category);
    setSearchFilters(prev => ({ ...prev, category }));
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search with filters:', searchFilters);
  };

  return (
    <section className="relative">
      {/* Banner */}
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center mb-3">
        <div className="text-gray-500 text-2xl font-semibold">BANNER</div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 pb-4">
            {dict.home.hero.title}
          </h1>
          <p className="text-xl text-gray-600">
            {dict.home.hero.subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md p-1">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeCategory === category.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
          onSearch={handleSearch}
          dict={dict}
        />
      </div>
    </section>
  );
};

export default HeroSection; 