import { Tweet } from "@/types/project";
import { cn } from "@/lib/utils";
import { Heart, Repeat2, MessageCircle, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface TweetCardProps {
  tweet: Tweet;
  className?: string;
}

const sentimentColors = {
  positive: "border-l-success",
  negative: "border-l-destructive",
};

const emotionEmojis: Record<string, string> = {
  joy: "😊",
  anger: "😤",
  sadness: "😢",
  fear: "😨",
  surprise: "😮",
  disgust: "🤢",
};

export function TweetCard({ tweet, className }: TweetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-xl bg-card border border-border/50",
        "hover:border-primary/30 transition-all duration-300",
        "border-l-4",
        sentimentColors[tweet.sentiment],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={tweet.author.avatar}
          alt={tweet.author.displayName}
          className="w-10 h-10 rounded-full bg-muted"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">
              {tweet.author.displayName}
            </span>
            {tweet.author.verified && (
              <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <span className="text-muted-foreground text-sm">
              @{tweet.author.username}
            </span>
          </div>
          
          <p className="text-foreground/90 mb-3">{tweet.content}</p>
          
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{tweet.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat2 className="w-4 h-4" />
              <span>{tweet.retweets}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{tweet.likes}</span>
            </div>
            <span className="ml-auto">
              {format(tweet.createdAt, "dd MMM yyyy")}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl">{emotionEmojis[tweet.emotion]}</span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            tweet.sentiment === "positive" && "bg-success/10 text-success",
            tweet.sentiment === "negative" && "bg-destructive/10 text-destructive"
          )}>
            {tweet.sentiment}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
