import Image from 'next/image';
import { FadeIn, SlideUp, StaggerContainer, StaggerChild } from '@/components/motion/Transitions';

export const metadata = {
  title: 'Our Philosophy — About Us | AUREN',
  description: 'Learn about AUREN, a curated modest fashion discovery platform. We believe in minimalist silhouettes, covered comfort, and confident styling.',
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Header */}
      <section className="relative h-[45vh] flex items-center justify-center bg-brand-charcoal text-brand-cream select-none">
        <div className="absolute inset-0 bg-brand-charcoal">
          <Image
            src="/images/mens_hero_bg.png"
            alt="Auren Brand Philosophy"
            fill
            className="object-cover opacity-25 object-center"
            unoptimized
          />
        </div>
        <div className="relative z-10 text-center space-y-3 px-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-beige">
            Curation / Intention
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-wider">
            Our Philosophy
          </h1>
        </div>
      </section>

      {/* Main Philosophy statement */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <FadeIn>
          <h2 className="font-display text-xl sm:text-3xl font-bold uppercase tracking-wider text-brand-charcoal">
            Style shouldn&apos;t compromise comfort.
          </h2>
        </FadeIn>
        <SlideUp className="text-sm sm:text-base font-light text-brand-charcoal/70 leading-relaxed space-y-6 max-w-2xl mx-auto">
          <p>
            AUREN was founded on a simple premise: individuals who prefer covered, loose, or modest clothing deserve a curated, modern aesthetic that feels premium and fashion-first.
          </p>
          <p>
            We steer away from noisy designs and traditional templates. Instead, we draw inspiration from minimalism, neutral palettes, streetwear silhouettes, and high-end textiles to create looks that feel style-led and inclusive.
          </p>
        </SlideUp>
      </section>

      {/* Core Values / Promsies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SlideUp delay={0.2} className="p-8 border border-brand-charcoal/5 bg-brand-cream space-y-4 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-brand-gold">
              01 / Curated Silhouettes
            </h3>
            <p className="text-xs font-light text-brand-charcoal/65 leading-relaxed">
              We handpick and custom engineer garments with specific lengths, dropped shoulders, and wide cuts. Every piece is engineered for elegant drape and proper coverage.
            </p>
          </SlideUp>
          <SlideUp delay={0.4} className="p-8 border border-brand-charcoal/5 bg-brand-cream space-y-4 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-brand-gold">
              02 / Textile Integrity
            </h3>
            <p className="text-xs font-light text-brand-charcoal/65 leading-relaxed">
              We prioritize organic, high-density cotton (240+ GSM), breathable flax linen, and high-grade crepes that preserve opaque coverage while offering temperature-regulated breathing.
            </p>
          </SlideUp>
          <SlideUp delay={0.6} className="p-8 border border-brand-charcoal/5 bg-brand-cream space-y-4 text-center md:text-left">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-brand-gold">
              03 / Frictionless Discovery
            </h3>
            <p className="text-xs font-light text-brand-charcoal/65 leading-relaxed">
              By replacing complex checkout systems with personalized WhatsApp ordering, we provide direct communication, manual size verification, and customer service that builds immediate trust.
            </p>
          </SlideUp>
        </div>
      </section>

      {/* Aesthetic Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8 border-t border-brand-charcoal/10">
        <div className="space-y-4 text-center md:text-left">
          <h3 className="font-display text-lg sm:text-2xl font-bold uppercase tracking-wider text-brand-charcoal">
            Confidence in coverage.
          </h3>
          <p className="text-xs sm:text-sm font-light text-brand-charcoal/70 leading-relaxed max-w-md mx-auto md:mx-0">
            Modest fashion is not just a religious or cultural practice — it is a confident, deliberate style choice. We serve customers looking for elegant overlays, travel outfits, relaxed university basics, and minimal streetwear.
          </p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden bg-brand-charcoal">
          <Image
            src="/images/mens_linen_shirt.png"
            alt="Opaque Linen overlay drape"
            fill
            className="object-cover opacity-80"
            unoptimized
          />
        </div>
      </section>
    </div>
  );
}
