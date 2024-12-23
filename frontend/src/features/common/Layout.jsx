import React from "react";
import Header from "../common/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-white to-blue-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
