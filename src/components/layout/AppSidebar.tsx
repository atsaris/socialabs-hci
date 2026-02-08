import { 
  FolderOpen, 
  FolderPlus, 
  BarChart3, 
  TrendingUp, 
  Heart, 
  Smile, 
  Users, 
  Network, 
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "@/context/ProjectContext";

const menuItems = [
  { icon: FolderOpen, label: "Projects", path: "/projects", requiresProject: false },
  { icon: FolderPlus, label: "Create Project", path: "/create-project", requiresProject: false },
  { icon: BarChart3, label: "Overview", path: "/overview", requiresProject: true },
  { icon: TrendingUp, label: "Trending Topics", path: "/trending-topics", requiresProject: true },
  { icon: Heart, label: "Sentiment Analysis", path: "/sentiment", requiresProject: true },
  { icon: Smile, label: "Emotion Analysis", path: "/emotion", requiresProject: true },
  { icon: Users, label: "Influencer", path: "/influencer", requiresProject: true },
  { icon: Network, label: "Community Detection", path: "/community", requiresProject: true },
  { icon: Bot, label: "Chatbot", path: "/chatbot", requiresProject: true },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { selectedProject } = useProject();

  const visibleMenuItems = menuItems.filter(item => 
    !item.requiresProject || selectedProject !== null
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0 z-20"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <img src="/Icon Socialabs.png" alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="font-bold text-sidebar-foreground">Socialabs</h1>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && <img src="/Icon Socialabs.png" alt="Logo" className="w-10 h-10 object-contain mx-auto" />}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 bg-sidebar-accent rounded-lg text-sidebar-foreground">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* INI BAGIAN YANG TADI KETINGGALAN: Selected Project Indicator */}
      {selectedProject && !collapsed && (
        <div className="px-5 py-4 border-b border-sidebar-border bg-primary/5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Active Project</p>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-bold truncate">{selectedProject.name}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={item.path}>
              {/* Separator untuk Analysis Tools */}
              {item.path === "/overview" && (
                <div className="pt-4 pb-2 px-3">
                  <div className="h-px bg-sidebar-border w-full mb-2" />
                  {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Analysis Tools</p>}
                </div>
              )}
              
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-sidebar-primary-foreground" : "group-hover:text-primary transition-colors"
                )} />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink to="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
}