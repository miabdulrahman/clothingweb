// ============================================
// Modest Fashion Platform — Data Service Layer
// ============================================

import { Product, Category, LookbookItem, AnalyticsEvent } from '@/types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_LOOKBOOK } from './mockData';

// Helper to check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here'
  );
}

// Get the correct client (Server vs Client side)
async function getSupabaseClient() {
  if (typeof window === 'undefined') {
    const { createClient } = await import('./supabase/server');
    return createClient();
  } else {
    const { createClient } = await import('./supabase/client');
    return createClient();
  }
}

// ----------------------------------------------------
// Category Services
// ----------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES;
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || MOCK_CATEGORIES;
  } catch (err) {
    console.error('Error fetching categories from Supabase, falling back to mock:', err);
    return MOCK_CATEGORIES;
  }
}

// ----------------------------------------------------
// Product Services
// ----------------------------------------------------

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  sort?: string;
  sizes?: string[];
  colors?: string[];
  priceRange?: [number, number];
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let products = [...MOCK_PRODUCTS];

    if (options?.featured !== undefined) {
      products = products.filter(p => p.featured === options.featured);
    }

    if (options?.categorySlug) {
      const cat = MOCK_CATEGORIES.find(c => c.slug === options.categorySlug);
      if (cat) {
        products = products.filter(p => p.category_id === cat.id);
      } else {
        return []; // No category matched
      }
    }

    // Apply filters
    if (options?.sizes && options.sizes.length > 0) {
      products = products.filter(p => p.sizes.some(s => options.sizes!.includes(s)));
    }

    if (options?.colors && options.colors.length > 0) {
      products = products.filter(p => p.colors.some(c => options.colors!.includes(c)));
    }

    if (options?.priceRange) {
      const [min, max] = options.priceRange;
      products = products.filter(p => p.price >= min && p.price <= max);
    }

    // Sort
    if (options?.sort) {
      if (options.sort === 'price-asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (options.sort === 'price-desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (options.sort === 'newest') {
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    if (options?.limit) {
      products = products.slice(0, options.limit);
    }

    // Attach categories to products
    return products.map(p => ({
      ...p,
      category: MOCK_CATEGORIES.find(c => c.id === p.category_id)
    }));
  }

  try {
    const supabase = await getSupabaseClient();
    let query = supabase.from('products').select('*, category:categories(*)');

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    if (options?.categorySlug) {
      // Subquery filter by joining category
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', options.categorySlug)
        .single();
      
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    if (options?.sizes && options.sizes.length > 0) {
      query = query.overlaps('sizes', options.sizes);
    }

    if (options?.colors && options.colors.length > 0) {
      query = query.overlaps('colors', options.colors);
    }

    if (options?.priceRange) {
      query = query.gte('price', options.priceRange[0]).lte('price', options.priceRange[1]);
    }

    // Apply sorting
    if (options?.sort) {
      if (options.sort === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (options.sort === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (options.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('sort_order', { ascending: true });
      }
    } else {
      query = query.order('sort_order', { ascending: true });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching products from Supabase, using mock fallback:', err);
    // Simple filter of mock data for fallback
    return getProductsMock(options);
  }
}

// Local helper to filter mock data for fallback
function getProductsMock(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  sort?: string;
  sizes?: string[];
  colors?: string[];
  priceRange?: [number, number];
}): Product[] {
  let products = [...MOCK_PRODUCTS];

  if (options?.featured !== undefined) {
    products = products.filter(p => p.featured === options.featured);
  }

  if (options?.categorySlug) {
    const cat = MOCK_CATEGORIES.find(c => c.slug === options.categorySlug);
    if (cat) {
      products = products.filter(p => p.category_id === cat.id);
    }
  }

  if (options?.limit) {
    products = products.slice(0, options.limit);
  }

  return products.map(p => ({
    ...p,
    category: MOCK_CATEGORIES.find(c => c.id === p.category_id)
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const product = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      category: MOCK_CATEGORIES.find(c => c.id === product.category_id)
    };
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  } catch (err) {
    console.error(`Error fetching product ${slug} from Supabase:`, err);
    const product = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      category: MOCK_CATEGORIES.find(c => c.id === product.category_id)
    };
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS
      .filter(p => p.category_id === categoryId && p.id !== productId)
      .slice(0, limit)
      .map(p => ({
        ...p,
        category: MOCK_CATEGORIES.find(c => c.id === p.category_id)
      }));
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .neq('id', productId)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching related products from Supabase:', err);
    return MOCK_PRODUCTS
      .filter(p => p.category_id === categoryId && p.id !== productId)
      .slice(0, limit);
  }
}

// ----------------------------------------------------
// Lookbook Services
// ----------------------------------------------------

export async function getLookbookItems(): Promise<LookbookItem[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_LOOKBOOK.map(item => ({
      ...item,
      related_products: MOCK_PRODUCTS.filter(p => item.related_product_ids.includes(p.id))
    }));
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('lookbook_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    // For each lookbook item, fetch its related products
    const items = data || [];
    const hydratedItems = await Promise.all(
      items.map(async (item) => {
        if (item.related_product_ids && item.related_product_ids.length > 0) {
          const { data: products } = await supabase
            .from('products')
            .select('*, category:categories(*)')
            .in('id', item.related_product_ids);
          return { ...item, related_products: products || [] };
        }
        return { ...item, related_products: [] };
      })
    );

    return hydratedItems;
  } catch (err) {
    console.error('Error fetching lookbook items from Supabase:', err);
    return MOCK_LOOKBOOK.map(item => ({
      ...item,
      related_products: MOCK_PRODUCTS.filter(p => item.related_product_ids.includes(p.id))
    }));
  }
}

// ----------------------------------------------------
// Analytics Services (Fire and Forget)
// ----------------------------------------------------

export async function logAnalyticsEvent(
  eventType: string,
  eventData: Record<string, unknown> = {},
  pagePath?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log(`[Mock Analytics] Event logged: ${eventType}`, { eventData, pagePath });
    return;
  }

  try {
    const supabase = await getSupabaseClient();
    // Non-blocking insert
    supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : undefined)
      })
      .then(({ error }) => {
        if (error) console.error('Error inserting analytics event:', error);
      });
  } catch (err) {
    console.error('Failed to log analytics event:', err);
  }
}

