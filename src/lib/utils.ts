// ============================================
// Utility functions
// ============================================

/**
 * Format price in LKR with thousands separator
 */
export function formatPrice(price: number, currency: string = 'LKR'): string {
  return `${currency} ${price.toLocaleString('en-LK')}`;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Generate a placeholder image URL (for dev/demo)
 */
export function placeholderImage(width: number, height: number, text?: string): string {
  const label = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://placehold.co/${width}x${height}/2D2D2D/FAF9F6?font=inter${label}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * cn — merge class names (simple utility, no external dep needed)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Delay utility for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
