import React from "react";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = ({ children }) => {
  return (
    <main className="pt-16">
      {" "}
      {/* pt-16 matches navbar height */}
      {children}
      <Toaster />
    </main>
  );
};

export default MainLayout;
