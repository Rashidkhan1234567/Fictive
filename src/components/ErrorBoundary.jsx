import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
