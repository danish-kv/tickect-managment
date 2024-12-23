import React from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./router/routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster reverseOrder={false} />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
