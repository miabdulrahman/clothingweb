import React from 'react';
import { getCategories, createProduct } from '@/lib/services';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="border-b border-brand-charcoal/5 pb-6">
        <h1 className="font-display text-3xl font-light tracking-wider text-brand-charcoal uppercase">
          New Product
        </h1>
        <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">
          Create and publish a new item to the shop catalog
        </p>
      </div>

      <ProductForm 
        categories={categories} 
        onSubmit={async (data) => {
          'use server';
          return createProduct(data);
        }} 
      />
    </div>
  );
}
