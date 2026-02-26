/**
 * Error Boundary para capturar errores de React
 * Patrón 7: Manejo centralizado de errores UI
 */
import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 Error Boundary capturó un error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorPage}>
          <div className={styles.errorContent}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Algo salió mal</h2>
            <p className={styles.errorMessage}>
              {this.state.error?.message || "Error desconocido"}
            </p>
            <button onClick={this.handleReset} className={styles.btnRetry}>
              <RefreshCcw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
