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
    <footer className="bg-brand-charcoal text-brand-cream pt-16 pb-8 border-t border-brand-charcoal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl font-bold tracking-widest">AUREN</h3>
            <p className="text-sm text-brand-beige/85 max-w-xs leading-relaxed font-light">
              A modern modest fashion platform for clean, stylish, everyday wear. Curation with intention and confidence.
            </p>
          </div>

          {/* Links Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Browse</h4>
            <ul className="space-y-2 text-sm text-brand-beige/70">
              <li>
                <Link href="/catalog" className="hover:text-brand-cream transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-brand-cream transition-colors">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-cream transition-colors">
                  Style Categories
                </Link>
              </li>
              <li>
                <Link href="/catalog?featured=true" className="hover:text-brand-cream transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Service Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Customer Care</h4>
            <ul className="space-y-2 text-sm text-brand-beige/70">
              <li>
                <Link href="/about" className="hover:text-brand-cream transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-cream transition-colors">
                  FAQs & Sizing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-cream transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream transition-colors">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4 col-span-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Newsletter</h4>
            <p className="text-xs text-brand-beige/70 leading-relaxed font-light">
              Subscribe to receive styling inspirations, lookbooks, and notifications of new arrivals.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-brand-charcoal/50 border border-brand-beige/30 px-3 py-2 text-xs text-brand-cream rounded-none focus:outline-none focus:border-brand-gold w-full transition-colors font-sans"
                required
              />
              <button
                type="submit"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors rounded-none"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <hr className="border-brand-beige/10 mb-8" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-beige/50 space-y-4 sm:space-y-0">
          <div>
            <p>© {new Date().getFullYear()} AUREN. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream transition-colors">
              WhatsApp: {whatsappDisplay}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cream transition-colors">
              Instagram
            </a>
            <Link href="/faq" className="hover:text-brand-cream transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
