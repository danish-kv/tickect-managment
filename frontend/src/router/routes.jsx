import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../features/common/LandingPage";
import NotFound from "../features/common/NotFound";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import TicketDetails from "../features/profile/TickectDetail";
import TicketsPage from "../features/profile/Tickets";
import Layout from "../features/Layout/Layout";



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
      path: "*",
      element: <NotFound />, // This will catch all undefined routes
    },
  ]);
  
  export default routes;
  