import {
  Armchair,
  Bed,
  ChefHat,
  Leaf,
  Lamp,
  Layers,
  Frame,
  Gem,
} from "lucide-react";
import type { CategoryUI } from "@/types";

export const categoriesData: CategoryUI[] = [
  {
    slug: "living",
    name: "Living",
    Icon: Armchair,
    count: 85,
    gradient: "linear-gradient(135deg, #C9956B, #E8C09A)",
  },
  {
    slug: "dormitorio",
    name: "Dormitorio",
    Icon: Bed,
    count: 72,
    gradient: "linear-gradient(135deg, #5C3D2E, #9C7B6A)",
  },
  {
    slug: "cocina",
    name: "Cocina",
    Icon: ChefHat,
    count: 63,
    gradient: "linear-gradient(135deg, #4A7C4A, #9CBD9C)",
  },
  {
    slug: "jardin",
    name: "Jardín",
    Icon: Leaf,
    count: 54,
    gradient: "linear-gradient(135deg, #3A623A, #70A070)",
  },
  {
    slug: "iluminacion",
    name: "Iluminación",
    Icon: Lamp,
    count: 48,
    gradient: "linear-gradient(135deg, #D4A574, #F9CC9F)",
  },
  {
    slug: "textiles",
    name: "Textiles",
    Icon: Layers,
    count: 91,
    gradient: "linear-gradient(135deg, #B07848, #D4A574)",
  },
  {
    slug: "arte",
    name: "Arte & Cuadros",
    Icon: Frame,
    count: 36,
    gradient: "linear-gradient(135deg, #804040, #B07848)",
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    Icon: Gem,
    count: 42,
    gradient: "linear-gradient(135deg, #402918, #8A5C35)",
  },
];
