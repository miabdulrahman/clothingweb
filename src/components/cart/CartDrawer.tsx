'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { buildWhatsAppCartOrderUrl } from '@/lib/whatsapp';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();
  const pathname = usePathname();

  // Close cart when route changes
  useEffect(() => {
    setCartOpen(false);
  }, [pathname, setCartOpen]);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const checkoutUrl = buildWhatsAppCartOrderUrl(cart);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-brand-charcoal/45 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-55 w-full sm:w-[450px] bg-brand-cream shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-brand-charcoal/10 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-brand-charcoal">
                  Your Cart
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold mt-0.5">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 -mr-2 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors focus:outline-none cursor-pointer"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-16 h-16 rounded-full bg-brand-charcoal/5 flex items-center justify-center text-brand-charcoal/45">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-brand-charcoal">
                      Your Cart is Empty
                    </h3>
                    <p className="text-xs text-brand-charcoal/50 font-light max-w-[280px] mx-auto leading-relaxed">
                      Add handcrafted modest silhouettes to your collection.
                    </p>
                  </div>
                  <Link
                    href="/catalog"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-brand-charcoal text-xs font-semibold uppercase tracking-widest hover:bg-brand-charcoal hover:text-brand-cream transition-colors duration-300"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-brand-charcoal/5 items-start justify-between"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 aspect-[3/4] bg-brand-charcoal/5 overflow-hidden flex-shrink-0 border border-brand-charcoal/5">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-charcoal/30">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Item Information */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="space-y-0.5">
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>

                      {/* Selected Attributes */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-light text-brand-charcoal/60 uppercase">
                        <span>Size: <strong className="font-semibold text-brand-charcoal">{item.selectedSize}</strong></span>
                        <span>|</span>
                        <span>Color: <strong className="font-semibold text-brand-charcoal">{item.selectedColor}</strong></span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-brand-charcoal/15 bg-white select-none">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-medium text-brand-charcoal min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between h-full py-1 self-stretch">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-charcoal/40 hover:text-red-500 transition-colors p-1 -mr-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <span className="text-xs font-semibold text-brand-charcoal tracking-wide mt-auto">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-brand-charcoal/10 bg-white space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/75">
                      Subtotal
                    </span>
                    <span className="text-lg font-bold tracking-wider text-brand-charcoal">
                      {formatPrice(cartTotal, cart[0]?.currency)}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-charcoal/50 leading-relaxed font-light">
                    Tax and shipping rates will be manually calculated and confirmed over WhatsApp based on your delivery address.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center py-4 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors rounded-none font-semibold uppercase tracking-widest text-xs shadow-md"
                  >
                    <svg className="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.497 1.45 5.416 1.451 5.458 0 9.897-4.437 9.902-9.899.002-2.646-1.02-5.133-2.88-6.996C17.228 1.856 14.743.834 12.09.833 6.63.833 2.19 5.27 2.185 10.733c-.001 1.927.501 3.811 1.457 5.418L2.73 22.179l6.082-1.593c1.558.85 3.325 1.298 5.12 1.299h.005zm10.72-7.516c-.292-.146-1.728-.853-1.996-.952-.266-.098-.46-.147-.654.146-.195.293-.755.952-.924 1.147-.17.195-.339.219-.63.073-.292-.147-1.233-.454-2.35-1.45-1.01-.898-1.532-1.109-1.824-1.255-.292-.147-.46-.073-.606.073-.146.147-.631.733-.797.92-.167.188-.334.219-.626.072-.29-.145-1.23-.453-2.345-1.448-.868-.774-1.455-1.73-1.625-2.022-.17-.293-.018-.452.129-.597.13-.13.292-.341.437-.512.146-.17.195-.293.293-.488.098-.195.048-.366-.024-.513-.073-.146-.654-1.579-.896-2.164-.236-.569-.475-.491-.654-.5l-.56-.008c-.193 0-.507.073-.773.366-.266.292-1.015.992-1.015 2.42 0 1.427 1.039 2.808 1.185 3.003.146.195 2.045 3.123 4.954 4.38.692.3 1.233.479 1.654.613.696.222 1.33.191 1.83.116.559-.083 1.729-.707 1.972-1.39.244-.683.244-1.268.17-1.39-.073-.122-.268-.195-.56-.341z" />
                    </svg>
                    <span>Send Order to WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center py-2 text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50 hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
