import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import AppErrorBoundary from "./components/common/AppErrorBoundary";
import App from "./App";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={2800}
            pauseOnHover
            newestOnTop
            theme="colored"
          />
        </BrowserRouter>
      </Provider>
    </AppErrorBoundary>
  </React.StrictMode>
);
