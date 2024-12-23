import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../features/common/LandingPage";
import NotFound from "../features/common/NotFound";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Layout from "../features/common/Layout";
import TicketsPage from "../features/users/pages/Tickets";
import TicketDetails from "../features/users/pages/TickectDetail";
import AdminLogin from "../features/admin/pages/AdminLogin";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import UserManagement from "../features/admin/pages/UserManagement";
import TicketManagement from "../features/admin/pages/TicketManagement";
import AdminTicketDetails from "../features/admin/pages/AdminTicketDetails";
import AdminLayout from "../features/admin/layout/AdminLayout";
import Unauthorized from "../features/common/Unauthorized";
import LandingPageProtection from "./protected/LandingPageProtection";
import AuthProtection from "./protected/AuthProtection";
import ProtectedRoute from "./protected/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPageProtection element={<LandingPage />} />,
      },
      {
        path: "/login",
        element: (
          <AuthProtection element={<LoginPage />} redirectTo={"/tickets"} />
        ),
      },
      {
        path: "/register",
        element: (
          <AuthProtection element={<RegisterPage />} redirectTo={"/tickets"} />
        ),
      },
      {
        path: "/tickets",
        element: <ProtectedRoute element={<TicketsPage />} role={"user"} />,
      },
      {
        path: "/tickets/:id",
        element: <ProtectedRoute element={<TicketDetails />} role={"user"} />,
      },
    ],
  },

  {
    path: "admin/login",
    element: <AuthProtection element={<AdminLogin />} redirectTo={"/admin"} />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute element={<AdminDashboard />} role={"admin"} />,
      },
      {
        path: "users",
        element: <ProtectedRoute element={<UserManagement />} role={"admin"} />,
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute element={<TicketManagement />} role={"admin"} />
        ),
      },
    ],
  },
  {
    path: "admin/tickets/:id",
    element: <ProtectedRoute element={<AdminTicketDetails />} role={"admin"} />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
]);

export default routes;
