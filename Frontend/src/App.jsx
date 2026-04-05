import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/public/HomePage";
import MenuPage from "./pages/public/MenuPage";
import SpecialsPage from "./pages/public/SpecialsPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import PreorderPage from "./pages/public/PreorderPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import MenuItemsPage from "./pages/admin/MenuItemsPage";
import SpecialsManagePage from "./pages/admin/SpecialsManagePage";
import OrdersPage from "./pages/admin/OrdersPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/specials" element={<SpecialsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/preorder" element={<PreorderPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="menu-items" element={<MenuItemsPage />} />
        <Route path="specials" element={<SpecialsManagePage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}