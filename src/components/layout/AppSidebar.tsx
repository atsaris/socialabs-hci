import { 
  LayoutDashboard, 
  FolderPlus, 
  TrendingUp, 
  Heart, 
  Smile, 
  Users, 
  Network, 
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "@/context/ProjectContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", requiresProject: false },
  { icon: FolderOpen, label: "Projects", path: "/projects", requiresProject: false },
  { icon: FolderPlus, label: "Create Project", path: "/create-project", requiresProject: false },
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
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground">Socialabs</h1>
                <p className="text-xs text-muted-foreground">Analytics</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {collapsed && (
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors",
            "text-sidebar-foreground",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Selected Project Indicator */}
      {selectedProject && !collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground mb-1">Selected Project</p>
          <p className="text-sm font-medium text-primary truncate">{selectedProject.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                "hover:bg-sidebar-accent group",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20",
                !isActive && "text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive && "text-sidebar-primary-foreground",
                !isActive && "text-sidebar-foreground/70 group-hover:text-sidebar-primary"
              )} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
            "hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>
    </motion.aside>
  );
}
