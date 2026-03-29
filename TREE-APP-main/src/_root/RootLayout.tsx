import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Topbar />
      
      {/* LeftSidebar is only visible on medium screens and above */}
      <div className="hidden md:flex">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 h-full overflow-auto">
        <Outlet />
      </main>
      
      {/* Bottombar is only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <Bottombar />
      </div>
    </div>
  );
};

export default RootLayout;
