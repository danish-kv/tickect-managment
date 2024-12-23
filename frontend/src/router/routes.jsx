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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/tickets",
        element: <TicketsPage />,
      },
      {
        path: "/tickets/:id",
        element: <TicketDetails />,
      },
    ],
  },

  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "tickets",
        element: <TicketManagement />,
      },
    ],
  },
  {
    path: "admin/tickets/:id",
    element: <AdminTicketDetails />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
