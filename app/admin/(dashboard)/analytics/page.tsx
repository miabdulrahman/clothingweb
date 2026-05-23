import React from 'react';
import Link from 'next/link';
import { getAdminStats, getProducts } from '@/lib/services';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const stats = await getAdminStats();
  const products = await getProducts();
  
  // Calculate analytics rates
  const conversionRate = stats.totalPageViews > 0 
    ? ((stats.whatsappClicks / stats.totalPageViews) * 100).toFixed(1)
    : '0.0';

  // Construct a more detailed mock funnel for the dashboard
  const productDetailViews = Math.round(stats.totalPageViews * 0.42); // assume 42% proceed to details
  
  const funnelSteps = [
    { name: 'Total Site Visits (Traffic)', count: stats.totalPageViews, percent: 100, color: 'bg-brand-beige/40' },
    { name: 'Product Details Viewed', count: productDetailViews, percent: Math.round((productDetailViews / stats.totalPageViews) * 100), color: 'bg-brand-gold/60' },
    { name: 'WhatsApp Clicks (Leads)', count: stats.whatsappClicks, percent: Math.round((stats.whatsappClicks / stats.totalPageViews) * 100), color: 'bg-[#25D366]/80' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-charcoal/5 pb-6">
        <div>
          <h1 className="font-display text-3xl font-light tracking-wider text-brand-charcoal uppercase">
            Analytics
          </h1>
          <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">
            Monitor customer engagement, traffic flow, and lead generation
          </p>
        </div>
        <div>
          <Link href="/admin">
            <Button variant="secondary" size="sm">
              ← Back to Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Conversion Funnel + Traffic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Funnel Card */}
        <div className="bg-white border border-brand-charcoal/10 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6 border-b border-brand-charcoal/5 pb-3">
              Order Conversion Funnel
            </h2>
            <p className="text-xs text-brand-charcoal/60 mb-6 leading-relaxed">
              Understand how many visitors proceed from landing on the storefront to initiating a purchase inquiry via WhatsApp.
            </p>
            
            {/* Funnel visualization */}
            <div className="space-y-6">
              {funnelSteps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                    <span className="text-brand-charcoal/70">{step.name}</span>
                    <span className="text-brand-charcoal">{step.count} ({step.percent}%)</span>
                  </div>
                  {/* Progress Bar container */}
                  <div className="w-full h-4 bg-brand-cream border border-brand-charcoal/5 relative">
                    <div 
                      style={{ width: `${step.percent}%` }}
                      className={`h-full ${step.color} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-brand-cream border border-brand-charcoal/5 text-xs text-brand-charcoal/80 leading-relaxed">
            <p className="font-semibold text-brand-charcoal uppercase tracking-wider mb-1">
              💡 Insight
            </p>
            Your current landing-to-lead conversion rate is <span className="font-bold text-brand-charcoal">{conversionRate}%</span>. A typical storefront benchmark is 2-4%. To boost conversions, ensure featured products have detailed descriptions and visible styling images.
          </div>
        </div>

        {/* Traffic Chart Card */}
        <div className="bg-white border border-brand-charcoal/10 p-6">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6 border-b border-brand-charcoal/5 pb-3">
            Traffic Trends Over Time
          </h2>
          
          <div className="h-64 flex items-end gap-3 pt-4 border-b border-brand-charcoal/10">
            {stats.viewsOverTime.map((item, idx) => {
              const maxViews = Math.max(...stats.viewsOverTime.map(d => d.views), 1);
              const viewPercentage = (item.views / maxViews) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full group relative">
                  <div className="absolute -top-8 scale-0 group-hover:scale-100 transition-transform bg-brand-charcoal text-brand-cream text-[9px] uppercase tracking-widest py-1 px-2 z-10 whitespace-nowrap shadow-lg">
                    {item.views} Views
                  </div>
                  <div 
                    style={{ height: `${viewPercentage}%` }} 
                    className="w-full bg-brand-beige/30 group-hover:bg-brand-gold transition-colors duration-300 relative"
                  >
                    {/* Small inner bar for clicks */}
                    <div 
                      style={{ height: `${(item.clicks / item.views) * 100}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-brand-charcoal group-hover:bg-[#20ba5a]"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 mt-2 font-semibold">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-6 mt-4 text-[9px] uppercase tracking-widest text-brand-charcoal/60 font-semibold justify-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-beige/30" />
              <span>Visitor Views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-charcoal" />
              <span>Direct WhatsApp Clicks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Conversion Ratio by Product + Stock Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* High Conversion Products */}
        <div className="bg-white border border-brand-charcoal/10 p-6 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6 border-b border-brand-charcoal/5 pb-3">
            Inquiry Interest by Product
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 font-semibold border-b border-brand-charcoal/10">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3 text-center">Views</th>
                  <th className="pb-3 text-center">WhatsApp Clicks</th>
                  <th className="pb-3 text-right">Interest Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal/5 font-semibold">
                {stats.topProducts.map((prod, idx) => {
                  const interestRate = prod.views > 0
                    ? ((prod.whatsappClicks / prod.views) * 100).toFixed(1)
                    : '0.0';
                  return (
                    <tr key={idx} className="hover:bg-brand-cream/10">
                      <td className="py-3 font-semibold text-brand-charcoal uppercase tracking-wider">{prod.title}</td>
                      <td className="py-3 text-center text-brand-charcoal/60">{prod.views}</td>
                      <td className="py-3 text-center text-[#20ba5a]">{prod.whatsappClicks}</td>
                      <td className="py-3 text-right text-brand-charcoal">{interestRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Out of Stock Items */}
        <div className="bg-white border border-brand-charcoal/10 p-6">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal mb-6 border-b border-brand-charcoal/5 pb-3">
            Low Stock Alerts
          </h2>
          
          {products.filter(p => !p.in_stock).length === 0 ? (
            <div className="py-12 text-center text-brand-charcoal/40">
              <span className="text-2xl">🎉</span>
              <p className="text-[10px] uppercase tracking-widest font-semibold mt-2">All Products In Stock</p>
              <p className="text-[8px] mt-0.5">No stockouts currently logged.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-red-500 font-semibold mb-2">
                ⚠️ Out of Stock ({products.filter(p => !p.in_stock).length} Items):
              </p>
              <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                {products
                  .filter(p => !p.in_stock)
                  .map((product) => (
                    <div key={product.id} className="flex justify-between items-center text-xs border-b border-brand-charcoal/5 pb-2">
                      <span className="font-medium text-brand-charcoal uppercase truncate pr-4">
                        {product.title}
                      </span>
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="text-[9px] uppercase tracking-widest text-brand-gold hover:text-brand-charcoal font-semibold flex-shrink-0"
                      >
                        Restock
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
