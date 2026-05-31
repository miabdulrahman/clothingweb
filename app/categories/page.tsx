import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/services';
import { StaggerContainer, StaggerChild } from '@/components/motion/Transitions';

export const metadata = {
  title: 'Style Categories | AUREN',
  description: 'Browse our modest clothing collections by style intent: daily wear, oversized tees, linen sets, and occasion wear.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold dark:text-dark-gold">
          Browse Collections
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider text-brand-charcoal dark:text-dark-text">
          Style Intentions
        </h1>
        <p className="text-sm text-brand-charcoal/50 dark:text-dark-muted font-light max-w-lg mx-auto leading-relaxed">
          Explore clothing tailored to specific occasions and lifestyle fits, optimized for both structure and comfort.
        </p>
      </div>

      {/* Grid of Categories */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <StaggerChild key={category.id}>
            <Link
              href={`/catalog?category=${category.slug}`}
              className="group flex flex-col space-y-4 border border-brand-charcoal/5 dark:border-dark-border p-4 bg-brand-cream dark:bg-dark-card hover:border-brand-charcoal/20 dark:hover:border-dark-gold/30 transition-all duration-400 card-hover"
            >
              {/* Image box */}
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-beige/10 dark:bg-dark-bg/50">
                <Image
                  src={category.image || 'https://placehold.co/600x450'}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold uppercase tracking-wider text-brand-charcoal dark:text-dark-text group-hover:text-brand-gold dark:group-hover:text-dark-gold transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-xs font-light text-brand-charcoal/60 dark:text-dark-muted leading-relaxed min-h-[36px]">
                  {category.description}
                </p>
                <div className="pt-2 flex items-center text-[10px] uppercase font-semibold tracking-wider text-brand-charcoal dark:text-dark-text">
                  <span>Explore products</span>
                  <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          </StaggerChild>
        ))}
      </StaggerContainer>
    </div>
  );
}
