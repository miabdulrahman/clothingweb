import React from 'react';
import { getProducts, getCategories } from '@/lib/services';
import ProductsListContent from './ProductsListContent';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ sort: 'newest' }),
    getCategories(),
  ]);

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-light tracking-wider text-brand-charcoal uppercase">
          Product Catalog
        </h1>
        <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">
          Manage product details, stock availability, and featured status
        </p>
      </div>

      <ProductsListContent initialProducts={products} categories={categories} />
    </div>
  );
}
