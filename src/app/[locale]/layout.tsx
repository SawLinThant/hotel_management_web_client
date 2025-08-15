import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import { notFound } from 'next/navigation';

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

  // Keep this layout minimal so specialized route-group layouts can opt-in
  // to Navigation/Footer (e.g., (site) group). Dashboard won't inherit them.
  await getDictionary(locale); // ensure locale prefetching if needed
  return <>{children}</>;
} 