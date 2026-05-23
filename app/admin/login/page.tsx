'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const notConfigured = 
      !supabaseUrl || 
      supabaseUrl === 'https://your-project-id.supabase.co' || 
      !supabaseAnonKey || 
      supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here';
      
    setIsMockMode(!!notConfigured);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isMockMode) {
        // Set a mock cookie for the layout auth guard to read
        document.cookie = 'mock-admin-session=true; path=/; max-age=86400';
        router.refresh();
        router.push('/admin');
      } else {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        router.refresh();
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockBypass = () => {
    setEmail('admin@auren.com');
    setPassword('password123');
    // Set cookie and login
    document.cookie = 'mock-admin-session=true; path=/; max-age=86400';
    router.refresh();
    router.push('/admin');
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-24 bg-brand-cream relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-beige/20 blur-3xl -z-10 animate-fade-in" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl -z-10 animate-fade-in" style={{ animationDelay: '0.2s' }} />

      <div className="w-full max-w-md bg-white border border-brand-charcoal/10 p-8 md:p-10 shadow-2xl relative">
        {/* Brand Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-beige via-brand-gold to-brand-charcoal" />

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-light tracking-[0.2em] text-brand-charcoal mb-2 uppercase">
            Auren
          </h1>
          <p className="text-xs uppercase tracking-widest text-brand-gold font-medium">
            Management Portal
          </p>
        </div>

        {isMockMode && (
          <div className="mb-6 p-4 border border-brand-gold/20 bg-brand-gold/5 text-xs text-brand-charcoal/80 leading-relaxed">
            <p className="font-semibold text-brand-charcoal uppercase tracking-wider mb-1">
              ✨ Developer Sandbox Mode Active
            </p>
            <p className="mb-3">
              Supabase environment variables are not fully configured. You can log in using any credentials, or click below for instant access.
            </p>
            <button
              type="button"
              onClick={handleMockBypass}
              className="w-full py-2 bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 text-[10px] uppercase tracking-widest font-semibold transition duration-300"
            >
              Bypass Auth with Demo Account
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 border border-red-200 bg-red-50 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@auren.com"
              className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-sm rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-sm rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="py-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal transition-colors font-semibold"
          >
            ← Return to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
