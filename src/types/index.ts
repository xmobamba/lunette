export type ProductCategory = 
  | 'all'
  | 'femme'
  | 'homme'
  | 'oversize'
  | 'classique'
  | 'tendance'
  | 'nouveautes'
  | 'cateye'
  | 'bestseller';

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory[];
  subtitle: string;
  description: string;
  longDescription?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  colors: ProductColor[];
  badge?: 'Nouveau' | 'Bestseller' | 'Tendance' | 'Offre Spéciale' | '-20%';
  featured?: boolean;
  bestseller?: boolean;
  available: boolean;
  rating: number;
  reviewCount: number;
  specs: {
    uvProtection: string;
    frameMaterial: string;
    lensType: string;
    fit: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  verified: boolean;
  productBought?: string;
  avatar?: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  caption: string;
  link: string;
}

export type BannerTheme = 'orange' | 'green' | 'dark' | 'gold' | 'rose' | 'ocean';

export interface PromoBannerItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  subtext?: string;
  ctaText: string;
  whatsappMessage?: string;
  theme: BannerTheme;
  discountTag?: string;
  countdownText?: string;
  image?: string;
  isActive: boolean;
  position?: 'main' | 'top_bar' | 'both';
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  phoneRaw: string;
  phoneDisplay: string;
  city: string;
  country: string;
  currency: string;
  deliveryNotice: string;
  promoText: string;
  promoSubtext: string;
  isPromoActive: boolean;
  instagramHandle: string;
  tiktokHandle: string;
  facebookPage: string;
}
