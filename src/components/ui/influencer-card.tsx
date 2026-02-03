import { Influencer } from "@/types/project";
import { cn } from "@/lib/utils";
import { BadgeCheck, Users, TrendingUp, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";

interface InfluencerCardProps {
  influencer: Influencer;
  rank: number;
  className?: string;
}

export function InfluencerCard({ influencer, rank, className }: InfluencerCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-card border border-border/50",
        "hover:border-primary/30 transition-all duration-300",
        "group",
        className
      )}
    >
      {/* Rank badge */}
      <div className="absolute top-4 right-4">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
          rank === 1 && "bg-yellow-500 text-yellow-950",
          rank === 2 && "bg-gray-300 text-gray-800",
          rank === 3 && "bg-amber-600 text-amber-100",
          rank > 3 && "bg-muted text-muted-foreground"
        )}>
          #{rank}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={influencer.avatar}
          alt={influencer.displayName}
          className="w-16 h-16 rounded-full bg-muted border-2 border-primary/20"
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{influencer.displayName}</h3>
            {influencer.verified && (
              <BadgeCheck className="w-4 h-4 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{influencer.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-bold text-foreground">{formatNumber(influencer.followers)}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="font-bold text-foreground">{influencer.engagement}%</p>
          <p className="text-xs text-muted-foreground">Engagement</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <MessageSquare className="w-4 h-4" />
          </div>
          <p className="font-bold text-foreground">{influencer.tweetsCount}</p>
          <p className="text-xs text-muted-foreground">Tweets</p>
        </div>
      </div>

      {/* Influence meter
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Influence Score</span>
          <span className="text-sm font-medium text-primary">{influencer.influence}/100</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${influencer.influence}%` }}
            transition={{ duration: 0.8, delay: rank * 0.1 }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </div> */}

<a 
  href={`https://x.com/${influencer.username.replace('@', '')}`} 
  target="_blank" 
  rel="noopener noreferrer"
  className="block w-full"
>
  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
    <ExternalLink className="w-4 h-4 mr-2" />
    View Profile
  </Button>
</a>
    </motion.div>
  );
}
