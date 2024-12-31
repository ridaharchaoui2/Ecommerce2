import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/product/create",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/category/create",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Logout",
    href: "/admin/signout",
    icon: LogOut,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "" : <Menu className="h-6 w-6 " />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:static lg:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "border-r bg-white dark:bg-white mt-0"
        )}
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <NavLink
              to="/admin/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Package className="h-6 w-6" />
              <span>Admin</span>
            </NavLink>
          </div>
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {sidebarNavItems.map((item, index) => (
                <Button
                  key={index}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    window.location.pathname === item.href
                      ? "bg-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.title === "Logout") {
                      signout();
                    }
                  }}
                >
                  <NavLink to={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </NavLink>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
