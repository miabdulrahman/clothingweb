'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isAdminPath = pathname.startsWith('/admin');

  if (isAdminPath) {
    return null; // Render custom navbar inside admin layout instead
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled
            ? 'py-4 glass shadow-sm'
            : 'py-6 bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-display text-2xl font-bold tracking-widest text-brand-charcoal"
              >
                AUREN
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm font-medium tracking-wider uppercase transition-colors relative py-1',
                      isActive
                        ? 'text-brand-charcoal font-semibold'
                        : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-charcoal"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button (Quick Catalog Link) & Cart Toggle */}
            <div className="hidden md:flex items-center space-x-5">
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-brand-charcoal hover:text-brand-gold focus:outline-none transition-colors relative cursor-pointer"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-brand-cream bg-brand-gold rounded-full transform translate-x-1/3 -translate-y-1/3">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-widest border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream transition-all duration-300 ease-in-out rounded-none"
              >
                Shop Collection
              </Link>
            </div>

            {/* Mobile actions & menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-brand-charcoal hover:text-brand-gold focus:outline-none transition-colors relative cursor-pointer"
                aria-label="Open cart"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-brand-cream bg-brand-gold rounded-full transform translate-x-1/3 -translate-y-1/3">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-brand-charcoal hover:text-brand-gold focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-brand-charcoal/45 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-brand-cream p-6 shadow-xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-20">
                <nav className="flex flex-col space-y-6">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            'text-xl font-display font-medium tracking-wide block py-2 border-b border-brand-charcoal/5',
                            isActive
                              ? 'text-brand-charcoal font-bold border-brand-charcoal/20'
                              : 'text-brand-charcoal/70 hover:text-brand-charcoal'
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4">
                <Link
                  href="/catalog"
                  className="w-full inline-flex items-center justify-center py-3 text-sm font-semibold uppercase tracking-widest bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 transition-all rounded-none text-center"
                >
                  View Catalog
                </Link>
                <p className="text-[10px] text-center text-brand-charcoal/40 uppercase tracking-widest font-medium">
                  Auren — Premium Modest Wear
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
