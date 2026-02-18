import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
                    <p className="mt-2 text-gray-600">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    {this.state.error && (
                        <div className="mt-4 max-w-lg overflow-auto rounded bg-gray-100 p-4 text-left text-sm text-gray-800 shadow">
                            <p className="font-semibold">Error Details:</p>
                            <pre>{this.state.error.toString()}</pre>
                        </div>
                    )}
                    <button
                        className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
