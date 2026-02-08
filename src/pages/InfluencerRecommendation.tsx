import { motion } from "framer-motion";
import { InfluencerCard } from "@/components/ui/influencer-card";
import { mockInfluencers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, TrendingUp, Award, ChevronDown, Filter, Tag } from "lucide-react"; 
import { StatCard } from "@/components/ui/stat-card";
import { useState } from "react"; 
import { Button } from "@/components/ui/button";
import { useProject } from "@/context/ProjectContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InfluencerRecommendation = () => {
  const { selectedProject } = useProject();
  const [sortBy, setSortBy] = useState<"influence" | "followers" | "engagement" | "tweetsCount">("influence");

  const sortedInfluencers = [...mockInfluencers].sort((a, b) => b[sortBy] - a[sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case "influence": return "Mentions & Retweets";
      case "followers": return "Followers";
      case "engagement": return "Engagement";
      case "tweetsCount": return "Tweets";
      default: return "Mentions & Retweets";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      sports: "Sports",
      politics: "Politics",
      business: "Business",
      technology: "Technology",
      entertainment: "Entertainment",
      health: "Health",
      education: "Education",
    };
    return labels[category] || category;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header - Sudah Update Sejajar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Influencer Recommendation</h1>
          
          {selectedProject && (
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 text-sm font-semibold transition-colors shadow-none">
                {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
              </Badge>

              <span className="flex items-center gap-1.5 text-primary font-medium text-sm"> 
                — <Tag className="w-3.5 h-3.5" /> {getCategoryLabel(selectedProject.category)}
              </span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          Identify the most influential people in the discussed context
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Influencers" value="4" icon={Users} />
        <StatCard title="Top Influencer" value="@bandungfootball" icon={Crown} />
        <StatCard title="Avg Engagement" value="4.1%" change="" changeType="positive" icon={TrendingUp} />
        <StatCard title="Total Reach" value="8,125" icon={Award} />
      </div>

      {/* INI YANG TADI HILANG: Top Performers (4 Cards) */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Crown className="w-5 h-5 text-primary" />
            Top Influencers
          </CardTitle>
          <p className="text-m text-muted-foreground">
              Ranking is determined based on the volume of mentions and retweets within the network.
            </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockInfluencers.slice(0,4).map((influencer, index) => (
              <InfluencerCard
                key={influencer.id}
                influencer={influencer}
                rank={index + 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Section */}
      <Card className="bg-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Award className="w-5 h-5 text-primary" />
            Influence Leaderboard
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 border border-border/50 bg-muted/20 text-foreground transition-all h-9 px-4 rounded-xl shadow-sm">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold">Sort by: {getSortLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-2xl rounded-xl p-1.5">
              <DropdownMenuItem onClick={() => setSortBy("influence")} className="cursor-pointer rounded-lg font-semibold text-xs px-3 py-2">Mentions & Retweets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("followers")} className="cursor-pointer rounded-lg font-semibold text-xs px-3 py-2">Followers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("engagement")} className="cursor-pointer rounded-lg font-semibold text-xs px-3 py-2">Engagement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("tweetsCount")} className="cursor-pointer rounded-lg font-semibold text-xs px-3 py-2">Tweets</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {sortedInfluencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? "bg-yellow-500 text-yellow-950" :
                  index === 1 ? "bg-gray-300 text-gray-800" :
                  index === 2 ? "bg-amber-600 text-amber-100" :
                  "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                  {index + 1}
                </div>
                <img src={influencer.avatar} alt={influencer.displayName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{influencer.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                </div>
                
                <div className="text-right hidden md:block pl-4">
                  <p className={cn("font-medium text-foreground", sortBy === "followers" && "text-primary")}>
                    {influencer.followers >= 1000000 ? `${(influencer.followers / 1000000).toFixed(1)}M` : `${(influencer.followers / 1000).toFixed(0)}K`}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-right hidden lg:block border-l border-border/50 pl-4">
                  <p className={cn("font-medium text-foreground", sortBy === "engagement" && "text-primary")}>
                    {influencer.engagement}%
                  </p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                <div className="text-right hidden lg:block border-l border-border/50 pl-4">
                  <p className={cn("font-medium text-foreground", sortBy === "tweetsCount" && "text-primary")}>
                    {influencer.tweetsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Tweets</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerRecommendation;