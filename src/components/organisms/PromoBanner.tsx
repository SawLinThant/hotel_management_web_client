import React from 'react';
import Button from '@/components/atoms/Button';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  className
}) => {
  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-lg p-12 text-center relative overflow-hidden">
          {/* Background Banner Text */}
          <div className="absolute top-4 right-4 text-gray-300 text-6xl font-bold opacity-20">
            BANNER
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner; 