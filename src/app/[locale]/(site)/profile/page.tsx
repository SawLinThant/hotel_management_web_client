import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/constants';
import ProfileClient from './ProfileClient';

interface ProfilePageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Profile Page
 *
 * Server component that fetches dictionary and passes props to client component.
 * Follows Next.js App Router pattern with server/client component separation.
 */
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <ProfileClient locale={locale} dict={dict} />;
}

