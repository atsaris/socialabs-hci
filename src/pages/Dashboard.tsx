import { useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { 
  MessageSquare, 
  Users, 
  FolderOpen,
  Hash,
  ArrowRight,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import { useProject } from "@/context/ProjectContext";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const { projects, selectedProject, setSelectedProject, deleteProject } = useProject();
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const displayedProjects = showAll 
    ? projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : projects.slice(0, 3);

  const handleSelectProject = (project: typeof projects[0]) => {
    setSelectedProject(project);
    navigate("/trending-topics");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Here's an overview of your social media analysis.
          </p>
        </div>
        <Link to="/create-project">
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tweets"
          value="170K"
          change="+12.5%"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Total Projects"
          value={projects.length}
          change="2 active"
          changeType="neutral"
          icon={FolderOpen}
        />
        <StatCard
          title="Influencers Found"
          value="156"
          change="+8"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Topics Detected"
          value="24"
          change="+5"
          changeType="positive"
          icon={Hash}
        />
      </div>

      {/* Recent Projects - Full Width */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Recent Projects
            </span>
            <Button 
              variant="link" 
              className="text-primary p-0 h-auto"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "View all"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAll ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedProjects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectProject(project)}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {project.description}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                          {project.keywords[0]}
                        </span>
                      </TableCell>
                      <TableCell>
                        {project.language === "id" ? "🇮🇩 Indonesian" : 
                         project.language === "en" ? "🇺🇸 English" : "🌐 All"}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProject(project.id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {displayedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleSelectProject(project)}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">
                        {project.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : project.status === 'completed'
                          ? 'bg-muted-foreground/10 text-muted-foreground'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                        {project.keywords[0]}
                      </span>
                      <span>{project.tweetsCount.toLocaleString()} tweets</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProject(project.id);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
