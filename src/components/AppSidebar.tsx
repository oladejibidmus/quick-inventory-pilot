
import { useState } from "react";
import { 
  BarChart3, 
  Package, 
  ArrowRightLeft, 
  FileText, 
  Settings, 
  QrCode,
  Calendar
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Items", url: "/items", icon: Package },
  { title: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  { title: "Purchase Orders", url: "/purchase-orders", icon: FileText },
  { title: "Maintenance", url: "/maintenance", icon: Calendar },
  { title: "Scanner", url: "/scanner", icon: QrCode },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-blue-100 text-blue-900 font-medium hover:bg-blue-100" 
      : "text-slate-700 hover:bg-slate-100";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible
    >
      <SidebarContent className="bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <div className="font-semibold text-slate-900">StockFlow</div>
                <div className="text-xs text-slate-600">Inventory System</div>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-600 font-medium">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls(item.url)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
