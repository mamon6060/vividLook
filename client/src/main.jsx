import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes/dist/cjs/index.js";
import "react-modern-drawer/dist/index.css";

import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider } from "react-photo-view";

import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import store from "./redux/store/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackToTopButton from "./components/layout/BackToTopButton.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer />
    <BackToTopButton/>
    <Theme>
      <PhotoProvider>
        <App />
      </PhotoProvider>
    </Theme>
  </Provider>
);
