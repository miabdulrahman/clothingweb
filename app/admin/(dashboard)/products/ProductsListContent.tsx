'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { updateProductAction as updateProduct, deleteProductAction as deleteProduct } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ProductsListContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsListContent({
  initialProducts,
  categories,
}: ProductsListContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.style_label && product.style_label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory =
      selectedCategory === 'all' || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle Stock status
  const handleToggleStock = async (product: Product) => {
    const updatedStatus = !product.in_stock;
    
    // Optimistic UI update
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, in_stock: updatedStatus } : p))
    );

    try {
      const res = await updateProduct(product.id, { in_stock: updatedStatus });
      if (res) {
        showToast(`"${product.title}" is now ${updatedStatus ? 'in stock' : 'out of stock'}`);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      // Revert optimistic update
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, in_stock: !updatedStatus } : p))
      );
      showToast('Failed to update product stock', 'error');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (product: Product) => {
    const updatedStatus = !product.featured;
    
    // Optimistic UI update
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? { ...p, featured: updatedStatus } : p))
    );

    try {
      const res = await updateProduct(product.id, { featured: updatedStatus });
      if (res) {
        showToast(`"${product.title}" featured status ${updatedStatus ? 'enabled' : 'disabled'}`);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      // Revert optimistic update
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, featured: !updatedStatus } : p))
      );
      showToast('Failed to update product featured status', 'error');
    }
  };

  // Confirm delete handler
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    const { id, title } = productToDelete;

    // Close modal immediately
    setProductToDelete(null);

    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast(`"${title}" deleted successfully`);
      } else {
        throw new Error('Deletion failed');
      }
    } catch (err) {
      showToast(`Failed to delete "${title}"`, 'error');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <div 
          className={`fixed top-6 right-6 z-50 px-6 py-4 border shadow-xl transition-all duration-300 animate-fade-in ${
            toast.type === 'success' 
              ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal dark:bg-brand-gold dark:text-brand-charcoal dark:border-brand-gold' 
              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/45 dark:text-red-400 dark:border-red-900/50'
          }`}
        >
          <p className="text-xs uppercase tracking-widest font-semibold">
            {toast.type === 'success' ? '✓ ' : '✗ '} {toast.message}
          </p>
        </div>
      )}

      {/* Control Bar (Filters + Add button) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white border border-brand-charcoal/10 p-5 dark:bg-[#121212] dark:border-white/10">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-charcoal/40 dark:text-white/40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search products by title, style label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors placeholder:text-brand-charcoal/40 dark:bg-[#1A1A1A] dark:border-white/10 dark:text-brand-cream dark:placeholder:text-white/40"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors uppercase tracking-wider font-semibold dark:bg-[#1A1A1A] dark:border-white/10 dark:text-brand-cream"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Link href="/admin/products/new" className="self-end md:self-center">
          <Button variant="primary" size="md">
            + New Product
          </Button>
        </Link>
      </div>

      {/* Products Table Wrapper */}
      <div className="bg-white border border-brand-charcoal/10 overflow-hidden dark:bg-[#121212] dark:border-white/10">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-brand-charcoal/50 dark:text-white/50">
            <svg className="w-12 h-12 mx-auto mb-4 text-brand-charcoal/20 dark:text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xs uppercase tracking-widest font-semibold">No products found</p>
            <p className="text-[10px] mt-1">Try modifying your search query or filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-brand-charcoal/10 bg-brand-cream text-[10px] uppercase tracking-widest text-brand-charcoal/60 font-semibold dark:border-white/10 dark:bg-[#1A1A1A] dark:text-white/60">
                    <th className="py-4 px-6 font-semibold">Product</th>
                    <th className="py-4 px-4 font-semibold">Category</th>
                    <th className="py-4 px-4 font-semibold">Price</th>
                    <th className="py-4 px-4 font-semibold text-center">Featured</th>
                    <th className="py-4 px-4 font-semibold text-center">In Stock</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-charcoal/5 dark:divide-white/5 text-xs">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-brand-cream/20 dark:hover:bg-white/5 transition-colors">
                      {/* Item details */}
                      <td className="py-4 px-6 flex items-center gap-4 min-w-[280px]">
                        <div className="w-12 h-16 bg-brand-cream relative flex-shrink-0 border border-brand-charcoal/5 dark:bg-[#1A1A1A] dark:border-white/5">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized={product.images[0].startsWith('http')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-charcoal/30 dark:text-white/30">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-brand-charcoal uppercase tracking-wider block truncate dark:text-brand-cream">
                            {product.title}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] text-brand-charcoal/50 uppercase tracking-widest font-medium dark:text-white/40">
                            {product.style_label && (
                              <span className="text-brand-gold font-semibold">{product.style_label}</span>
                            )}
                            <span>•</span>
                            <span>{product.sizes.length} sizes</span>
                            <span>•</span>
                            <span>{product.colors.length} colors</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 align-middle text-brand-charcoal/80 uppercase tracking-wider text-[10px] font-semibold dark:text-brand-cream/80">
                        {product.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 align-middle font-medium text-brand-charcoal/80 dark:text-brand-cream/80">
                        {formatPrice(product.price, product.currency)}
                      </td>

                      {/* Featured toggle */}
                      <td className="py-4 px-4 align-middle text-center">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`inline-flex items-center justify-center p-1 border rounded-none cursor-pointer transition-colors duration-300 ${
                            product.featured
                              ? 'bg-brand-gold text-brand-cream border-brand-gold dark:text-brand-charcoal'
                              : 'bg-transparent text-brand-charcoal/30 border-brand-charcoal/10 hover:border-brand-gold dark:text-white/30 dark:border-white/10 dark:hover:border-brand-gold'
                          }`}
                          aria-label="Toggle featured"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </td>

                      {/* In Stock toggle */}
                      <td className="py-4 px-4 align-middle text-center">
                        <button
                          onClick={() => handleToggleStock(product)}
                          className={`inline-flex px-2.5 py-1 text-[9px] uppercase tracking-widest font-semibold cursor-pointer border transition-colors duration-300 ${
                            product.in_stock
                              ? 'bg-[#25D366]/10 text-[#20ba5a] border-[#25D366]/20 hover:bg-[#25D366]/20 dark:bg-[#25D366]/5 dark:text-[#25D366] dark:border-[#25D366]/10 dark:hover:bg-[#25D366]/15'
                              : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-950/30'
                          }`}
                        >
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 align-middle text-right space-x-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-[10px] uppercase tracking-widest text-brand-gold hover:text-brand-charcoal dark:hover:text-brand-cream transition-colors font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-brand-charcoal/10 dark:divide-white/10">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 space-y-4 hover:bg-brand-cream/10 dark:hover:bg-white/5 transition-colors">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-14 h-20 bg-brand-cream relative flex-shrink-0 border border-brand-charcoal/5 dark:bg-[#1A1A1A] dark:border-white/5">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized={product.images[0].startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-brand-charcoal/30 dark:text-white/30">
                          N/A
                        </div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="font-semibold text-brand-charcoal uppercase tracking-wider text-xs block truncate dark:text-brand-cream">
                        {product.title}
                      </span>
                      <p className="text-[10px] text-brand-charcoal/80 font-medium uppercase tracking-wider dark:text-brand-cream/80">
                        {product.category?.name || 'Unassigned'}
                      </p>
                      <p className="text-xs font-bold text-brand-charcoal/90 dark:text-brand-cream/90">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Attributes details */}
                  <div className="flex flex-wrap gap-2 text-[9px] text-brand-charcoal/50 uppercase tracking-widest font-semibold dark:text-white/40">
                    {product.style_label && (
                      <span className="text-brand-gold">{product.style_label}</span>
                    )}
                    <span>•</span>
                    <span>{product.sizes.length} sizes</span>
                    <span>•</span>
                    <span>{product.colors.length} colors</span>
                  </div>

                  {/* Quick Toggles & Actions */}
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-brand-charcoal/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      {/* Featured button */}
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 text-[9px] uppercase tracking-widest font-semibold border transition-all duration-300 ${
                          product.featured
                            ? 'bg-brand-gold text-brand-cream border-brand-gold dark:text-brand-charcoal'
                            : 'bg-transparent text-brand-charcoal/40 border-brand-charcoal/10 hover:border-brand-gold dark:text-white/40 dark:border-white/10 dark:hover:border-brand-gold'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {product.featured ? 'Featured' : 'Feature'}
                      </button>

                      {/* Stock button */}
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`inline-flex px-2.5 py-1 text-[9px] uppercase tracking-widest font-semibold border transition-colors duration-300 ${
                          product.in_stock
                            ? 'bg-[#25D366]/10 text-[#20ba5a] border-[#25D366]/20 dark:bg-[#25D366]/5 dark:text-[#25D366] dark:border-[#25D366]/10'
                            : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>

                    {/* Action links */}
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-[10px] uppercase tracking-widest text-brand-gold hover:text-brand-charcoal dark:hover:text-brand-cream transition-colors font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setProductToDelete(null)}
          title="Delete Product"
        >
          <div className="space-y-6">
            <p className="text-xs text-brand-charcoal/80 leading-relaxed dark:text-brand-cream/80">
              Are you sure you want to delete <span className="font-semibold text-brand-charcoal dark:text-brand-cream">"{productToDelete.title}"</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end pt-4 border-t border-brand-charcoal/5 dark:border-white/5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                onClick={handleDeleteConfirm}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
