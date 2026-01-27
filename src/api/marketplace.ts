import { api } from './client';
import {
  MarketplaceProduct,
  CreateMarketplaceProductRequest,
  UpdateMarketplaceProductRequest,
  PaginatedResponse,
} from './types';

export const marketplaceService = {
  // Query endpoints (read operations)
  async getProducts(page = 1, limit = 20): Promise<PaginatedResponse<MarketplaceProduct>> {
    return api.get<PaginatedResponse<MarketplaceProduct>>(`/queries/marketplace/products?page=${page}&limit=${limit}`);
  },

  async getProductById(id: string): Promise<MarketplaceProduct> {
    return api.get<MarketplaceProduct>(`/queries/marketplace/products/${id}`);
  },

  async getActiveProducts(page = 1, limit = 20): Promise<PaginatedResponse<MarketplaceProduct>> {
    return api.get<PaginatedResponse<MarketplaceProduct>>(
      `/queries/marketplace/products/active?page=${page}&limit=${limit}`
    );
  },

  async getMyProducts(page = 1, limit = 20): Promise<PaginatedResponse<MarketplaceProduct>> {
    return api.get<PaginatedResponse<MarketplaceProduct>>(
      `/queries/marketplace/products/my?page=${page}&limit=${limit}`
    );
  },

  async searchProducts(query: string, page = 1, limit = 20): Promise<PaginatedResponse<MarketplaceProduct>> {
    return api.get<PaginatedResponse<MarketplaceProduct>>(
      `/queries/marketplace/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
  },

  async getProductsByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<MarketplaceProduct>> {
    return api.get<PaginatedResponse<MarketplaceProduct>>(
      `/queries/marketplace/products/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`
    );
  },

  async getCategories(): Promise<string[]> {
    return api.get<string[]>('/queries/marketplace/categories');
  },

  async getFeaturedProducts(limit = 10): Promise<MarketplaceProduct[]> {
    return api.get<MarketplaceProduct[]>(`/queries/marketplace/products/featured?limit=${limit}`);
  },

  // Command endpoints (write operations)
  async createProduct(data: CreateMarketplaceProductRequest): Promise<MarketplaceProduct> {
    return api.post<MarketplaceProduct>('/commands/sync/marketplace/products', data);
  },

  async updateProduct(id: string, data: UpdateMarketplaceProductRequest): Promise<MarketplaceProduct> {
    return api.put<MarketplaceProduct>(`/commands/sync/marketplace/products/${id}`, data);
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/commands/sync/marketplace/products/${id}`);
  },

  async publishProduct(id: string): Promise<MarketplaceProduct> {
    return api.post<MarketplaceProduct>(`/commands/sync/marketplace/products/${id}/publish`);
  },

  async archiveProduct(id: string): Promise<MarketplaceProduct> {
    return api.post<MarketplaceProduct>(`/commands/sync/marketplace/products/${id}/archive`);
  },

  async markAsSold(id: string): Promise<MarketplaceProduct> {
    return api.post<MarketplaceProduct>(`/commands/sync/marketplace/products/${id}/sold`);
  },

  async updateStock(id: string, stock: number): Promise<MarketplaceProduct> {
    return api.put<MarketplaceProduct>(`/commands/sync/marketplace/products/${id}/stock`, { stock });
  },

  async contactSeller(productId: string, message: string): Promise<void> {
    await api.post(`/commands/sync/marketplace/products/${productId}/contact`, { message });
  },
};
