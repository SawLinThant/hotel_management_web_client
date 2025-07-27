import 'server-only';
import type { Locale } from './constants';

const dictionaries = {
  en: () => import('../locales/en.json').then((module) => module.default),
  my: () => import('../locales/my.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!(locale in dictionaries)) {
    throw new Error(`Dictionary for locale "${locale}" not found`);
  }
  return dictionaries[locale]();
};

// Type for translation keys with dot notation support
export type TranslationKey = string;

// Helper function for nested key access
export function getNestedTranslation(obj: any, key: string): string {
  return key.split('.').reduce((current, keyPart) => {
    return current && current[keyPart] ? current[keyPart] : key;
  }, obj);
}

// Type for dictionary structure
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>; 