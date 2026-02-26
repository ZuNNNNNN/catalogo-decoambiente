/**
 * Script para poblar Firestore con datos iniciales
 * Ejecutar desde la consola del navegador en /admin/dashboard
 */

import type { CategoryFormData, CollectionFormData } from "@/types";
import * as categoriesService from "@/services/categories.service";
import * as collectionsService from "@/services/collections.service";

// --------------------------------------------------------
// Categorías Iniciales
// --------------------------------------------------------
export const initialCategories: CategoryFormData[] = [
  {
    slug: "living",
    name: "Living",
    description:
      "Sofas, sillones, mesas de centro y muebles para tu sala de estar",
    emoji: "🛋️",
    order: 1,
  },
  {
    slug: "dormitorio",
    name: "Dormitorio",
    description: "Camas, mesas de luz, placares y todo para tu descanso",
    emoji: "🛏️",
    order: 2,
  },
  {
    slug: "cocina",
    name: "Cocina",
    description: "Muebles de cocina, islas, alacenas y almacenamiento",
    emoji: "🍽️",
    order: 3,
  },
  {
    slug: "comedor",
    name: "Comedor",
    description: "Mesas, sillas, aparadores y todo para tus reuniones",
    emoji: "🪑",
    order: 4,
  },
  {
    slug: "jardin",
    name: "Jardin",
    description: "Muebles de exterior, sombrillas, reposeras y decoracion",
    emoji: "🌿",
    order: 5,
  },
  {
    slug: "iluminacion",
    name: "Iluminacion",
    description:
      "Lamparas, colgantes, apliques y todo para iluminar tus espacios",
    emoji: "💡",
    order: 6,
  },
  {
    slug: "textiles",
    name: "Textiles",
    description: "Almohadas, mantas, cortinas y todo para dar calidez",
    emoji: "🧶",
    order: 7,
  },
  {
    slug: "arte",
    name: "Arte & Deco",
    description: "Cuadros, espejos, esculturas y objetos decorativos",
    emoji: "🎨",
    order: 8,
  },
  {
    slug: "oficina",
    name: "Oficina",
    description:
      "Escritorios, sillas ergonómicas y organización para tu espacio de trabajo",
    emoji: "💼",
    order: 9,
  },
  {
    slug: "accesorios",
    name: "Accesorios",
    description: "Pequeños detalles que marcan la diferencia",
    emoji: "✨",
    order: 10,
  },
];

// --------------------------------------------------------
// Colecciones Iniciales
// --------------------------------------------------------
export const initialCollections: CollectionFormData[] = [
  {
    slug: "primavera-2026",
    name: "Coleccion Primavera 2026",
    description: "Colores frescos y disenos renovados para la nueva temporada",
    imageUrl: "",
    featured: true,
    order: 1,
    startDate: "2026-03-01",
    endDate: "2026-05-31",
  },
  {
    slug: "vintage",
    name: "Coleccion Vintage",
    description: "Piezas con historia y personalidad atemporal",
    imageUrl: "",
    featured: true,
    order: 2,
  },
  {
    slug: "minimalista",
    name: "Coleccion Minimalista",
    description: "Diseno simple, funcional y elegante",
    imageUrl: "",
    featured: false,
    order: 3,
  },
  {
    slug: "industrial",
    name: "Coleccion Industrial",
    description: "Estetica urbana con materiales nobles",
    imageUrl: "",
    featured: false,
    order: 4,
  },
  {
    slug: "nordico",
    name: "Coleccion Nordico",
    description: "Calidez escandinava en cada detalle",
    imageUrl: "",
    featured: true,
    order: 5,
  },
];

// --------------------------------------------------------
// Función para poblar Firestore
// --------------------------------------------------------
export const seedDatabase = async () => {
  console.log("🌱 Iniciando población de base de datos...");

  try {
    // Poblar categorías
    console.log("\n📁 Creando categorías...");
    for (const category of initialCategories) {
      try {
        const id = await categoriesService.createCategory(category);
        console.log(
          `✅ Categoría creada: ${category.emoji} ${category.name} (${id})`,
        );
      } catch (error) {
        console.error(`❌ Error al crear categoría ${category.name}:`, error);
      }
    }

    // Poblar colecciones
    console.log("\n📦 Creando colecciones...");
    for (const collection of initialCollections) {
      try {
        const id = await collectionsService.createCollection(collection);
        console.log(`✅ Colección creada: ${collection.name} (${id})`);
      } catch (error) {
        console.error(`❌ Error al crear colección ${collection.name}:`, error);
      }
    }

    console.log("\n🎉 ¡Base de datos poblada exitosamente!");
    console.log(`   - ${initialCategories.length} categorías creadas`);
    console.log(`   - ${initialCollections.length} colecciones creadas`);

    return {
      success: true,
      categoriesCreated: initialCategories.length,
      collectionsCreated: initialCollections.length,
    };
  } catch (error) {
    console.error("❌ Error general al poblar la base de datos:", error);
    throw error;
  }
};

// --------------------------------------------------------
// Hacer disponible globalmente para ejecutar desde consola
// --------------------------------------------------------
if (typeof window !== "undefined") {
  // @ts-expect-error - Para acceso desde consola del navegador
  window.seedDatabase = seedDatabase;
}

// También exportar para poder importar en otros archivos
export default seedDatabase;
