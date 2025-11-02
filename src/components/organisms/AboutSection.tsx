import React, { useState } from 'react';
import Button from '@/components/atoms/Button';

interface AboutSectionProps {
  title: string;
  description: string;
  discoverButtonText: string;
  askQuestionText: string;
  findPropertyText: string;
  image?: string;
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  discoverButtonText,
  askQuestionText,
  findPropertyText,
  image,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  // Default about image if none provided
  const imageSrc = image ? (image.startsWith('/') ? image : `/${image}`) : '/images/aboutus/aboutus.jpeg';
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="flex items-center lg:flex-row flex-col justify-between gap-4 h-full">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                {askQuestionText}
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                {findPropertyText}
              </a>
            </div>
            <Button variant="primary" size="lg">
              {discoverButtonText}
            </Button>
          </div>

          {/* Right Content - Image */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-lg h-64 bg-gray-300 rounded-lg overflow-hidden relative border border-gray-200 shadow-md">
              {!imageError ? (
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">About Image</p>
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

export default AboutSection; 