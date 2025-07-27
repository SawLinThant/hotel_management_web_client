import React from 'react';
import Icon from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';

interface FooterProps {
  dict: any;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ dict, className }) => {
  return (
    <footer className={cn('bg-gray-100', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo and Description */}
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-4">LOGO</div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                PlayStore
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                AppStore
              </button>
            </div>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {dict.home.footer.company}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.about_us}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.legal_info}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.contact_us}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.blogs}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Help Center */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {dict.home.footer.help_center}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.find_property_link}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.how_to_host}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.why_us}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.faqs}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {dict.home.footer.rental_guides}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {dict.home.footer.contact_info}
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="text-gray-600">
                {dict.home.footer.phone}
              </li>
              <li className="text-gray-600">
                {dict.home.footer.email}
              </li>
              <li className="text-gray-600">
                {dict.home.footer.location}
              </li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Icon name="facebook" size="md" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Icon name="twitter" size="md" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Icon name="instagram" size="md" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Icon name="linkedin" size="md" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            {dict.home.footer.copyright}
          </p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            {dict.home.footer.created_by}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 