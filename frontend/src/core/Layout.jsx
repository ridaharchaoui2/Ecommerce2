import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/user/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Toaster />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
