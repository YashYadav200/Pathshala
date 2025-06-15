"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  FileText,
  Bell,
  Menu,
  Shield,
  X,
  MessageSquare,
} from "lucide-react";

async function checkIfUserIsAdmin(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/me');
    
    if (!response.ok) {
      console.error('Failed to fetch user data');
      return false;
    }
    
    const data = await response.json();
    
    return data.user && data.user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const adminStatus = await checkIfUserIsAdmin();
      setIsAdmin(adminStatus);
    };
    fetchAdminStatus();
  }, []);

  const allMenuItems = [
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Admin Access",
      href: "/dashboard/admin",
      description: "Manage users and settings",
      isAdminOnly: true,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Study Material",
      href: "/dashboard/materials",
      description: "Access study resources",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Lectures",
      href: "/dashboard/lectures",
      description: "View recorded lectures",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Attendance",
      href: "/dashboard/attendance",
      description: "Track attendance records",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Announcements",
      href: "/dashboard/announcements",
      description: "View important updates",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Feedback & Doubts",
      href: "/dashboard/feedback",
      description: "Submit your feedback and questions",
    },
  ];

  const menuItems = allMenuItems.filter(item => !item.isAdminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-purple-500/20 z-40 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-purple-500/10"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <h2 className="text-lg font-bold text-white ml-2">Pathshala</h2>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[300px] bg-gray-900 border-r border-purple-500/20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 z-50 lg:z-40`}
      >
        <div className="p-3 sm:p-4 lg:p-6 border-b border-purple-500/20 lg:block hidden">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Pathshala</h2>
          <p className="text-xs text-purple-400/70">Learning Management</p>
        </div>
        <nav className="p-2 space-y-1 mt-14 lg:mt-0">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-purple-500/10 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg bg-purple-500/20 text-purple-400/70">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white text-sm truncate">{item.label}</div>
                <div className="text-xs text-purple-400/70 truncate">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="p-2 sm:p-4 lg:p-6 pt-16 lg:pt-2">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="p-2 sm:p-3 lg:p-4 rounded-lg bg-gray-900 border border-purple-500/20 hover:bg-purple-500/10 transition-colors group shadow-lg shadow-purple-500/5"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400/70 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate">{item.label}</h3>
                      <p className="text-xs text-purple-400/70 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}