export interface Property {
  id: string;
  title: string;
  address: string;
  price?: string;
  rating?: number;
  images: string[];
  features: {
    beds: number;
    baths: number;
    parking: number;
  };
  category: 'rooms' | 'flats' | 'hostels' | 'villas';
  isFeatured?: boolean;
  isTopRated?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  wordCount: number;
}

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  category: 'rooms' | 'flats' | 'hostels' | 'villas';
} 