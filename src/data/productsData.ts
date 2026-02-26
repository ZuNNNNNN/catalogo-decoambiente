import {
  Armchair,
  Lamp,
  Grid3x3,
  Maximize2,
  LayoutDashboard,
  Flower2,
} from "lucide-react";
import type { Product } from "@/types";

export const featuredProductsData: Product[] = [
  {
    id: "1",
    name: "Sofá Riviera",
    category: "living",
    price: 1890000,
    description:
      "Sofá de tres cuerpos con estructura de madera maciza y tapizado en lino belga natural. Diseño atemporal, hecho a mano.",
    Icon: Armchair,
    featured: true,
    tags: ["madera", "lino", "artesanal"],
  },
  {
    id: "2",
    name: "Lámpara Arc Doré",
    category: "iluminacion",
    price: 420000,
    description:
      "Lámpara de pie en arco con base de mármol travertino y pantalla de seda ivory. Iluminación escultórica.",
    Icon: Lamp,
    featured: true,
    tags: ["marmol", "seda", "lujo"],
  },
  {
    id: "3",
    name: "Alfombra Bereber Atlas",
    category: "textiles",
    price: 950000,
    description:
      "Alfombra tejida a mano por artesanas del norte de África. Diseño geométrico en tonos piedra y marfil. Única.",
    Icon: Grid3x3,
    featured: true,
    tags: ["artesanal", "geometrico", "exclusivo"],
  },
  {
    id: "4",
    name: "Espejo Arco Provenzal",
    category: "accesorios",
    price: 380000,
    description:
      "Espejo de arco de 1,8m con marco tallado a mano en madera de pino, acabado envejecido al agua. Statement piece.",
    Icon: Maximize2,
    featured: true,
    tags: ["madera", "vintage", "statement"],
  },
  {
    id: "5",
    name: "Mesa Travertino & Hierro",
    category: "living",
    price: 670000,
    description:
      "Mesa de centro con tablero de travertino natural y estructura de hierro forjado en negro mate. Edición limitada.",
    Icon: LayoutDashboard,
    featured: true,
    tags: ["travertino", "hierro", "edicion-limitada"],
  },
  {
    id: "6",
    name: "Macetero Artesanal Oaxaca",
    category: "jardin",
    price: 125000,
    description:
      "Macetero de cerámica elaborado por alfareros oaxaqueños. Diseño acanalado en gres, tono tierra quemada. Set de 3.",
    Icon: Flower2,
    featured: true,
    tags: ["ceramica", "artesanal", "jardin"],
  },
];
