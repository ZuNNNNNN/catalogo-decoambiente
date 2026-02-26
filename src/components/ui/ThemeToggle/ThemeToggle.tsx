import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      }
      title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
