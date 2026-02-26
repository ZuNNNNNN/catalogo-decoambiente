/**
 * Mapeo de categorías/tipos a iconos de Lucide React.
 * Usar en CatalogoPage y otros lugares donde los productos
 * vienen de Firestore y no tienen un componente Icon adjunto.
 */
import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  Bed,
  ChefHat,
  Leaf,
  Lamp,
  Layers,
  Frame,
  Gem,
  Package,
  Flower2,
  Grid3x3,
  Maximize2,
  LayoutDashboard,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  living: Armchair,
  dormitorio: Bed,
  cocina: ChefHat,
  jardin: Leaf,
  iluminacion: Lamp,
  textiles: Layers,
  arte: Frame,
  accesorios: Gem,
};

export const PRODUCT_TYPE_ICONS: Record<string, LucideIcon> = {
  sofa: Armchair,
  lampara: Lamp,
  alfombra: Grid3x3,
  espejo: Maximize2,
  mesa: LayoutDashboard,
  maceta: Flower2,
  flor: Flower2,
  living: Armchair,
  dormitorio: Bed,
  cocina: ChefHat,
  jardin: Leaf,
  iluminacion: Lamp,
  textiles: Layers,
  arte: Frame,
  accesorios: Gem,
};

/** Devuelve el icono de una categoría o un icono genérico */
export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category.toLowerCase()] ?? Package;
}
