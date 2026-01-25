import { motion } from "framer-motion";
import { InfluencerCard } from "@/components/ui/influencer-card";
import { mockInfluencers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, TrendingUp, Award } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

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
          Identifikasi orang-orang yang paling berpengaruh dalam konteks yang dibicarakan
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Influencers"
          value="156"
          icon={Users}
        />
        <StatCard
          title="Top Influencer"
          value="@influencer_tech"
          icon={Crown}
        />
        <StatCard
          title="Avg Engagement"
          value="4.1%"
          change="+0.5%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Reach"
          value="8.4M"
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
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockInfluencers.map((influencer, index) => (
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
                <div className="text-right">
                  <p className="font-bold text-primary">{influencer.influence}/100</p>
                  <p className="text-xs text-muted-foreground">Influence Score</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="font-medium text-foreground">{(influencer.followers / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-right hidden lg:block">
                  <p className="font-medium text-foreground">{influencer.engagement}%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
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
