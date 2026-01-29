import { createContext, useContext, useState, ReactNode } from "react";
import { Project } from "@/types/project";

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  deleteProject: (id: string) => void;
  addProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Extended mock projects for Socialabs
const initialProjects: Project[] = [
  {
    id: "1",
    name: "Persib Bandung",
    description: "Analisis sentimen dan topik terkait pemain baru Persib Bandung",
    category: "sports",
    keywords: ["Layvin Kurzawa"],
    language: "id",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    status: "active",
    tweetsCount: 45000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Pemilu 2024",
    description: "Analisis sentimen dan topik terkait pemilihan umum Indonesia 2024",
    category: "politics",
    keywords: ["pilpres 2024"],
    language: "id",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-15"),
    status: "completed",
    tweetsCount: 125000,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Brand Tech Analysis",
    description: "Monitor brand perception for technology companies",
    category: "business",
    keywords: ["startup indonesia"],
    language: "en",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-28"),
    status: "active",
    tweetsCount: 32000,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    name: "AI Technology",
    description: "Tracking discussions about artificial intelligence development",
    category: "technology",
    keywords: ["ChatGPT"],
    language: "all",
    startDate: new Date("2024-01-10"),
    endDate: new Date("2024-02-10"),
    status: "completed",
    tweetsCount: 78000,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "5",
    name: "Entertainment News",
    description: "Monitoring entertainment and celebrity news",
    category: "entertainment",
    keywords: ["drakor"],
    language: "id",
    startDate: new Date("2024-02-05"),
    endDate: new Date("2024-02-20"),
    status: "pending",
    tweetsCount: 15000,
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    name: "Health Campaign",
    description: "Public health awareness campaign monitoring",
    category: "health",
    keywords: ["vaksin"],
    language: "id",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-02-20"),
    status: "active",
    tweetsCount: 28000,
    createdAt: new Date("2024-01-20"),
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialProjects[0]);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        setProjects,
        deleteProject,
        addProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
