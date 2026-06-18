export interface Provider {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryIcon: string;
  city: string;
  district: string;
  phone: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  about: string;
  previewImages: string[];
  portfolioImages: string[];
  tags: string[];
  priceRange: string;
  experience: string;
  reviews: Review[];
  avatarUrl: string;
  coverUrl: string;
  jobTitle: string;
  connections: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  providerCount: number;
  description: string;
}

export interface SearchFilters {
  query: string;
  city: string;
  minRating: number;
  district: string;
}
