import { Topic } from "@/types/project";
import { cn } from "@/lib/utils";
import { Hash, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface TopicCardProps {
  topic: Topic;
  index: number;
  onClick?: () => void;
  className?: string;
}

const colors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-yellow-500",
  "from-red-500 to-rose-500",
  "from-indigo-500 to-violet-500",
];

export function TopicCard({ topic, index, onClick, className }: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 cursor-pointer",
        "bg-card border border-border/50",
        "hover:border-primary/30 transition-all duration-300",
        "group",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
        "bg-gradient-to-br",
        colors[index % colors.length]
      )} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br",
            colors[index % colors.length]
          )}>
            <Hash className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            {topic.percentage}%
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {topic.name}
        </h3>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
          <MessageSquare className="w-4 h-4" />
          <span>{topic.tweetsCount.toLocaleString()} tweets</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {topic.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
