import React from 'react';
import Link from 'next/link';
import { getAdminStats } from '@/lib/services';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

// Force dynamic rendering to ensure stats are fresh on load
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  
  // Calculate conversion rate
  const conversionRate = stats.totalPageViews > 0 
    ? ((stats.whatsappClicks / stats.totalPageViews) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-charcoal/5 pb-6">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wider text-brand-charcoal uppercase">
            Overview
          </h1>
          <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">
            Real-time analytics and inventory status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              + Add Product
            </Button>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              View Storefront
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Products */}
        <div className="bg-white border border-brand-charcoal/10 p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-beige" />
          <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
            Total Inventory
          </p>
          <p className="font-display text-3xl font-light text-brand-charcoal mt-2">
            {stats.totalProducts}
          </p>
          <div className="flex justify-between items-center text-[10px] text-brand-charcoal/60 mt-3 pt-3 border-t border-brand-charcoal/5">
            <span>{stats.inStockCount} In Stock</span>
            <span>{stats.outOfStockCount} Out</span>
          </div>
        </div>

        {/* Card 2: WhatsApp Clicks */}
        <div className="bg-white border border-brand-charcoal/10 p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#25D366]" />
          <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
            WhatsApp Leads
          </p>
          <p className="font-display text-3xl font-light text-brand-charcoal mt-2">
            {stats.whatsappClicks}
          </p>
          <div className="text-[10px] text-[#20ba5a] font-medium mt-3 pt-3 border-t border-brand-charcoal/5">
            📞 Direct inquiries initiated
          </div>
        </div>

        {/* Card 3: Total Page Views */}
        <div className="bg-white border border-brand-charcoal/10 p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
          <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
            Total Traffic
          </p>
          <p className="font-display text-3xl font-light text-brand-charcoal mt-2">
            {stats.totalPageViews}
          </p>
          <div className="text-[10px] text-brand-charcoal/60 mt-3 pt-3 border-t border-brand-charcoal/5">
            👁️ Page views logged
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-white border border-brand-charcoal/10 p-6 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-charcoal" />
          <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
            Conversion Rate
          </p>
          <p className="font-display text-3xl font-light text-brand-charcoal mt-2">
            {conversionRate}%
          </p>
          <div className="text-[10px] text-brand-charcoal/60 mt-3 pt-3 border-t border-brand-charcoal/5">
            📈 View to WhatsApp click
          </div>
        </div>
      </div>

      {/* Main Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Column */}
        <div className="bg-white border border-brand-charcoal/10 p-6 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6">
            Traffic vs WhatsApp Leads (Last 7 Days)
          </h2>
          
          {/* Simple Premium CSS Bar Chart */}
          <div className="h-64 flex items-end gap-3 pt-4 border-b border-brand-charcoal/10">
            {stats.viewsOverTime.map((item, idx) => {
              const maxViews = Math.max(...stats.viewsOverTime.map(d => d.views), 1);
              const viewPercentage = (item.views / maxViews) * 100;
              const clickPercentage = (item.clicks / maxViews) * 100 * 5; // scaled up to be visible in comparison
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-brand-charcoal text-brand-cream text-[9px] uppercase tracking-widest py-1.5 px-3 z-10 whitespace-nowrap shadow-lg">
                    {item.views} Views | {item.clicks} Clicks
                  </div>
                  
                  {/* Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 h-full pb-2">
                    {/* Traffic Bar */}
                    <div 
                      style={{ height: `${viewPercentage}%` }} 
                      className="w-4 bg-brand-beige/50 group-hover:bg-brand-gold transition-colors duration-300"
                    />
                    {/* WhatsApp Lead Bar */}
                    <div 
                      style={{ height: `${Math.min(clickPercentage, 100)}%` }} 
                      className="w-4 bg-brand-charcoal group-hover:bg-[#20ba5a] transition-colors duration-300"
                    />
                  </div>
                  
                  {/* X Axis Label */}
                  <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 mt-2 font-medium">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-6 mt-4 text-[9px] uppercase tracking-widest text-brand-charcoal/60 font-semibold justify-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-beige/50" />
              <span>Page Views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-charcoal" />
              <span>WhatsApp Clicks (Scaled x5)</span>
            </div>
          </div>
        </div>

        {/* Top Products sidebar */}
        <div className="bg-white border border-brand-charcoal/10 p-6 flex flex-col">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6">
            Top Performing Products
          </h2>
          <div className="space-y-6 flex-1 justify-center">
            {stats.topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 border-b border-brand-charcoal/5 pb-4 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand-charcoal truncate uppercase tracking-wider">
                    {prod.title}
                  </p>
                  <p className="text-[10px] text-brand-charcoal/50 mt-0.5">
                    {prod.views} Views
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#20ba5a] font-medium bg-[#25D366]/10 px-2 py-1">
                  <span>📞</span>
                  <span>{prod.whatsappClicks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white border border-brand-charcoal/10 p-6">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-4">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/admin/products"
            className="border border-brand-charcoal/10 hover:border-brand-gold p-4 transition duration-300 group"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal group-hover:text-brand-gold transition-colors">
              Manage Products →
            </h3>
            <p className="text-[10px] text-brand-charcoal/50 mt-1">
              Add, update, or remove items from storefront catalog.
            </p>
          </Link>
          <Link 
            href="/admin/analytics"
            className="border border-brand-charcoal/10 hover:border-brand-gold p-4 transition duration-300 group"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal group-hover:text-brand-gold transition-colors">
              View Detailed Analytics →
            </h3>
            <p className="text-[10px] text-brand-charcoal/50 mt-1">
              Check product traffic logs and conversion ratios.
            </p>
          </Link>
          <Link 
            href="/catalog"
            className="border border-brand-charcoal/10 hover:border-brand-gold p-4 transition duration-300 group"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal group-hover:text-brand-gold transition-colors">
              Browse Storefront →
            </h3>
            <p className="text-[10px] text-brand-charcoal/50 mt-1">
              See the customer view of the online catalog.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
