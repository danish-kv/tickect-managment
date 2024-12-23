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
      path : 'admin/login',
      element : <AdminLogin />
    },
    {
      path : 'admin/dashboard',
      element : <AdminDashboard />
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  
  export default routes;
  