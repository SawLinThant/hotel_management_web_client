"use client"

import React, { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

interface NewsletterSectionProps {
  title: string;
  subtitle: string;
  placeholder: string;
  className?: string;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title,
  subtitle,
  placeholder,
  className
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
  };

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="flex lg:flex-row md:flex-row flex-col gap-4 lg:items-center md:items-center items-start justify-between">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-gray-600">
                {subtitle}
              </p>
            </div>

            {/* Right Content - Email Form */}
            <div className="flex-1 lg:max-w-md md:max-w-md w-full">
              <form onSubmit={handleSubmit} className="flex">
                <Input
                  type="email"
                  placeholder={placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-r-none"
                />
                <Button
                  type="submit"
                  className="rounded-l-none px-4"
                >
                  <Icon name="send" size="sm" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 