/**
 * Tipos TypeScript para la aplicación
 */
import type { LucideIcon } from "lucide-react";

// ============================================================
// DOMAIN MODELS (Firestore)
// ============================================================

/**
 * Producto - Modelo de dominio para Firestore
 */
export interface Product {
  id: string;
  name: string;
  category: string; // slug de la categoría
  price: number;
  description?: string;
  imageUrl?: string;
  emoji?: string;
  Icon?: LucideIcon; // Solo para UI
  featured?: boolean;
  tags?: string[];
  stock?: number;
  sku?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

/**
 * Categoría - Modelo de dominio para Firestore
 */
export interface CategoryDocument {
  id: string; // ID del documento en Firestore
  slug: string; // URL-friendly identifier (ej: "living", "dormitorio")
  name: string; // Nombre visible (ej: "Living", "Dormitorio")
  description?: string;
  emoji?: string; // Emoji representativo (ej: "🛋️", "🛏️")
  order?: number; // Orden de visualización
  featured?: boolean; // Si se muestra en destacados
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Testimonio - Modelo de dominio
 */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

/**
 * Colección - Agrupación temática de productos
 */
export interface CollectionDocument {
  id: string; // ID del documento en Firestore
  slug: string; // URL-friendly identifier (ej: "primavera-2026", "vintage")
  name: string; // Nombre visible (ej: "Colección Primavera 2026")
  description?: string; // Descripción de la colección
  imageUrl?: string; // Imagen principal de la colección
  featured?: boolean; // Si se muestra en destacados
  productIds?: string[]; // IDs de productos en esta colección
  order?: number; // Orden de visualización
  startDate?: string; // Fecha de inicio ISO
  endDate?: string; // Fecha de fin ISO (para colecciones temporales)
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// UI MODELS (Frontend)
// ============================================================

/**
 * Categoría con datos de UI (ícono Lucide, gradiente, count dinámico)
 */
export interface CategoryUI {
  slug: string;
  name: string;
  description?: string;
  emoji?: string;
  Icon: LucideIcon; // Para UI
  count: number; // Calculado desde productos
  gradient: string; // Para UI
  featured?: boolean;
}

/**
 * Colección con datos de UI
 */
export interface CollectionUI {
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  productCount: number; // Calculado desde productos o productIds.length
  products?: Product[]; // Productos de la colección (opcional)
  order?: number;
  startDate?: string;
  endDate?: string;
}

// ============================================================
// FILTER & SORT
// ============================================================

export type SortOption =
  | "nombre-asc"
  | "nombre-desc"
  | "precio-asc"
  | "precio-desc"
  | "destacados";

export interface FilterState {
  categoria: string;
  precioMin: number;
  precioMax: number;
  busqueda: string;
  sort: SortOption;
}

// ============================================================
// API RESPONSES
// ============================================================

/**
 * Respuesta de importación masiva
 */
export interface BulkImportResult {
  created: number;
  failed: number;
  errors: string[];
}

/**
 * Respuesta de operación con éxito/error
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================
// FORM DATA
// ============================================================

/**
 * Datos para crear/editar producto (sin ID)
 */
export type ProductFormData = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "Icon"
>;

/**
 * Datos para crear/editar categoría (sin ID)
 */
export type CategoryFormData = Omit<
  CategoryDocument,
  "id" | "createdAt" | "updatedAt"
>;

/**
 * Datos para crear/editar colección (sin ID)
 */
export type CollectionFormData = Omit<
  CollectionDocument,
  "id" | "createdAt" | "updatedAt"
>;
