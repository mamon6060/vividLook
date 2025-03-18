import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import MainLayout from "./layout/MainLayout";
import { Provider } from "react-redux";
import { store } from "./store";
import Gallery from "./pages/Gallery";
import Video from "./pages/Video";
import Login from "./layout/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./layout/ForgotPassword";
import ResetPassword from "./layout/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Bookings from "./pages/Bookings";
import ProductCategory from "./pages/ProductCategory";
import Products from "./pages/Products";
import ServiceCategory from "./pages/ServiceCategory";
import Services from "./pages/Services";
import Mechanic from "./pages/Mechanic";
import District from "./pages/District";
import Thana from "./pages/Thana";
import Area from "./pages/Area";
import Banners from "./pages/Banners";
import Contacts from "./pages/Contact";
import Partner from "./pages/Partner";
import HomeApplianceCategory from "./pages/HomeApplianceCategory";
import HomeApplianceSubCategory from "./pages/HomeApplianceBrand";
import HomeApplianceSubChildCategory from "./pages/HomeApplianceSubChildCategory";
import HomeApplianceProduct from "./pages/HomeApplianceProducts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      { path: "summary", element: <Dashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "service-bookings", element: <Bookings /> },
      { path: "spare-parts-category", element: <ProductCategory /> },
      { path: "spare-parts", element: <Products /> },
      { path: "service-category", element: <ServiceCategory /> },
      { path: "services", element: <Services /> },
      { path: "mechanic", element: <Mechanic /> },
      { path: "district", element: <District /> },
      { path: "thana", element: <Thana /> },
      { path: "area", element: <Area /> },
      { path: "gallery", element: <Gallery /> },
      { path: "video", element: <Video /> },
      { path: "profile", element: <Profile /> },
      { path: "banners", element: <Banners /> },
      { path: "contacts", element: <Contacts /> },
      { path: "partners", element: <Partner /> },
      { path: "products", element: <HomeApplianceProduct /> },
      { path: "product-category", element: <HomeApplianceCategory /> },
      { path: "product-brand", element: <HomeApplianceSubCategory /> },
      {
        path: "product-subcategory",
        element: <HomeApplianceSubChildCategory />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
