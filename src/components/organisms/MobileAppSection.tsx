import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

interface MobileAppSectionProps {
  title: string;
  subtitle: string;
  playstoreText: string;
  appstoreText: string;
  image?: string;
  className?: string;
}

const MobileAppSection: React.FC<MobileAppSectionProps> = ({
  title,
  subtitle,
  playstoreText,
  appstoreText,
  image,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  // Default mobile app image if none provided
  const imageSrc = image ? (image.startsWith('/') ? image : `/${image}`) : '/images/mobile/download.jpg';
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-lg p-10 flex lg:flex-row flex-col items-center justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1 max-w-md">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {subtitle}
            </p>
            <div className="flex space-x-4">
              <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                <Icon name="play" size="sm" />
                <span>{playstoreText}</span>
              </Button>
              <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                <Icon name="apple" size="sm" />
                <span>{appstoreText}</span>
              </Button>
            </div>
          </div>

          {/* Right Content - Mobile App Image */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-md h-64 bg-gray-300 rounded-3xl overflow-hidden relative border border-gray-200 shadow-md">
              {!imageError ? (
                <img
                  src={imageSrc}
                  alt="Mobile App"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Mobile App</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection; 