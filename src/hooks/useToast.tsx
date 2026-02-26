/**
 * Hook reutilizable para notificaciones toast
 * Patrón 8: Custom hooks con lógica encapsulada
 */
import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import styles from "./useToast.module.css";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastData {
  msg: string;
  type: ToastType;
  duration?: number;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "error":
      return <AlertCircle size={20} />;
    case "info":
      return <Info size={20} />;
    case "warning":
      return <AlertTriangle size={20} />;
    default:
      return <CheckCircle2 size={20} />;
  }
};

const getToastClass = (type: ToastType) => {
  switch (type) {
    case "error":
      return styles.toastError;
    case "info":
      return styles.toastInfo;
    case "warning":
      return styles.toastWarning;
    default:
      return "";
  }
};

export const useToast = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (msg: string, type: ToastType = "success", duration = 3500) => {
      setToast({ msg, type, duration });
      setTimeout(() => setToast(null), duration);
    },
    [],
  );

  const ToastContainer = useMemo(
    () => (
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`${styles.toast} ${getToastClass(toast.type)}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {getToastIcon(toast.type)}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [toast],
  );

  return { showToast, ToastContainer };
};
