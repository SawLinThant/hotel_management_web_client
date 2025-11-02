'use client';

import React from 'react';
import HeroSection from '@/components/organisms/HeroSection';
import PropertySection from '@/components/organisms/PropertySection';
import FeaturedPropertiesSection from '@/components/organisms/FeaturedPropertiesSection';
import PromoBanner from '@/components/organisms/PromoBanner';
import BlogSection from '@/components/organisms/BlogSection';
import MobileAppSection from '@/components/organisms/MobileAppSection';
import AboutSection from '@/components/organisms/AboutSection';
import NewsletterSection from '@/components/organisms/NewsletterSection';
import Footer from '@/components/organisms/Footer';
import { useRooms } from '@/hooks/useRooms';
import { convertRoomsToProperties } from '@/lib/roomToProperty';
import { getBlogPosts } from '@/lib/mockData';

interface HomePageTemplateProps {
  dict: any;
}

const HomePageTemplate: React.FC<HomePageTemplateProps> = ({ dict }) => {
  // Fetch real room data with different filters
  const { rooms: allRooms, isLoading: isLoadingAll } = useRooms({ 
    query: { 
      page: 1, 
      limit: 20,
      status: 'available' // Only show available rooms
    } 
  });

  const { rooms: singleRooms } = useRooms({ 
    query: { 
      page: 1, 
      limit: 4,
      type: 'single',
      status: 'available'
    } 
  });

  const { rooms: capacity2Rooms } = useRooms({ 
    query: { 
      page: 1, 
      limit: 4,
      min_capacity: 2,
      max_capacity: 2,
      status: 'available'
    } 
  });

  const { rooms: suiteRooms } = useRooms({ 
    query: { 
      page: 1, 
      limit: 4,
      type: 'suite',
      status: 'available'
    } 
  });

  // Convert rooms to properties
  const latestProperties = convertRoomsToProperties(allRooms.slice(0, 4));
  const nearbyProperties = convertRoomsToProperties(capacity2Rooms.slice(0, 4));
  const topRatedProperties = convertRoomsToProperties(suiteRooms.slice(0, 4));
  const featuredProperties = convertRoomsToProperties(allRooms.filter(r => r.images && r.images.length > 0).slice(0, 8));
  
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection dict={dict} />

      {/* Latest Properties */}
      <PropertySection
        title={dict.home.sections.latest_properties}
        properties={latestProperties}
        showPrice={true}
        className="py-16"
      />

      {/* Single Rooms */}
      <PropertySection
        title="Single Rooms"
        properties={convertRoomsToProperties(singleRooms)}
        showPrice={true}
        className="py-16 bg-gray-50"
      />

      {/* 2 Capacity Rooms */}
      <PropertySection
        title="2 Guest Capacity Rooms"
        properties={convertRoomsToProperties(capacity2Rooms)}
        showPrice={true}
        showMapLink={true}
        className="py-16"
      />

      {/* Top Rated Properties (Suite Rooms) */}
      <PropertySection
        title={dict.home.sections.top_rated_properties}
        properties={convertRoomsToProperties(suiteRooms)}
        showPrice={true}
        showRating={true}
        className="py-16 bg-gray-50"
      />

      {/* Try Hosting Banner */}
      <PromoBanner
        title="Try Hosting With Us"
        subtitle={dict.home.actions.earn_extra}
        buttonText={dict.home.actions.become_host}
       // onButtonClick={() => console.log('Become a host clicked')}
        className="py-16"
      />

      {/* Featured Properties */}
      <FeaturedPropertiesSection
        title={dict.home.sections.featured_properties}
        properties={featuredProperties}
        className="py-16 bg-gray-50"
      />

      {/* Browse More Properties Banner */}
      <PromoBanner
        title={dict.home.actions.browse_more}
        subtitle={dict.home.actions.explore_categories}
        buttonText={dict.home.actions.find_property}
        //onButtonClick={() => console.log('Find property clicked')}
        className="py-16"
      />

      {/* Blog Section */}
      <BlogSection
        title={dict.home.sections.rental_guides}
        blogs={blogPosts}
        className="py-16"
      />

      {/* Mobile App Section */}
      <MobileAppSection
        title={dict.home.actions.download_app}
        subtitle={dict.home.actions.available_platforms}
        playstoreText={dict.home.actions.playstore}
        appstoreText={dict.home.actions.appstore}
        className="py-16 bg-gray-50"
      />

      {/* About Section */}
      <AboutSection
        title={dict.home.sections.about_rental}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        discoverButtonText={dict.home.actions.discover_more}
        askQuestionText={dict.home.actions.ask_question}
        findPropertyText={dict.home.actions.find_property_link}
        className="py-16"
      />

      {/* Newsletter Section */}
      <NewsletterSection
        title={dict.home.sections.newsletter}
        subtitle={dict.home.actions.stay_updated}
        placeholder={dict.home.actions.email_placeholder}
        className="py-16 bg-gray-50"
      />

      {/* Footer */}
      <Footer dict={dict} />
    </div>
  );
};

export default HomePageTemplate; 