import { motion } from "framer-motion";
import { InfluencerCard } from "@/components/ui/influencer-card";
import { mockInfluencers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, TrendingUp, Award, HelpCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InfluencerRecommendation = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Influencer Recommendation</h1>
        <p className="text-muted-foreground">
          Identify the most influential people in the discussed context
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Influencers"
          value="4"
          icon={Users}
        />
        <StatCard
          title="Top Influencer"
          value="@bandungfootball"
          icon={Crown}
        />
        <StatCard
          title="Avg Engagement"
          value="4.1%"
          change=""
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Reach"
          value="8,125"
          icon={Award}
        />
      </div>

      {/* Top Performers */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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

      {/* Leaderboard */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Influence Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInfluencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
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
                <img
                  src={influencer.avatar}
                  alt={influencer.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{influencer.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                </div>
                {/* <div className="text-right">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-primary">{influencer.influence}/100</p> */}
                    {/* <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[280px] p-3">
                        <p className="font-medium mb-1">Influence Score</p>
                        <p className="text-sm text-muted-foreground">
                          A composite metric calculated from follower count, engagement rate, 
                          retweet ratio, and topic relevance. Higher scores indicate greater 
                          influence within the analyzed context.
                        </p>
                      </TooltipContent>
                    </Tooltip> */}
                  {/* </div>
                  <p className="text-xs text-muted-foreground">Influence Score</p>
                </div> */}
                <div className="text-right hidden md:block">
                  <p className="font-medium text-foreground">
                     {influencer.followers >= 1000000 
                  ? `${(influencer.followers / 1000000).toFixed(1)}M` 
                  : `${(influencer.followers / 1000).toFixed(0)}K`
                   }
                  </p>
                 <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-right hidden lg:block">
                  <p className="font-medium text-foreground">{influencer.engagement}%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                <div className="text-right hidden lg:block">
                  <p className="font-medium text-foreground">{influencer.tweetsCount}</p>
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
