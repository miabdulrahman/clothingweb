import Link from 'next/link';
import Image from 'next/image';
import { getCategories, getProducts } from '@/lib/services';
import ProductGrid from '@/components/product/ProductGrid';
import { FadeIn, SlideUp, StaggerContainer, StaggerChild } from '@/components/motion/Transitions';

export default async function HomePage() {
  // Load data concurrently on server
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 4 }),
  ]);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center bg-brand-charcoal text-brand-cream select-none">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 bg-brand-charcoal">
          <Image
            src="/images/mens_hero_bg.png"
            alt="Auren Editorial Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 object-center"
            unoptimized
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <FadeIn delay={0.2} duration={0.8}>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-beige">
              Curated Men&apos;s Style / Effortless Modesty
            </p>
          </FadeIn>
          <SlideUp delay={0.4} duration={0.8}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-none">
              Style with Intention
            </h1>
          </SlideUp>
          <SlideUp delay={0.6} duration={0.8}>
            <p className="text-sm sm:text-base md:text-lg text-brand-cream/80 max-w-xl mx-auto font-light leading-relaxed">
              Discover clean, modern cuts crafted for individuals who value both contemporary aesthetics and covered comfort.
            </p>
          </SlideUp>
          <SlideUp delay={0.8} duration={0.8} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-xs font-semibold uppercase tracking-widest bg-brand-cream text-brand-charcoal border border-brand-cream hover:bg-transparent hover:text-brand-cream transition-all duration-300 rounded-none text-center"
            >
              Shop Collection
            </Link>
            <Link
              href="/lookbook"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-xs font-semibold uppercase tracking-widest border border-brand-cream text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal transition-all duration-300 rounded-none text-center"
            >
              View Lookbook
            </Link>
          </SlideUp>
        </div>
      </section>

      {/* 2. TRUST SECTION / BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-brand-charcoal/10">
          <StaggerChild className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 flex items-center justify-center border border-brand-charcoal/10 rounded-full text-brand-gold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">WhatsApp First</h4>
            <p className="text-xs text-brand-charcoal/60 max-w-[200px] font-light leading-relaxed">Ordering is as simple as sending a direct chat message.</p>
          </StaggerChild>
          <StaggerChild className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 flex items-center justify-center border border-brand-charcoal/10 rounded-full text-brand-gold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Size Assistance</h4>
            <p className="text-xs text-brand-charcoal/60 max-w-[200px] font-light leading-relaxed">Dedicated measurements and manual guidance over chat.</p>
          </StaggerChild>
          <StaggerChild className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 flex items-center justify-center border border-brand-charcoal/10 rounded-full text-brand-gold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Curated Quality</h4>
            <p className="text-xs text-brand-charcoal/60 max-w-[200px] font-light leading-relaxed">We source premium fabrics designed for durability and comfort.</p>
          </StaggerChild>
          <StaggerChild className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 flex items-center justify-center border border-brand-charcoal/10 rounded-full text-brand-gold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-charcoal">Islandwide Delivery</h4>
            <p className="text-xs text-brand-charcoal/60 max-w-[200px] font-light leading-relaxed">Quick and reliable dispatch to any destination in Sri Lanka.</p>
          </StaggerChild>
        </StaggerContainer>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">Shop by intent</p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-wider text-brand-charcoal">
            Style Collections
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category, idx) => (
            <StaggerChild key={category.id}>
              <Link href={`/catalog?category=${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-brand-charcoal">
                <Image
                  src={category.image || 'https://placehold.co/400x500'}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-60"
                  unoptimized
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-brand-charcoal/80 to-transparent">
                  <h3 className="font-display text-base font-bold text-brand-cream uppercase tracking-wider mb-1">
                    {category.name}
                  </h3>
                  <p className="text-[10px] text-brand-cream/70 uppercase tracking-widest font-medium">
                    Explore →
                  </p>
                </div>
              </Link>
            </StaggerChild>
          ))}
        </StaggerContainer>
      </section>

      {/* 4. CURATED SELECTION (FEATURED PRODUCTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-brand-charcoal/10 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">Curated for you</p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-wider text-brand-charcoal">
              Featured Looks
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold uppercase tracking-widest text-brand-charcoal hover:text-brand-gold transition-colors pb-1 border-b border-brand-charcoal/20 hover:border-brand-gold"
          >
            Browse All Catalog →
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 5. EDITORIAL LOOKBOOK CALLOUT */}
      <section className="bg-brand-charcoal text-brand-cream py-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="space-y-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">Seasonal Curation</p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-tight">
                The Minimalist Lookbook
              </h2>
              <p className="text-sm text-brand-cream/80 font-light leading-relaxed max-w-lg">
                Explore our editorial layout compositions. Learn how to layer light crepes, pair oversized cotton pieces, and choose silhouettes that elevate your style while maintaining absolute comfort and confidence.
              </p>
              <div className="pt-4">
                <Link
                  href="/lookbook"
                  className="inline-flex items-center justify-center px-8 py-3 text-xs font-semibold uppercase tracking-widest bg-brand-cream text-brand-charcoal border border-brand-cream hover:bg-transparent hover:text-brand-cream transition-all duration-300 rounded-none text-center"
                >
                  View Lookbook Collections
                </Link>
              </div>
            </FadeIn>
            <SlideUp className="relative aspect-[4/3] overflow-hidden bg-brand-cream/5 border border-brand-cream/10">
              <Image
                src="/images/mens_kurta_fit.png"
                alt="Editorial lookbook layout"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-85 object-center"
                unoptimized
              />
            </SlideUp>
          </div>
        </div>
      </section>
    </div>
  );
}
