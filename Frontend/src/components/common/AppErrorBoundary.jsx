import React from "react";
import { siteConfig } from "../../constants/siteConfig";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application runtime error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ef_0%,#f6fbf6_48%,#eff5ff_100%)] px-4 py-10">
        <div className="content-shell">
          <div className="glass-panel rounded-[36px] p-8 text-center md:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-700">
              Unexpected Error
            </p>
            <h1 className="mt-5 text-4xl font-bold text-slate-950 md:text-5xl">
              {siteConfig.name} hit a runtime problem.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              The page could not finish rendering. Reloading usually fixes temporary issues.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={this.handleReload} className="primary-button">
                Reload page
              </button>
              <button type="button" onClick={this.handleGoHome} className="secondary-button">
                Go home
              </button>
            </div>
            {this.state.error?.message ? (
              <p className="mt-6 text-sm text-slate-500">{this.state.error.message}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
