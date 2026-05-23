'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>) => Promise<Product | null>;
  isEditing?: boolean;
}

const COMMON_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '52', '54', '56', '58'];
const COMMON_COLORS = [
  'Off-White', 'Charcoal Black', 'Sand Beige', 'Natural Oat', 
  'Muted Olive', 'Sage Green', 'Warm Sand', 'Onyx Black', 'Ivory White'
];

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [fullDescription, setFullDescription] = useState(initialData?.full_description || '');
  const [price, setPrice] = useState<number | string>(initialData?.price || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'LKR');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ''));
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [inStock, setInStock] = useState(initialData?.in_stock !== false);
  const [styleLabel, setStyleLabel] = useState(initialData?.style_label || '');
  
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
  const [customSize, setCustomSize] = useState('');
  
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);
  const [customColor, setCustomColor] = useState('');
  
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [fitNotes, setFitNotes] = useState(initialData?.fit_notes || '');
  const [fabric, setFabric] = useState(initialData?.fabric || '');
  const [care, setCare] = useState(initialData?.care || '');
  const [deliveryInfo, setDeliveryInfo] = useState(initialData?.delivery_info || 'Delivered within 2-5 days');

  // Auto-generate slug from title (only if not editing, or if slug is empty)
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  // Size list operations
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSize.trim() && !selectedSizes.includes(customSize.trim())) {
      setSelectedSizes(prev => [...prev, customSize.trim()]);
      setCustomSize('');
    }
  };

  // Color list operations
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const addCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (customColor.trim() && !selectedColors.includes(customColor.trim())) {
      setSelectedColors(prev => [...prev, customColor.trim()]);
      setCustomColor('');
    }
  };

  // Image URL operations
  const addImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  // Handle local image file uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    const file = files[0];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isConfigured = 
      supabaseUrl && 
      supabaseUrl !== 'https://your-project-id.supabase.co';

    if (isConfigured) {
      try {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Attempt upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        setImageUrls(prev => [...prev, publicUrl]);
      } catch (err: any) {
        console.error('File upload failed, using base64 fallback:', err);
        // Fallback to base64 reader if storage fails
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageUrls(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setLoading(false);
      }
    } else {
      // Mock mode file upload fallback to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrls(prev => [...prev, reader.result as string]);
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (imageUrls.length === 0) {
      setError('Please add at least one product image URL or upload an image.');
      setLoading(false);
      return;
    }

    if (selectedSizes.length === 0) {
      setError('Please select or add at least one size.');
      setLoading(false);
      return;
    }

    const priceNum = parseInt(price.toString(), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        slug,
        description,
        full_description: fullDescription || undefined,
        price: priceNum,
        currency,
        category_id: categoryId,
        sizes: selectedSizes,
        colors: selectedColors,
        images: imageUrls,
        featured,
        in_stock: inStock,
        fit_notes: fitNotes || undefined,
        fabric: fabric || undefined,
        care: care || undefined,
        delivery_info: deliveryInfo || 'Delivered within 2-5 days',
        style_label: styleLabel || undefined,
        sort_order: initialData?.sort_order || 0
      };

      const result = await onSubmit(payload);
      if (result) {
        router.refresh();
        router.push('/admin/products');
      } else {
        throw new Error('An error occurred during submission.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in pb-16">
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-xs text-red-700 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid: Details (Left) + Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Product Data */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Core Details */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Core Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Premium Flax Linen Kurta"
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Slug (URL Path) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="e.g. premium-flax-linen-kurta"
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Style Label */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Style Label / Collection
                </label>
                <input
                  type="text"
                  value={styleLabel}
                  onChange={(e) => setStyleLabel(e.target.value)}
                  placeholder="e.g. Oversized Basics"
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Short Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  placeholder="Summarize the product in 1-2 sentences..."
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors resize-none"
                />
              </div>

              {/* Full Description */}
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Full Details & Description
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  rows={5}
                  placeholder="Detailed background story, fabric drape, and design details..."
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Fabric & Care Accordions */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fit Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Fit Notes
                </label>
                <textarea
                  value={fitNotes}
                  onChange={(e) => setFitNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Generously cut. Take your normal size."
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Fabric Details */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Fabric Composition
                </label>
                <textarea
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  rows={3}
                  placeholder="e.g. 100% Organic Linen Flax"
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Care Instructions
                </label>
                <textarea
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  rows={3}
                  placeholder="e.g. Hand wash cold, dry flat in shade."
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>

              {/* Delivery Info */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Delivery Info
                </label>
                <textarea
                  value={deliveryInfo}
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                  rows={3}
                  placeholder="e.g. Delivered within 2-5 days island-wide"
                  className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Images Visuals */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Media & Images *
            </h2>

            {/* Thumbnail Preview Area */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-cream/50 border border-brand-charcoal/5">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="aspect-[3/4] relative bg-brand-cream group border border-brand-charcoal/10">
                    <img src={url} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 text-white hover:bg-black transition-colors rounded-none text-[9px] uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-brand-charcoal text-brand-cream text-[8px] uppercase tracking-widest px-1.5 py-0.5 font-medium">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* File Upload Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                  Upload Image File (Storage or sandbox)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="w-full text-xs text-brand-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-brand-charcoal file:text-xs file:font-semibold file:uppercase file:tracking-widest file:bg-transparent file:text-brand-charcoal file:hover:bg-brand-charcoal file:hover:text-brand-cream file:transition-colors file:cursor-pointer"
                />
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste external Unsplash image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addImageUrl}
                >
                  Add URL
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Attributes */}
        <div className="space-y-8">
          
          {/* Card 4: Inventory & Category */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Status & Pricing
            </h2>

            {/* Price */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                Price *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-xs text-brand-charcoal/40 font-semibold">
                  {currency}
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="4500"
                  className="w-full pl-14 pr-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                Product Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 transition-colors uppercase tracking-wider font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 accent-brand-charcoal rounded-none cursor-pointer"
                />
                <span className="text-xs uppercase tracking-widest text-brand-charcoal font-semibold">
                  In Stock Availability
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-brand-charcoal rounded-none cursor-pointer"
                />
                <span className="text-xs uppercase tracking-widest text-brand-charcoal font-semibold">
                  Feature on Homepage
                </span>
              </label>
            </div>
          </div>

          {/* Card 5: Size Selection */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Sizing Attributes *
            </h2>

            {/* Common Size Toggles */}
            <div>
              <p className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-3 font-semibold">
                Quick Toggle Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 text-[10px] font-semibold border transition-all duration-300 rounded-none cursor-pointer ${
                        isSelected
                          ? 'bg-brand-charcoal border-brand-charcoal text-brand-cream'
                          : 'bg-transparent border-brand-charcoal/10 text-brand-charcoal hover:border-brand-gold'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Sizing Add */}
            <div className="pt-2 border-t border-brand-charcoal/5">
              <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                Add Custom Size
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. One Size, L-XL..."
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="flex-1 px-3 py-2 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="px-4 py-2 border border-brand-charcoal bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 text-[10px] uppercase tracking-widest font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Rendered Selected Sizes */}
            {selectedSizes.length > 0 && (
              <div className="pt-2">
                <p className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 mb-1 font-semibold">Selected:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSizes.map(size => (
                    <span 
                      key={size}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-cream text-[9px] uppercase tracking-widest border border-brand-charcoal/10 font-semibold"
                    >
                      {size}
                      <button 
                        type="button" 
                        onClick={() => toggleSize(size)} 
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 6: Color Selection */}
          <div className="bg-white border border-brand-charcoal/10 p-6 md:p-8 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal border-b border-brand-charcoal/5 pb-3">
              Color Attributes
            </h2>

            {/* Common Color Toggles */}
            <div>
              <p className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-3 font-semibold">
                Quick Toggle Colors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_COLORS.map(color => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`px-2.5 py-1.5 text-[9px] uppercase tracking-widest font-semibold border transition-all duration-300 rounded-none cursor-pointer ${
                        isSelected
                          ? 'bg-brand-charcoal border-brand-charcoal text-brand-cream'
                          : 'bg-transparent border-brand-charcoal/10 text-brand-charcoal hover:border-brand-gold'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Add */}
            <div className="pt-2 border-t border-brand-charcoal/5">
              <label className="block text-[10px] uppercase tracking-widest text-brand-charcoal/60 mb-2 font-semibold">
                Add Custom Color
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Muted Gold, Olive Drab..."
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal text-xs rounded-none"
                />
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="px-4 py-2 border border-brand-charcoal bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 text-[10px] uppercase tracking-widest font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Rendered Selected Colors */}
            {selectedColors.length > 0 && (
              <div className="pt-2">
                <p className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 mb-1 font-semibold">Selected:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedColors.map(color => (
                    <span 
                      key={color}
                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-cream text-[9px] uppercase tracking-widest border border-brand-charcoal/10 font-semibold"
                    >
                      {color}
                      <button 
                        type="button" 
                        onClick={() => toggleColor(color)} 
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={loading}
              onClick={() => router.push('/admin/products')}
              className="py-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-4"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Publish Product'}
            </Button>
          </div>

        </div>

      </div>
    </form>
  );
}
