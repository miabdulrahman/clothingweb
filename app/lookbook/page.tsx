import Link from 'next/link';
import Image from 'next/image';
import { getLookbookItems } from '@/lib/services';
import { FadeIn, SlideUp, StaggerContainer, StaggerChild } from '@/components/motion/Transitions';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Lookbook — Style Inspiration | AUREN',
  description:
    'Explore our editorial style boards and seasonal lookbooks. Learn how to combine loose fits, basic layers, and premium linen pieces.',
};

export default async function LookbookPage() {
  const lookbookItems = await getLookbookItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-20">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold dark:text-dark-gold">
          Style Inspiration
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal dark:text-dark-text">
          The Lookbook
        </h1>
        <p className="text-sm text-brand-charcoal/50 dark:text-dark-muted font-light max-w-lg mx-auto leading-relaxed">
          A visual directory of curated silhouettes. Click on any outfit combination to discover and shop the featured individual pieces.
        </p>
      </div>

      {/* Masonry / Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {lookbookItems.map((item, index) => (
          <StaggerChild
            key={item.id}
            className="group flex flex-col space-y-4"
          >
            {/* Image Box */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-brand-beige/10 dark:bg-dark-card border border-brand-charcoal/5 dark:border-dark-border transition-theme">
              {item.collection && (
                <div className="absolute top-4 left-4 z-10 bg-brand-charcoal dark:bg-dark-gold text-brand-cream dark:text-dark-bg text-[9px] uppercase tracking-widest font-semibold py-1.5 px-3">
                  {item.collection}
                </div>
              )}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/70 dark:from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-6">
                <p className="text-sm text-brand-cream font-light leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>

            {/* Info details & Shoppable Links */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-brand-charcoal dark:text-dark-text">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-charcoal/50 dark:text-dark-muted font-light mt-1 md:hidden">
                  {item.caption}
                </p>
              </div>

              {/* Related products card tray */}
              {item.related_products && item.related_products.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-brand-charcoal/10 dark:border-dark-border">
                  <h4 className="text-[9px] uppercase tracking-widest font-bold text-brand-charcoal/60 dark:text-dark-muted">
                    Shop This Look:
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {item.related_products.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        className="flex items-center space-x-3 p-2 bg-brand-cream dark:bg-dark-card hover:bg-brand-charcoal/5 dark:hover:bg-dark-border transition-colors duration-300 border border-brand-charcoal/5 dark:border-dark-border group/item"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0 bg-brand-beige/5 dark:bg-dark-bg/50">
                          <Image
                            src={prod.images[0] || 'https://placehold.co/100x133'}
                            alt={prod.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <h5 className="text-xs font-medium text-brand-charcoal dark:text-dark-text group-hover/item:text-brand-gold dark:group-hover/item:text-dark-gold transition-colors duration-300 truncate">
                            {prod.title}
                          </h5>
                          <p className="text-[10px] font-semibold text-brand-charcoal/70 dark:text-dark-muted">
                            {formatPrice(prod.price, prod.currency)}
                          </p>
                        </div>
                        <span className="text-brand-charcoal/30 dark:text-dark-muted/40 group-hover/item:text-brand-charcoal dark:group-hover/item:text-dark-text group-hover/item:translate-x-1 transition-all duration-300 pr-1">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StaggerChild>
        ))}
      </StaggerContainer>
    </div>
  );
}
