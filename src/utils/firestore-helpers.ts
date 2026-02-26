/**
 * Script de utilidad para probar la conexión a Firebase
 * y agregar productos de prueba
 *
 * Ejecutar desde la consola del navegador cuando estés en /admin/dashboard
 */

// Probar conexión a Firebase
console.log("🔥 Configuración de Firebase:");
console.log({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + "...",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
});

// Productos de prueba para agregar a Firestore
export const productosEjemplo = [
  {
    name: "Sofá Vintage",
    category: "living",
    price: 45000,
    description: "Sofá de tres cuerpos estilo vintage con tapizado de lino",
    emoji: "🛋",
    featured: true,
    tags: ["vintage", "living", "confort"],
    stock: 3,
    sku: "SOF-001",
  },
  {
    name: "Mesa de Comedor Rustica",
    category: "cocina",
    price: 35000,
    description: "Mesa de madera maciza con acabado rústico para 6 personas",
    emoji: "🪑",
    featured: true,
    tags: ["madera", "rustico", "familiar"],
    stock: 5,
    sku: "MES-002",
  },
  {
    name: "Lámpara de Pie Industrial",
    category: "iluminacion",
    price: 12000,
    description: "Lámpara de pie estilo industrial con base de hierro",
    emoji: "💡",
    featured: false,
    tags: ["industrial", "moderno", "iluminacion"],
    stock: 8,
    sku: "LAM-003",
  },
  {
    name: "Cama King Size",
    category: "dormitorio",
    price: 65000,
    description: "Cama king size con cabecero acolchado",
    emoji: "🛏",
    featured: true,
    tags: ["dormitorio", "confort", "moderno"],
    stock: 2,
    sku: "CAM-004",
  },
  {
    name: "Espejo Decorativo",
    category: "accesorios",
    price: 8500,
    description: "Espejo redondo con marco de madera tallada",
    emoji: "🪞",
    featured: false,
    tags: ["decoracion", "espejo", "artesanal"],
    stock: 10,
    sku: "ESP-005",
  },
];

/**
 * Función para agregar productos de prueba a Firestore
 * Ejecutar desde la consola del navegador:
 *
 * await agregarProductosPrueba()
 */
export async function agregarProductosPrueba() {
  const { collection, addDoc } = await import("firebase/firestore");
  const { db } = await import("@/lib/firebase");

  console.log("📦 Agregando productos de prueba a Firestore...");

  for (const producto of productosEjemplo) {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...producto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Producto agregado: ${producto.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Error al agregar ${producto.name}:`, error);
    }
  }

  console.log("🎉 Productos de prueba agregados!");
  console.log("🔄 Recarga la página para verlos");
}

/**
 * Función para limpiar todos los productos de Firestore
 * ⚠️ CUIDADO: Esta función elimina TODOS los productos
 *
 * await limpiarProductos()
 */
export async function limpiarProductos() {
  const { collection, getDocs, deleteDoc, doc } =
    await import("firebase/firestore");
  const { db } = await import("@/lib/firebase");

  const confirmacion = confirm(
    "⚠️ ¿Estás seguro de que quieres eliminar TODOS los productos?",
  );

  if (!confirmacion) {
    console.log("❌ Operación cancelada");
    return;
  }

  console.log("🗑️ Eliminando todos los productos...");

  const querySnapshot = await getDocs(collection(db, "products"));

  for (const document of querySnapshot.docs) {
    try {
      await deleteDoc(doc(db, "products", document.id));
      console.log(`✅ Eliminado: ${document.id}`);
    } catch (error) {
      console.error(`❌ Error al eliminar ${document.id}:`, error);
    }
  }

  console.log("🎉 Todos los productos eliminados!");
  console.log("🔄 Recarga la página");
}
