import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getCategories, updateProduct } from '@/lib/services';
import ProductForm from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  // Bind the product ID to the update action
  const handleUpdate = async (data: Omit<any, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    'use server';
    return updateProduct(id, data);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="border-b border-brand-charcoal/5 pb-6">
        <h1 className="font-display text-3xl font-light tracking-wider text-brand-charcoal uppercase">
          Edit Product
        </h1>
        <p className="text-xs text-brand-charcoal/50 mt-1 uppercase tracking-wider">
          Modify details, pricing, and stock of "{product.title}"
        </p>
      </div>

      <ProductForm
        initialData={product}
        categories={categories}
        onSubmit={handleUpdate}
        isEditing={true}
      />
    </div>
  );
}
