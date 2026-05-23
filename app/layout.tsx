import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/whatsapp/FloatingWhatsApp';
import AnalyticsTracker from '@/components/layout/AnalyticsTracker';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AUREN — Premium Modest Fashion Discovery & Curation',
  description:
    'Discover clean, stylish, everyday modest fashion. Handpicked collections featuring oversized cuts, premium linen, and layered looks with seamless WhatsApp ordering.',
  openGraph: {
    title: 'AUREN — Premium Modest Fashion',
    description: 'Clean, intentional, everyday modest clothing with seamless WhatsApp ordering.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AUREN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-24 md:pt-28">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
          <AnalyticsTracker />
        </CartProvider>
      </body>
    </html>
  );
}
