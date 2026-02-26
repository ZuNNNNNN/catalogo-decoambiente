/**
 * Tipos TypeScript para la aplicación
 */
import type { LucideIcon } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
  emoji?: string;
  Icon?: LucideIcon;
  featured: boolean;
  tags: string[];
  stock?: number;
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  slug: string;
  name: string;
  Icon: LucideIcon;
  count: number;
  gradient: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

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
