import React from 'react';
import Button from '@/components/atoms/Button';

interface AboutSectionProps {
  title: string;
  description: string;
  discoverButtonText: string;
  askQuestionText: string;
  findPropertyText: string;
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  discoverButtonText,
  askQuestionText,
  findPropertyText,
  className
}) => {
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

          {/* Right Content - Image Placeholder */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-gray-500 text-xl">Image/Video Placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 