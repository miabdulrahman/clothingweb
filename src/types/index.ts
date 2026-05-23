// ============================================
// Modest Fashion Platform — Type Definitions
// ============================================

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  price: number;
  currency: string;
  category_id: string;
  category?: Category;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  in_stock: boolean;
  fit_notes?: string;
  fabric?: string;
  care?: string;
  delivery_info: string;
  style_label?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sort_order: number;
  created_at: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  image: string;
  caption?: string;
  collection?: string;
  related_product_ids: string[];
  related_products?: Product[];
  sort_order: number;
  created_at: string;
}

export interface AnalyticsEvent {
  id?: string;
  event_type: EventType;
  event_data?: Record<string, unknown>;
  page_path?: string;
  created_at?: string;
}

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'catalog_view'
  | 'whatsapp_click'
  | 'filter_use'
  | 'size_select'
  | 'color_select'
  | 'share_click'
  | 'out_of_stock_view'
  | 'lookbook_view'
  | 'category_view';

export interface OrderOptions {
  size: string;
  color: string;
  quantity: number;
}

export interface CartItem {
  id: string; // "productId-size-color"
  productId: string;
  title: string;
  price: number;
  currency: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  image: string;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number] | null;
  inStock: boolean;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'featured';

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}
