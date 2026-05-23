// ============================================
// WhatsApp Integration Utilities
// ============================================

import { Product, OrderOptions, CartItem } from '@/types';

// Placeholder WhatsApp number — update in .env.local
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94700000000';

/**
 * Build a WhatsApp deep link with a pre-filled order message
 */
export function buildWhatsAppOrderUrl(
  product: Product,
  options: OrderOptions
): string {
  const message = [
    `Hi, I want to order:`,
    ``,
    `Product: ${product.title}`,
    `Size: ${options.size}`,
    `Color: ${options.color}`,
    `Quantity: ${options.quantity}`,
    ``,
    `Please confirm availability and delivery details.`,
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a general WhatsApp inquiry link
 */
export function buildWhatsAppInquiryUrl(subject?: string): string {
  const message = subject
    ? `Hi, I have a question about: ${subject}`
    : `Hi, I'd like to know more about your products.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a WhatsApp link for a specific product inquiry
 */
export function buildWhatsAppProductUrl(product: Product): string {
  const message = [
    `Hi, I'm interested in:`,
    `${product.title}`,
    ``,
    `Could you share more details?`,
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Get the raw WhatsApp number for display
 */
export function getWhatsAppDisplayNumber(): string {
  const num = WHATSAPP_NUMBER;
  // Format: +94 70 000 0000
  if (num.startsWith('94') && num.length === 11) {
    return `+${num.slice(0, 2)} ${num.slice(2, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
  }
  return `+${num}`;
}

/**
 * Build a WhatsApp deep link for checking out multiple cart items
 */
export function buildWhatsAppCartOrderUrl(cartItems: CartItem[]): string {
  const itemsText = cartItems
    .map(
      (item) =>
        `- ${item.quantity}x ${item.title} (Size: ${item.selectedSize}, Color: ${item.selectedColor}) — ${item.currency} ${(item.price * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const totalSum = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currency = cartItems[0]?.currency || 'LKR';

  const message = [
    `Hi Auren, I would like to place an order for the following items:`,
    ``,
    itemsText,
    ``,
    `Total Value: ${currency} ${totalSum.toLocaleString()}`,
    ``,
    `Please confirm item availability and delivery details.`,
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
