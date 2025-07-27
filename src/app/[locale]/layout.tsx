import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Navigation from '@/components/organisms/Navigation';

const locales = ['en', 'my'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation locale={locale} dict={dict} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Hotel Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 