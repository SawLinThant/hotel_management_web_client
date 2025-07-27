"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/constants';
import Icon from '@/components/atoms/Icon';

interface NavigationProps {
  locale: Locale;
  dict: any;
}

const Navigation: React.FC<NavigationProps> = ({ locale, dict }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: `/${locale}`, label: dict?.navigation?.home || 'Home' },
    { href: `/${locale}/rooms`, label: dict?.navigation?.rooms || 'Rooms' },
    { href: `/${locale}/booking`, label: dict?.navigation?.booking || 'Booking' },
    { href: `/${locale}/admin`, label: dict?.navigation?.admin || 'Admin', isAdmin: true },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-900">
                {dict?.navigation?.logo || 'Hotel Management'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.isAdmin
                    ? 'text-blue-600 hover:text-blue-700'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 ml-4">
              <Link
                href="/en"
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'en' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                EN
              </Link>
              <Link
                href="/my"
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'my' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                MY
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <Icon name="close" size="md" />
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                item.isAdmin
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Language:</span>
              <Link
                href="/en"
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'en' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                EN
              </Link>
              <Link
                href="/my"
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  locale === 'my' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                MY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 