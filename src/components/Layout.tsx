
import { Outlet } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <header className="h-14 flex items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-slate-900">StockFlow Pro</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Online
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
