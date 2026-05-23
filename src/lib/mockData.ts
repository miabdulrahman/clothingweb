// ============================================
// Modest Fashion Platform — Mock Data
// ============================================

import { Product, Category, LookbookItem } from '@/types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Oversized Basics',
    slug: 'oversized-basics',
    description: 'Everyday essentials designed with a relaxed, modern silhouette.',
    image: '/images/mens_oversized_tee.png',
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Linen Collection',
    slug: 'linen-collection',
    description: 'Lightweight, breathable linen pieces for effortless modesty.',
    image: '/images/mens_linen_shirt.png',
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Daily Wear',
    slug: 'daily-wear',
    description: 'Comfortable, durable items optimized for daily activities.',
    image: '/images/mens_oversized_tee.png',
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Occasion Wear',
    slug: 'occasion-wear',
    description: 'Elevated and formal attire for special gatherings and celebrations.',
    image: '/images/mens_kurta_fit.png',
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Travel Fits',
    slug: 'travel-fits',
    description: 'Loose-fitting, packable, and layered outfits perfect for travel.',
    image: '/images/mens_streetwear_fit.png',
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Minimal Streetwear',
    slug: 'minimal-streetwear',
    description: 'Contemporary streetwear style with relaxed and modest tailoring.',
    image: '/images/mens_streetwear_fit.png',
    sort_order: 6,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Layering Pieces',
    slug: 'layering-pieces',
    description: 'Cardigans, dusters, and vests to add depth and modesty to any look.',
    image: '/images/mens_streetwear_fit.png',
    sort_order: 7,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    name: 'Minimal Accessories',
    slug: 'minimal-accessories',
    description: 'Clean and simple accessories to complete your look.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    sort_order: 8,
    created_at: new Date().toISOString()
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    title: 'Oversized Premium Tee',
    slug: 'oversized-premium-tee',
    description: 'Relaxed fit tee designed for clean, modest everyday wear.',
    full_description: 'A wardrobe staple crafted from heavyweight 240GSM cotton. Designed with a wide crew neck, dropped shoulders, and elbow-length sleeves for a clean, structural drape that provides optimal coverage without bulk.',
    price: 4500,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sand Beige', 'Charcoal Black', 'Off-White', 'Muted Olive'],
    images: [
      '/images/mens_oversized_tee.png'
    ],
    featured: true,
    in_stock: true,
    fit_notes: 'True to oversized fit. Take your normal size for a relaxed look, or size down for a more standard fit.',
    fabric: '100% Organic Heavyweight Cotton (240 GSM)',
    care: 'Machine wash cold, line dry in shade. Iron medium.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Oversized Basics',
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    title: 'Relaxed Linen Trouser',
    slug: 'relaxed-linen-trouser',
    description: 'Flowy and breathable trousers crafted from premium washed linen.',
    full_description: 'Designed for warm climates, these relaxed-fit trousers offer maximum comfort and complete coverage. Features a flat-front elasticated waistband at the back, subtle side slip pockets, and a clean fluid drape.',
    price: 6800,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Natural Oat', 'Olive Oil', 'Classic Ivory'],
    images: [
      '/images/mens_linen_shirt.png'
    ],
    featured: true,
    in_stock: true,
    fit_notes: 'Relaxed straight-leg fit. Elastic waistband with drawcord for ultimate comfort.',
    fabric: '100% Pure Flax Linen',
    care: 'Hand wash cold or dry clean. Do not tumble dry.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Premium Linen',
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    title: "Men's Open Duster Cardigan",
    slug: 'mens-open-duster-cardigan',
    description: 'A minimalist open-front duster cardigan for elegant daily layering.',
    full_description: 'An unstructured outerwear piece with wide sleeves and side pockets. Made from a premium medium-weight cotton-linen weave that flows beautifully as you walk. Versatile design that pairs perfectly with basic tees or linen trousers.',
    price: 8900,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sage Green', 'Espresso Brown', 'Soft Onyx'],
    images: [
      '/images/mens_duster_cardigan.png'
    ],
    featured: true,
    in_stock: true,
    fit_notes: 'Designed for a loose, comfortable fit. Take your normal size.',
    fabric: 'Premium Cotton-Linen Blend',
    care: 'Machine wash cold, lay flat to dry. Steam iron only.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Layering Pieces',
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    title: 'Linen Resort Button-Up',
    slug: 'linen-resort-button-up',
    description: 'Relaxed long-line shirt in soft-washed linen for men.',
    full_description: 'A tunic-length button-down shirt featuring a band collar, curved hemline with side slits, and a relaxed boxy cut. Extra length in the back provides flattering coverage.',
    price: 5500,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000002',
    sizes: ['M', 'L', 'XL'],
    colors: ['Sea Salt White', 'Sage Green', 'Warm Sand'],
    images: [
      '/images/mens_resort_shirt.png'
    ],
    featured: false,
    in_stock: true,
    fit_notes: 'Relaxed fit. Drop shoulder design.',
    fabric: '100% Organic Linen',
    care: 'Gentle machine wash cold. Iron while damp.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Premium Linen',
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    title: 'Heavyweight Hooded Duster',
    slug: 'heavyweight-hooded-duster',
    description: 'Unisex heavy knit duster cardigan with a generous hood.',
    full_description: 'An ankle-length open cardigan constructed from a heavy double-knit cotton blend. Features deep patch pockets, an oversized hood, and rib-knit cuffs. The ultimate streetwear layering piece.',
    price: 9800,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    sizes: ['S-M', 'L-XL'],
    colors: ['Slate Grey', 'Olive Drab', 'Camel Sand'],
    images: [
      '/images/mens_hooded_duster.png'
    ],
    featured: true,
    in_stock: true,
    fit_notes: 'Anatomically designed to fit loosely. S-M covers up to 5\'8", L-XL for 5\'9" and above.',
    fabric: 'Cotton-Poly Double Knit Blend',
    care: 'Cold wash inside out. Dry flat to preserve shape.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Streetwear',
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000006',
    title: 'Modular Travel Cargo Pants',
    slug: 'modular-travel-cargo-pants',
    description: 'Loose-fit utility cargos with water-resistant finish.',
    full_description: 'Crafted from lightweight nylon-stretch material, these cargo pants offer maximum comfort for long travel days. Elastic waist with drawstring, articulated knees, and multi-pocket configuration for functionality.',
    price: 7200,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Desert Khaki', 'Onyx Black'],
    images: [
      '/images/mens_travel_cargo.png'
    ],
    featured: false,
    in_stock: true,
    fit_notes: 'Relaxed utility fit. Features adjustable toggles at the ankles.',
    fabric: '92% Nylon, 8% Spandex with DWR Coating',
    care: 'Machine wash cold. Tumble dry low.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Travel Fits',
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    title: 'Textured Crepe Kurta Tunic',
    slug: 'textured-crepe-kurta-tunic',
    description: 'Elegant high-neck long-line kurta with subtle detailing.',
    full_description: 'An elegant, long-line kurta tunic designed for formal occasions and gatherings. Features a modest clean collar, long sleeves, and a tailored yet comfortable silhouette that provides optimal coverage.',
    price: 11200,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dusty Rose', 'Deep Mulberry', 'Navy Blue'],
    images: [
      '/images/mens_kurta_fit.png'
    ],
    featured: true,
    in_stock: true,
    fit_notes: 'Regular fit through shoulders, expanding into a relaxed long-line tunic. Perfect for pairing with linen or cotton trousers.',
    fabric: 'Premium Textured Crepe Fabric',
    care: 'Hand wash cold or dry clean. Hang dry. Light steam.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Occasion Wear',
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'p1000000-0000-0000-0000-000000000008',
    title: 'Essential Layering Slip Tunic',
    slug: 'essential-layering-slip-tunic',
    description: 'Opaque crew-neck inner layering tunic for men.',
    full_description: 'A straight-cut sleeveless slip tunic designed specifically for layering. Made from non-see-through satin-back crepe. Features a high crew neck and side slits for ease of movement under open cardigans and dusters.',
    price: 4200,
    currency: 'LKR',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory White', 'True Black', 'Warm Nude'],
    images: [
      '/images/mens_slip_tunic.png'
    ],
    featured: false,
    in_stock: true,
    fit_notes: 'Straight column silhouette. Order your standard size.',
    fabric: 'Satin-Back Crepe',
    care: 'Machine wash gentle cold. Iron low.',
    delivery_info: 'Delivered within 2-5 days',
    style_label: 'Layering Pieces',
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_LOOKBOOK: LookbookItem[] = [
  {
    id: 'l1000000-0000-0000-0000-000000000001',
    title: 'Oversized Minimalism',
    image: '/images/mens_hero_bg.png',
    caption: 'A clean combination of our Oversized Premium Tee and Relaxed Linen Trouser in natural, warm sand tones.',
    collection: 'Summer 2026',
    related_product_ids: ['p1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000002'],
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'l1000000-0000-0000-0000-000000000002',
    title: 'Modern Utility & Layers',
    image: '/images/mens_streetwear_fit.png',
    caption: 'Layering with the Heavyweight Hooded Duster and Modular Travel Cargo Pants for an active yet modest urban silhouette.',
    collection: 'Winter 2026',
    related_product_ids: ['p1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000006'],
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'l1000000-0000-0000-0000-000000000003',
    title: 'Traditional Modernity',
    image: '/images/mens_kurta_fit.png',
    caption: 'The Textured Crepe Kurta Tunic paired over our Essential Layering Slip Tunic for structured modest formal look.',
    collection: 'Spring 2026',
    related_product_ids: ['p1000000-0000-0000-0000-000000000007', 'p1000000-0000-0000-0000-000000000008'],
    sort_order: 3,
    created_at: new Date().toISOString()
  }
];

