'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getWhatsAppDisplayNumber, buildWhatsAppInquiryUrl } from '@/lib/whatsapp';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    return null;
  }

  const whatsappDisplay = getWhatsAppDisplayNumber();
  const whatsappUrl = buildWhatsAppInquiryUrl();

  return (
    <footer className="bg-brand-charcoal dark:bg-dark-bg text-brand-cream pt-16 pb-8 border-t border-brand-charcoal/20 dark:border-dark-border transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl font-bold tracking-widest">AUREN</h3>
            <p className="text-sm text-brand-beige/85 dark:text-dark-muted max-w-xs leading-relaxed font-light">
              A modern modest fashion platform for clean, stylish, everyday wear. Curation with intention and confidence.
            </p>
          </div>

          {/* Links Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold dark:text-dark-gold">Browse</h4>
            <ul className="space-y-2.5 text-sm text-brand-beige/70 dark:text-dark-muted/70">
              <li>
                <Link href="/catalog" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  Style Categories
                </Link>
              </li>
              <li>
                <Link href="/catalog?featured=true" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Service Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold dark:text-dark-gold">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-brand-beige/70 dark:text-dark-muted/70">
              <li>
                <Link href="/about" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  FAQs & Sizing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300 hover-underline inline-block">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4 col-span-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold dark:text-dark-gold">Newsletter</h4>
            <p className="text-xs text-brand-beige/70 dark:text-dark-muted/70 leading-relaxed font-light">
              Subscribe to receive styling inspirations, lookbooks, and notifications of new arrivals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-brand-charcoal/50 dark:bg-dark-surface border border-brand-beige/30 dark:border-dark-border px-3 py-2 text-xs text-brand-cream dark:text-dark-text rounded-none focus:outline-none focus:border-brand-gold dark:focus:border-dark-gold focus:shadow-[0_0_12px_rgba(184,160,126,0.15)] w-full transition-all duration-300 font-sans placeholder:text-brand-beige/40 dark:placeholder:text-dark-muted/40"
                required
              />
              <button
                type="submit"
                className="bg-brand-gold dark:bg-dark-gold hover:bg-brand-gold/90 dark:hover:bg-dark-gold/80 text-brand-charcoal dark:text-dark-bg px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 rounded-none hover:shadow-[0_0_16px_rgba(184,160,126,0.2)]"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <hr className="border-brand-beige/10 dark:border-dark-border mb-8" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-beige/50 dark:text-dark-muted/50 space-y-4 sm:space-y-0">
          <div>
            <p>© {new Date().getFullYear()} AUREN. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300">
              WhatsApp: {whatsappDisplay}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300">
              Instagram
            </a>
            <Link href="/faq" className="hover:text-brand-cream dark:hover:text-dark-text transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
