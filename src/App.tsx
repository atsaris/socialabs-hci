import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProjectProvider } from "./context/ProjectContext";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import TrendingTopics from "./pages/TrendingTopics";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import EmotionAnalysis from "./pages/EmotionAnalysis";
import InfluencerRecommendation from "./pages/InfluencerRecommendation";
import CommunityDetection from "./pages/CommunityDetection";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Landing page sekarang langsung ke Projects */}
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/create-project" element={<CreateProject />} />
              
              {/* Dashboard lama kita jadikan halaman Overview */}
              <Route path="/overview" element={<Dashboard />} />
              
              <Route path="/trending-topics" element={<TrendingTopics />} />
              <Route path="/sentiment" element={<SentimentAnalysis />} />
              <Route path="/emotion" element={<EmotionAnalysis />} />
              <Route path="/influencer" element={<InfluencerRecommendation />} />
              <Route path="/community" element={<CommunityDetection />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;