import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import HomePageTemplate from '@/components/templates/HomePageTemplate';
import { Metadata } from 'next';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return {
    title: 'Hotel Management System - Find Your Perfect Property',
    description: 'Professional hotel booking and management platform with advanced features for both guests and administrators. Find rooms, flats, hostels, and villas.',
    keywords: 'hotel, booking, property, rental, accommodation, rooms, flats, hostels, villas',
    authors: [{ name: 'Hotel Management System' }],
    openGraph: {
      title: 'Hotel Management System - Find Your Perfect Property',
      description: 'Professional hotel booking and management platform with advanced features for both guests and administrators.',
      type: 'website',
      locale: locale,
      alternateLocale: locale === 'en' ? 'my' : 'en',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hotel Management System - Find Your Perfect Property',
      description: 'Professional hotel booking and management platform with advanced features for both guests and administrators.',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <HomePageTemplate dict={dict} />;
}



