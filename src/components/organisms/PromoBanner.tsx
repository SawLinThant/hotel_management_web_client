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
        <div className="bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 rounded-lg p-12 text-center relative overflow-hidden border border-gray-400/30">
          {/* Decorative Droplets */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {/* Large gray droplets */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-gray-300/15 rounded-full blur-lg"></div>
            
            {/* Medium droplets */}
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/8 rounded-full blur-lg"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-gray-300/12 rounded-full blur-md"></div>
            
            {/* Small droplets scattered */}
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/8 rounded-full blur-md"></div>
            <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-gray-300/12 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-white/8 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gray-200/15 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Additional small droplets */}
            <div className="absolute top-16 left-1/3 w-6 h-6 bg-gray-300/10 rounded-full blur-sm"></div>
            <div className="absolute bottom-16 right-1/3 w-6 h-6 bg-white/10 rounded-full blur-sm"></div>
            
            {/* Dark gray droplets for depth */}
            <div className="absolute top-1/3 left-1/2 w-10 h-10 bg-gray-800/15 rounded-full blur-md transform -translate-x-1/2"></div>
            <div className="absolute bottom-1/3 right-1/2 w-12 h-12 bg-gray-900/15 rounded-full blur-lg transform translate-x-1/2"></div>
          </div>
          
          {/* Background Banner Text */}
          {/* <div className="absolute top-4 right-4 text-white text-6xl font-bold opacity-10">
            BANNER
          </div> */}
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {title}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              {subtitle}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onButtonClick}
              className="shadow-xl"
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