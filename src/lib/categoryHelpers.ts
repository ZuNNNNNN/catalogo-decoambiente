/**
 * Utilidad para mapear emojis de categorías a iconos de Lucide
 */
import {
  Armchair,
  Bed,
  ChefHat,
  Leaf,
  Lamp,
  Layers,
  Frame,
  Gem,
  PackageIcon,
  Sofa,
  UtensilsCrossed,
  Trees,
  Lightbulb,
  Shirt,
  PaintBucket,
  Sparkles,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";

// Mapa de emojis a iconos
const emojiToIconMap: Record<string, LucideIcon> = {
  "🛋️": Armchair,
  "🛏️": Bed,
  "🍽️": ChefHat,
  "🪑": UtensilsCrossed,
  "🌿": Leaf,
  "💡": Lamp,
  "🧶": Layers,
  "🎨": Frame,
  "💼": PackageIcon,
  "✨": Sparkles,
  "🏡": DoorOpen,
  "🌳": Trees,
  "💡": Lightbulb,
  "👕": Shirt,
  "🎭": PaintBucket,
  "💎": Gem,
};

// Colores/gradientes predefinidos para cada categoría
const categoryGradients: Record<string, string> = {
  living: "linear-gradient(135deg, #C9956B, #E8C09A)",
  dormitorio: "linear-gradient(135deg, #5C3D2E, #9C7B6A)",
  cocina: "linear-gradient(135deg, #4A7C4A, #9CBD9C)",
  comedor: "linear-gradient(135deg, #8B5A3C, #C9956B)",
  jardin: "linear-gradient(135deg, #3A623A, #70A070)",
  iluminacion: "linear-gradient(135deg, #D4A574, #F9CC9F)",
  textiles: "linear-gradient(135deg, #B07848, #D4A574)",
  arte: "linear-gradient(135deg, #804040, #B07848)",
  oficina: "linear-gradient(135deg, #4A5568, #718096)",
  accesorios: "linear-gradient(135deg, #402918, #8A5C35)",
};

/**
 * Obtiene el ícono de Lucide correspondiente a un emoji
 */
export const getIconForEmoji = (emoji?: string): LucideIcon => {
  if (!emoji) return PackageIcon;
  return emojiToIconMap[emoji] || PackageIcon;
};

/**
 * Obtiene el gradiente correspondiente a un slug de categoría
 */
export const getGradientForCategory = (slug: string): string => {
  return categoryGradients[slug] || "linear-gradient(135deg, #C9956B, #E8C09A)";
};
