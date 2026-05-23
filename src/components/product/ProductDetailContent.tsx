'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { buildWhatsAppCartOrderUrl } from '@/lib/whatsapp';
import { SizeSelector, ColorSelector, QuantitySelector } from '@/components/product/Selectors';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import { SlideUp, StaggerContainer, StaggerChild } from '@/components/motion/Transitions';
import { logAnalyticsEventAction as logAnalyticsEvent } from '@/lib/actions';

interface ProductDetailContentProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // Initialize selections with first available options
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }

    // Log product view event
    logAnalyticsEvent('product_view', {
      product_id: product.id,
      product_title: product.title,
      product_price: product.price,
    });
  }, [product]);

  // Track select events
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    logAnalyticsEvent('size_select', { product_id: product.id, size });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    logAnalyticsEvent('color_select', { product_id: product.id, color });
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => setIsAdding(false), 1000);

    logAnalyticsEvent('whatsapp_click', {
      product_id: product.id,
      product_title: product.title,
      size: selectedSize,
      color: selectedColor,
      quantity,
      action_type: 'add_to_cart'
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor, quantity);

    const singleItemCart = [{
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency || 'LKR',
      selectedSize,
      selectedColor,
      quantity,
      image: product.images[0] || ''
    }];
    const directUrl = buildWhatsAppCartOrderUrl(singleItemCart);
    window.open(directUrl, '_blank');

    logAnalyticsEvent('whatsapp_click', {
      product_id: product.id,
      product_title: product.title,
      size: selectedSize,
      color: selectedColor,
      quantity,
      action_type: 'buy_now'
    });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const formattedPrice = formatPrice(product.price, product.currency);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images} />
        </div>

        {/* Right: Info */}
        <div className="space-y-6 md:sticky md:top-32">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
            <Link href="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-brand-charcoal transition-colors">Catalog</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-brand-charcoal transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
          </div>

          {/* Title and Style Label */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-brand-charcoal leading-snug">
                {product.title}
              </h1>
              {product.style_label && (
                <Badge variant="secondary" className="flex-shrink-0">
                  {product.style_label}
                </Badge>
              )}
            </div>
            <p className="text-xl font-bold tracking-wider text-brand-charcoal">
              {formattedPrice}
            </p>
          </div>

          <hr className="border-brand-charcoal/10" />

          {/* Description */}
          <p className="text-sm font-light text-brand-charcoal/70 leading-relaxed">
            {product.description}
          </p>

          {/* Options Selectors */}
          {product.in_stock ? (
            <div className="space-y-6 pt-2">
              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <ColorSelector
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onChange={handleColorChange}
                />
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onChange={handleSizeChange}
                  onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
                />
              )}

              {/* Quantity */}
              <QuantitySelector value={quantity} onChange={setQuantity} />

              {/* Order Button & Delivery Note */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full inline-flex items-center justify-center py-4 bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 transition-colors rounded-none font-semibold uppercase tracking-widest text-xs shadow-sm cursor-pointer disabled:opacity-85"
                  >
                    {isAdding ? 'Added to Bag' : 'Add to Bag'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full inline-flex items-center justify-center py-4 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors rounded-none font-semibold uppercase tracking-widest text-xs shadow-md cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.497 1.45 5.416 1.451 5.458 0 9.897-4.437 9.902-9.899.002-2.646-1.02-5.133-2.88-6.996C17.228 1.856 14.743.834 12.09.833 6.63.833 2.19 5.27 2.185 10.733c-.001 1.927.501 3.811 1.457 5.418L2.73 22.179l6.082-1.593c1.558.85 3.325 1.298 5.12 1.299h.005zm10.72-7.516c-.292-.146-1.728-.853-1.996-.952-.266-.098-.46-.147-.654.146-.195.293-.755.952-.924 1.147-.17.195-.339.219-.63.073-.292-.147-1.233-.454-2.35-1.45-1.01-.898-1.532-1.109-1.824-1.255-.292-.147-.46-.073-.606.073-.146.147-.631.733-.797.92-.167.188-.334.219-.626.072-.29-.145-1.23-.453-2.345-1.448-.868-.774-1.455-1.73-1.625-2.022-.17-.293-.018-.452.129-.597.13-.13.292-.341.437-.512.146-.17.195-.293.293-.488.098-.195.048-.366-.024-.513-.073-.146-.654-1.579-.896-2.164-.236-.569-.475-.491-.654-.5l-.56-.008c-.193 0-.507.073-.773.366-.266.292-1.015.992-1.015 2.42 0 1.427 1.039 2.808 1.185 3.003.146.195 2.045 3.123 4.954 4.38.692.3 1.233.479 1.654.613.696.222 1.33.191 1.83.116.559-.083 1.729-.707 1.972-1.39.244-.683.244-1.268.17-1.39-.073-.122-.268-.195-.56-.341z" />
                    </svg>
                    <span>WhatsApp Buy</span>
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-brand-charcoal/50 uppercase tracking-wider">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{product.delivery_info}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <Button disabled fullWidth className="py-4">
                Sold Out
              </Button>
              <p className="text-xs text-brand-charcoal/50 italic text-center font-light">
                This item is currently out of stock. Contact us on WhatsApp to inquire about restock times.
              </p>
            </div>
          )}

          <hr className="border-brand-charcoal/10" />

          {/* Product Details Accordion */}
          <div className="space-y-2 select-none">
            {/* Details Section */}
            <div className="border-b border-brand-charcoal/10 pb-2">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex items-center justify-between text-left py-2 font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal focus:outline-none"
              >
                <span>Product details</span>
                <span className="text-base">{activeAccordion === 'details' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'details' && (
                <div className="pt-2 pb-4 text-xs font-light text-brand-charcoal/70 space-y-2 leading-relaxed">
                  <p>{product.full_description || product.description}</p>
                  {product.fabric && (
                    <p>
                      <span className="font-semibold text-brand-charcoal">Fabric:</span> {product.fabric}
                    </p>
                  )}
                  {product.care && (
                    <p>
                      <span className="font-semibold text-brand-charcoal">Care:</span> {product.care}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Fit Notes Section */}
            {product.fit_notes && (
              <div className="border-b border-brand-charcoal/10 pb-2">
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between text-left py-2 font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal focus:outline-none"
                >
                  <span>Size & fit notes</span>
                  <span className="text-base">{activeAccordion === 'fit' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'fit' && (
                  <div className="pt-2 pb-4 text-xs font-light text-brand-charcoal/70 leading-relaxed">
                    <p>{product.fit_notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Section */}
            <div className="border-b border-brand-charcoal/10 pb-2">
              <button
                onClick={() => toggleAccordion('delivery')}
                className="w-full flex items-center justify-between text-left py-2 font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal focus:outline-none"
              >
                <span>Delivery & exchanges</span>
                <span className="text-base">{activeAccordion === 'delivery' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'delivery' && (
                <div className="pt-2 pb-4 text-xs font-light text-brand-charcoal/70 space-y-2 leading-relaxed">
                  <p>Standard Delivery: 2-5 business days islandwide in Sri Lanka.</p>
                  <p>Exchange Policy: We offer size exchanges within 7 days of delivery, provided tags are attached and the garment is in original condition.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-brand-charcoal/10">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-gold">Complete the look</p>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-brand-charcoal">
              Related Pieces
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom CTA (Mobile Only) */}
      {product.in_stock && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-brand-cream border-t border-brand-charcoal/10 p-3 flex items-center justify-between gap-4 md:hidden shadow-lg select-none">
          <div className="flex-shrink-0">
            <p className="text-[9px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">Price</p>
            <p className="text-sm font-bold tracking-wider text-brand-charcoal leading-none">{formattedPrice}</p>
          </div>
          <div className="flex-grow grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="inline-flex items-center justify-center py-3 bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 transition-colors rounded-none font-semibold uppercase tracking-widest text-[10px] cursor-pointer disabled:opacity-80"
            >
              {isAdding ? 'Added' : 'Add Bag'}
            </button>
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center py-3 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors rounded-none font-semibold uppercase tracking-widest text-[10px] cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <Modal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} title="Size Guide">
        <div className="space-y-6">
          <p className="text-xs font-light text-brand-charcoal/70 leading-relaxed">
            Our items are custom engineered for a loose, relaxed fit. Choose your standard size for an oversized look, or size down for a more structured fit.
          </p>
          <div className="overflow-x-auto border border-brand-charcoal/10">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-brand-charcoal/5 border-b border-brand-charcoal/10">
                  <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Size</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Chest (in)</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Length (in)</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-[10px]">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal/10 font-light">
                <tr>
                  <td className="p-3 font-medium">S</td>
                  <td className="p-3">42</td>
                  <td className="p-3">28</td>
                  <td className="p-3">18.5</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">M</td>
                  <td className="p-3">44</td>
                  <td className="p-3">29</td>
                  <td className="p-3">19</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">L</td>
                  <td className="p-3">46</td>
                  <td className="p-3">30</td>
                  <td className="p-3">19.5</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">XL</td>
                  <td className="p-3">48</td>
                  <td className="p-3">31</td>
                  <td className="p-3">20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t border-brand-charcoal/10 pt-4 flex justify-between items-center text-[10px] uppercase font-semibold text-brand-charcoal/50 tracking-wider">
            <span>Kurta/Duster lengths: 40 - 58 inches long</span>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="text-brand-gold underline hover:text-brand-charcoal transition-colors cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
