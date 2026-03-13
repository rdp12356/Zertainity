import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, we log to a service, not the console
    if (import.meta.env.PROD) {
      // logErrorToService(error, errorInfo);
    } else {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
          <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter">System Interruption</h1>
            <p className="text-muted-foreground font-medium leading-relaxed">
              We encountered an unexpected technical limitation. For security reasons, the operation was halted.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="rounded-none px-8 h-12 bg-foreground text-background hover:bg-accent transition-colors"
            >
              Return to Safety
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
