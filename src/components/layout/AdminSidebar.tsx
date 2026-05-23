'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    // Clear mock cookie first in case we're in mock mode
    document.cookie = 'mock-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    
    // Attempt Supabase signout
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignored if client fails/not configured
    }

    router.refresh();
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-brand-charcoal/5 sticky top-0 z-40">
        <Link href="/admin" className="font-display text-xl tracking-[0.2em] text-brand-charcoal uppercase">
          Auren Admin
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-brand-charcoal hover:bg-brand-cream transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-brand-charcoal/30 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-35 w-64 bg-brand-charcoal text-brand-cream border-r border-brand-charcoal/20 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="px-8 py-8 border-b border-brand-cream/10 hidden lg:block">
            <Link href="/admin" className="font-display text-2xl font-light tracking-[0.25em] text-brand-cream uppercase block">
              Auren
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-brand-gold font-medium mt-1 block">
              Admin Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest transition-all duration-300 rounded-none group ${
                    isActive
                      ? 'bg-brand-cream text-brand-charcoal font-semibold'
                      : 'text-brand-cream/70 hover:bg-brand-cream/5 hover:text-brand-cream'
                  }`}
                >
                  <span className={isActive ? 'text-brand-charcoal' : 'text-brand-cream/50 group-hover:text-brand-cream'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Operations */}
        <div className="p-4 border-t border-brand-cream/10 bg-black/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-[9px] uppercase tracking-widest text-brand-cream/40">Logged in as</p>
            <p className="text-xs truncate text-brand-gold font-medium mt-0.5">{userEmail}</p>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest text-brand-cream/70 hover:bg-brand-cream/5 hover:text-brand-cream transition-all duration-300"
            >
              <svg className="w-4 h-4 text-brand-cream/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Shop
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-300 text-left cursor-pointer rounded-none"
            >
              <svg className="w-4 h-4 text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