export const MOCK_FAQS = [
  {
    question: 'How do I place an order?',
    answer: 'Simply browse our catalog, select your desired item, choose your size and color, and click "Order on WhatsApp". This will open a WhatsApp chat with a pre-filled message detailing your selected item. Our team will then guide you manually to finalize the order and delivery details.',
    category: 'Ordering'
  },
  {
    question: 'What are the delivery times and charges?',
    answer: 'We deliver island-wide in Sri Lanka. Standard delivery takes 2 to 5 business days. Delivery charges depend on your location and are confirmed during our WhatsApp conversation prior to completing your order.',
    category: 'Delivery'
  },
  {
    question: 'How do I know my correct size?',
    answer: 'Every product page features a Size Guide button with specific dimensions for that item. Since modest wear is designed for a looser fit, we recommend selecting your regular size for an oversized look, or sizing down if you prefer a closer fit. You can also ask for customized size recommendations over WhatsApp.',
    category: 'Sizing'
  },
  {
    question: 'Do you accept returns or exchanges?',
    answer: 'Yes, we accept exchanges within 7 days of delivery, provided the tags are intact and the garment is unworn. Please contact us on WhatsApp to initiate an exchange. Return delivery costs are the responsibility of the customer unless the item was damaged or incorrect.',
    category: 'Returns'
  },
  {
    question: 'What payment methods do you support?',
    answer: 'For the MVP stage, we accept Bank Transfer (remittance prior to delivery) and Cash on Delivery (COD) in select areas. We will share banking details and confirm COD availability in your location over WhatsApp.',
    category: 'Payment'
  }
];
