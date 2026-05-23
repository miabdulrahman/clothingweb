'use server';

import { createProduct, updateProduct, deleteProduct, logAnalyticsEvent } from './services';
import { Product } from '@/types';

export async function createProductAction(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>
) {
  return createProduct(productData);
}

export async function updateProductAction(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>
) {
  return updateProduct(id, productData);
}

export async function deleteProductAction(id: string) {
  return deleteProduct(id);
}

export async function logAnalyticsEventAction(
  eventType: string,
  eventData: Record<string, unknown> = {},
  pagePath?: string
) {
  return logAnalyticsEvent(eventType, eventData, pagePath);
}
