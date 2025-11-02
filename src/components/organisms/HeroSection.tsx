"use client"

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/molecules/SearchBar';
import { SearchFilters } from '@/types/property';

interface HeroSectionProps {
  dict: any;
  carouselImages?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ dict, carouselImages }) => {
  const [activeCategory, setActiveCategory] = useState<'rooms' | 'flats' | 'hostels' | 'villas'>('rooms');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 0,
    category: 'rooms'
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Default carousel images (can be replaced with actual images)
  // In Next.js, public folder assets need a leading slash
  const defaultImages = [
    '/images/banner/1.jpg',
    '/images/banner/2.jpg',
    '/images/banner/3.webp',
  ];

  const images = carouselImages && carouselImages.length > 0 ? carouselImages : defaultImages;

  const categories = [
    { key: 'rooms', label: dict.home.categories.rooms },
    { key: 'flats', label: dict.home.categories.flats },
    { key: 'hostels', label: dict.home.categories.hostels },
    { key: 'villas', label: dict.home.categories.villas }
  ] as const;

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleCategoryChange = (category: typeof activeCategory) => {
    setActiveCategory(category);
    setSearchFilters(prev => ({ ...prev, category }));
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search with filters:', searchFilters);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative">
      {/* Image Carousel */}
      <div className="relative w-full h-96 overflow-hidden mb-3">
        {/* Carousel Images */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full bg-transparent"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full relative bg-white">
              {imageErrors.has(index) ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">Image {index + 1}</span>
                </div>
              ) : (
                <img
                  src={image}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={() => {
                    console.error(`Failed to load image: ${image}`);
                    setImageErrors((prev) => new Set([...prev, index]));
                  }}
                />
              )}
              {/* Overlay for better text readability - reduced opacity */}
              <div className="absolute inset-0 bg-black/10 bg-opacity-20"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 pb-4">
            {/* {dict.home.hero.title} */}.
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