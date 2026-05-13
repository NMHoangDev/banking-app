import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';

export function AppLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-sidebar min-h-screen flex flex-col bg-surface overflow-x-hidden">
        <Header />
        <div className="flex-1 p-8 max-w-[1600px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
