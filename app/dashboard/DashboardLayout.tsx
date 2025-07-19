'use client';

import React, { useState } from "react";
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';

const navItems = [
  { label: "Overview", icon: "🏥" },
  { label: "Clinical Insights", icon: "🩺" },
  { label: "Data Scientist View", icon: "📊" },
  { label: "Patient View", icon: "👨‍⚕️" },
];

export default function DashboardLayout({ children, activeTab, setActiveTab }: {
  children: React.ReactNode;
  activeTab: number;
  setActiveTab: (idx: number) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    setIsSidebarOpen(false); // Close sidebar on mobile after tab selection
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-green-50">
      {/* Sidebar (unchanged, but z-50 for topmost) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white bg-opacity-95 border-r border-blue-100 flex flex-col items-center py-8 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="mb-10 flex flex-col items-center">
          <div className="text-4xl mb-2">🏥</div>
          <div className="text-2xl font-extrabold text-blue-700 tracking-tight">BoneHealth AI</div>
          <div className="text-xs text-gray-400 mt-1">Osteoporosis Dashboard</div>
        </div>
        <nav className="flex-1 w-full">
          {navItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => handleTabClick(idx)}
              className={`w-full flex items-center gap-3 px-6 py-3 my-2 rounded-lg text-lg font-semibold transition-all
                ${activeTab === idx ? "bg-blue-100 text-blue-700 shadow" : "text-gray-700 hover:bg-blue-50"}`}
            >
              <span className="text-2xl">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button 
          onClick={handleLogout}
          className="mt-8 w-5/6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-green-50 md:ml-0">
        {/* Mobile Navbar (matches landing page) */}
        <nav className="md:hidden w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BH</span>
                </div>
                <span className="font-bold text-xl text-gray-900">BoneHealth AI</span>
              </div>
              {/* Mobile Menu Button on the right */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </nav>
        {/* Mobile Overlay (z-40, below sidebar) */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Remove old mobile header */}
        {/* {children} */}
        {children}
      </main>
    </div>
  );
} 