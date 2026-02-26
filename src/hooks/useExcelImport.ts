/**
 * Hook para parsear archivos Excel y mapear a Products
 */

import { useState } from "react";
import * as XLSX from "xlsx";
import type { ProductFormData } from "@/types";
import { slugify } from "@/lib/utils";

type ExcelRow = Record<string, string | number | boolean | undefined>;

interface UseExcelImportReturn {
  parseExcel: (file: File) => Promise<ProductFormData[]>;
  loading: boolean;
  error: string | null;
  preview: ProductFormData[] | null;
}

/**
 * Mapea las columnas del Excel a los campos del producto
 * El Excel puede tener columnas con nombres en español o inglés
 */
//TODO: Revisar que el mapeo este optimizado y que todo quede en inglesS
function mapRowToProduct(row: ExcelRow): ProductFormData {
  const name = String(
    row["nombre"] || row["name"] || row["Nombre"] || row["Name"] || "",
  ).trim();
  const category = String(
    row["categoria"] ||
      row["category"] ||
      row["Categoría"] ||
      row["Category"] ||
      "",
  )
    .trim()
    .toLowerCase();
  const price = Number(
    row["precio"] || row["price"] || row["Precio"] || row["Price"] || 0,
  );
  const description = String(
    row["descripcion"] ||
      row["description"] ||
      row["Descripción"] ||
      row["Description"] ||
      "",
  ).trim();
  const emoji = String(row["emoji"] || row["Emoji"] || "🏺").trim() || "🏺";
  const tagsRaw = String(row["tags"] || row["Tags"] || row["etiquetas"] || "");
  const tags = tagsRaw
    ? tagsRaw
        .split(/[,;|]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
  const featured =
    String(row["destacado"] || row["featured"] || "no")
      .toLowerCase()
      .trim() === "si" ||
    String(row["destacado"] || row["featured"] || "")
      .toLowerCase()
      .trim() === "yes" ||
    Boolean(row["destacado"] || row["featured"]) === true;

  const sku = String(
    row["sku"] || row["SKU"] || row["codigo"] || slugify(name),
  ).trim();

  const stock = Number(row["stock"] || row["Stock"] || 0);

  return {
    name,
    category,
    price,
    description,
    emoji,
    featured,
    tags,
    sku,
    stock,
  };
}

//TODO: Usar use() para evitar estado de loading y error en el componente, y manejar todo desde el hook

export const useExcelImport = (): UseExcelImportReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ProductFormData[] | null>(null);

  const parseExcel = async (file: File): Promise<ProductFormData[]> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });

          // Usar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convertir a JSON
          const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, {
            defval: "",
          });

          if (rows.length === 0) {
            setError("El archivo Excel está vacío.");
            reject(new Error("Excel vacío"));
            return;
          }

          // Mapear filas a productos
          const products = rows
            .map(mapRowToProduct)
            .filter((p) => p.name && p.price > 0); // Filtrar filas inválidas

          if (products.length === 0) {
            setError(
              'No se encontraron productos válidos. Asegurate de tener columnas "nombre" y "precio".',
            );
            reject(new Error("Sin productos válidos"));
            return;
          }

          setPreview(products);
          setLoading(false);
          resolve(products);
        } catch {
          const msg =
            "Error al leer el archivo. Asegurate de que sea un .xlsx o .xls válido.";
          setError(msg);
          setLoading(false);
          reject(new Error(msg));
        }
      };

      reader.onerror = () => {
        setError("Error al leer el archivo.");
        setLoading(false);
        reject(new Error("FileReader error"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return { parseExcel, loading, error, preview };
};
