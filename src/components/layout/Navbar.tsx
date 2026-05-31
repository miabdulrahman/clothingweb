'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeProvider';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300 hover:bg-brand-charcoal/5 dark:hover:bg-white/10 focus:outline-none cursor-pointer group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <motion.svg
          className="absolute inset-0 w-5 h-5 text-brand-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
            rotate: isDark ? -90 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </motion.svg>
        {/* Moon icon */}
        <motion.svg
          className="absolute inset-0 w-5 h-5 text-dark-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
            rotate: isDark ? 0 : 90,
          }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </motion.svg>
      </div>
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          isScrolled
            ? 'py-3 glass shadow-sm dark:shadow-black/20'
            : 'py-6 bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-display text-2xl font-bold tracking-widest text-brand-charcoal dark:text-dark-text transition-colors duration-300"
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
                      'text-sm font-medium tracking-wider uppercase transition-colors duration-300 relative py-1',
                      isActive
                        ? 'text-brand-charcoal dark:text-dark-text font-semibold'
                        : 'text-brand-charcoal/60 dark:text-dark-muted hover:text-brand-charcoal dark:hover:text-dark-text'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-charcoal dark:bg-dark-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button, Theme Toggle & Cart Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeToggleButton />
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-brand-charcoal dark:text-dark-text hover:text-brand-gold dark:hover:text-dark-gold focus:outline-none transition-colors duration-300 relative cursor-pointer"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-brand-cream bg-brand-gold dark:bg-dark-gold dark:text-dark-bg rounded-full transform translate-x-1/3 -translate-y-1/3"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-widest border border-brand-charcoal dark:border-dark-text/30 text-brand-charcoal dark:text-dark-text hover:bg-brand-charcoal hover:text-brand-cream dark:hover:bg-dark-text dark:hover:text-dark-bg transition-all duration-300 ease-in-out rounded-none"
              >
                Shop Collection
              </Link>
            </div>

            {/* Mobile actions & menu button */}
            <div className="md:hidden flex items-center space-x-1">
              <ThemeToggleButton />
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-brand-charcoal dark:text-dark-text hover:text-brand-gold dark:hover:text-dark-gold focus:outline-none transition-colors duration-300 relative cursor-pointer"
                aria-label="Open cart"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-brand-cream bg-brand-gold dark:bg-dark-gold dark:text-dark-bg rounded-full transform translate-x-1/3 -translate-y-1/3"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-brand-charcoal dark:text-dark-text hover:text-brand-gold dark:hover:text-dark-gold focus:outline-none transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <motion.span
                    className="absolute left-0 block w-6 h-[1.5px] bg-current"
                    animate={isOpen ? { top: '50%', rotate: 45, y: '-50%' } : { top: '25%', rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                  <motion.span
                    className="absolute left-0 top-1/2 -translate-y-1/2 block w-6 h-[1.5px] bg-current"
                    animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute left-0 block w-6 h-[1.5px] bg-current"
                    animate={isOpen ? { top: '50%', rotate: -45, y: '-50%' } : { top: '75%', rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
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
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-brand-charcoal/50 dark:bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-brand-cream dark:bg-dark-surface p-6 shadow-xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pt-20">
                <nav className="flex flex-col space-y-5">
                  {NAV_LINKS.map((link, idx) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ delay: 0.1 + idx * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <Link
                          href={link.href}
                          className={cn(
                            'text-xl font-display font-medium tracking-wide block py-2 border-b border-brand-charcoal/5 dark:border-dark-border transition-colors duration-300',
                            isActive
                              ? 'text-brand-charcoal dark:text-dark-text font-bold border-brand-charcoal/20 dark:border-dark-gold/30'
                              : 'text-brand-charcoal/70 dark:text-dark-muted hover:text-brand-charcoal dark:hover:text-dark-text'
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Link
                  href="/catalog"
                  className="w-full inline-flex items-center justify-center py-3 text-sm font-semibold uppercase tracking-widest bg-brand-charcoal dark:bg-dark-gold text-brand-cream dark:text-dark-bg hover:bg-brand-charcoal/90 dark:hover:bg-dark-gold/90 transition-all duration-300 rounded-none text-center"
                >
                  View Catalog
                </Link>
                <p className="text-[10px] text-center text-brand-charcoal/40 dark:text-dark-muted/60 uppercase tracking-widest font-medium">
                  Auren — Premium Modest Wear
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