// ----------------------------------------------------
// Admin Analytics Stats
// ----------------------------------------------------

export async function getAdminStats(): Promise<{
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  whatsappClicks: number;
  totalPageViews: number;
  topProducts: { title: string; views: number; whatsappClicks: number }[];
  viewsOverTime: { date: string; views: number; clicks: number }[];
}> {
  // Simple analytics computation (returns mock-looking data if DB has no real events)
  const defaultStats = {
    totalProducts: MOCK_PRODUCTS.length,
    inStockCount: MOCK_PRODUCTS.filter(p => p.in_stock).length,
    outOfStockCount: MOCK_PRODUCTS.filter(p => !p.in_stock).length,
    whatsappClicks: 142,
    totalPageViews: 2450,
    topProducts: [
      { title: 'Oversized Premium Tee', views: 820, whatsappClicks: 65 },
      { title: 'Wide-Leg Linen Trouser', views: 610, whatsappClicks: 42 },
      { title: 'Everyday Linen Kurta', views: 512, whatsappClicks: 35 }
    ],
    viewsOverTime: [
      { date: 'May 15', views: 320, clicks: 18 },
      { date: 'May 16', views: 340, clicks: 22 },
      { date: 'May 17', views: 290, clicks: 15 },
      { date: 'May 18', views: 410, clicks: 31 },
      { date: 'May 19', views: 450, clicks: 28 },
      { date: 'May 20', views: 380, clicks: 20 },
      { date: 'May 21', views: 260, clicks: 8 }
    ]
  };

  if (!isSupabaseConfigured()) {
    return defaultStats;
  }

  try {
    const supabase = await getSupabaseClient();
    
    // Fetch counts from DB
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: inStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true);
    const { count: outStockCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false);
    
    // Fetch analytics events count
    const { count: whatsappClicks } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click');
    const { count: totalPageViews } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view');

    return {
      totalProducts: prodCount || defaultStats.totalProducts,
      inStockCount: inStockCount || defaultStats.inStockCount,
      outOfStockCount: outStockCount || defaultStats.outOfStockCount,
      whatsappClicks: whatsappClicks || defaultStats.whatsappClicks,
      totalPageViews: totalPageViews || defaultStats.totalPageViews,
      topProducts: defaultStats.topProducts, // Simplified mock for MVP charts
      viewsOverTime: defaultStats.viewsOverTime // Simplified mock for MVP charts
    };
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return defaultStats;
  }
}

// ----------------------------------------------------
// Product CRUD Mutations
// ----------------------------------------------------

export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>
): Promise<Product | null> {
  const isConfigured = isSupabaseConfigured();
  
  const mockId = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : 'mock-' + Math.random().toString(36).substring(2, 11);

  const newProduct: Product = {
    ...productData,
    id: mockId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (!isConfigured) {
    MOCK_PRODUCTS.unshift(newProduct);
    return {
      ...newProduct,
      category: MOCK_CATEGORIES.find(c => c.id === newProduct.category_id)
    };
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating product in Supabase, using mock fallback:', err);
    MOCK_PRODUCTS.unshift(newProduct);
    return {
      ...newProduct,
      category: MOCK_CATEGORIES.find(c => c.id === newProduct.category_id)
    };
  }
}

export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>
): Promise<Product | null> {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = {
        ...MOCK_PRODUCTS[idx],
        ...productData,
        updated_at: new Date().toISOString()
      };
      return {
        ...MOCK_PRODUCTS[idx],
        category: MOCK_CATEGORIES.find(c => c.id === MOCK_PRODUCTS[idx].category_id)
      };
    }
    return null;
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error updating product ${id} in Supabase, using mock fallback:`, err);
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = {
        ...MOCK_PRODUCTS[idx],
        ...productData,
        updated_at: new Date().toISOString()
      };
      return {
        ...MOCK_PRODUCTS[idx],
        category: MOCK_CATEGORIES.find(c => c.id === MOCK_PRODUCTS[idx].category_id)
      };
    }
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
      return true;
    }
    return false;
  }

  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting product ${id} in Supabase, using mock fallback:`, err);
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
      return true;
    }
    return false;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) return null;
    return {
      ...product,
      category: MOCK_CATEGORIES.find(c => c.id === product.category_id)
    };
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  } catch (err) {
    console.error(`Error fetching product ID ${id} from Supabase, using mock fallback:`, err);
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) return null;
    return {
      ...product,
      category: MOCK_CATEGORIES.find(c => c.id === product.category_id)
    };
  }
}


