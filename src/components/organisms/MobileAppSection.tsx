import React from 'react';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

interface MobileAppSectionProps {
  title: string;
  subtitle: string;
  playstoreText: string;
  appstoreText: string;
  className?: string;
}

const MobileAppSection: React.FC<MobileAppSectionProps> = ({
  title,
  subtitle,
  playstoreText,
  appstoreText,
  className
}) => {
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

          {/* Right Content - Smartphone Icon */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full h-64 bg-gray-300 rounded-3xl flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection; 