import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#04130c] font-sans text-white selection:bg-[#2ee89a] selection:text-black">
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen md:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                className="fixed left-0 top-0 z-50 h-screen md:hidden"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-8 md:px-8 lg:px-10">
            <div className="mx-auto max-w-[1440px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
