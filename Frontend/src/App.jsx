import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthRouteGate from "./components/auth/AuthRouteGate";
import PresenceHeartbeat from "./components/auth/PresenceHeartbeat";
import SessionBootstrap from "./components/auth/SessionBootstrap";
import RouteFallback from "./components/common/RouteFallback";
import ScrollToTop from "./components/common/ScrollToTop";

const HomePage = lazy(() => import("./pages/public/HomePage"));
const MenuPage = lazy(() => import("./pages/public/MenuPage"));
const SpecialsPage = lazy(() => import("./pages/public/SpecialsPage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));
const PreorderPage = lazy(() => import("./pages/public/PreorderPage"));
const LoginPage = lazy(() => import("./pages/public/LoginPage"));
const RegisterPage = lazy(() => import("./pages/public/RegisterPage"));
const AccountPage = lazy(() => import("./pages/public/AccountPage"));
const NotFoundPage = lazy(() => import("./pages/public/NotFoundPage"));

const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const MenuItemsPage = lazy(() => import("./pages/admin/MenuItemsPage"));
const SpecialsManagePage = lazy(() => import("./pages/admin/SpecialsManagePage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));

export default function App() {
  return (
    <>
      <SessionBootstrap />
      <PresenceHeartbeat />
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/specials" element={<SpecialsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route element={<AuthRouteGate mode="guestOnly" />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<AuthRouteGate mode="protected" />}>
              <Route path="/preorder" element={<PreorderPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="menu-items" element={<MenuItemsPage />} />
            <Route path="specials" element={<SpecialsManagePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
