import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import TopicModeling from "./pages/TopicModeling";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import EmotionAnalysis from "./pages/EmotionAnalysis";
import InfluencerRecommendation from "./pages/InfluencerRecommendation";
import CommunityDetection from "./pages/CommunityDetection";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/topics" element={<TopicModeling />} />
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
  </QueryClientProvider>
);

export default App;
