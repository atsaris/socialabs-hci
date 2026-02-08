import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { Button } from "@/components/ui/button";
import { mockTweets, sentimentData, positiveWords, negativeWords, mockTopics } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ThumbsUp, ThumbsDown, MessageSquare, Tag, Users, Filter, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central" 
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const WordCloud = ({ 
  words, 
  color, 
  hoveredWord, 
  setHoveredWord 
}: { 
  words: { text: string; count: number }[]; 
  color: string;
  hoveredWord: string | null;
  setHoveredWord: (word: string | null) => void;
}) => {
  const maxCount = Math.max(...words.map(w => w.count));
  const minCount = Math.min(...words.map(w => w.count));
  
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center p-6 min-h-[250px]">
      {words.map((word, index) => {
        const ratio = (word.count - minCount) / (maxCount - minCount || 1);
        const size = 0.8 + (ratio * 2.7); 
        const isHovered = hoveredWord === word.text;
        
        return (
          <motion.div
            key={word.text}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="relative"
            onMouseEnter={() => setHoveredWord(word.text)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            <span
              className={cn(
                "cursor-default transition-all duration-300 font-bold tracking-tight block leading-none",
                isHovered ? "opacity-100 scale-110" : "opacity-80 hover:opacity-100"
              )}
              style={{
                fontSize: `${size}rem`,
                color: color,
                textShadow: isHovered ? `0 0 20px ${color}44` : 'none'
              }}
            >
              {word.text}
            </span>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap z-10"
              >
                {word.count.toLocaleString()} tweets
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const SentimentAnalysis = () => {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const { selectedProject } = useProject();

  const filteredTweets = selectedSentiment
    ? mockTweets.filter((t) => t.sentiment === selectedSentiment)
    : mockTweets;

  const sentimentStats = [
    { label: "Positive", value: 64, emoji: "😊", color: "text-success", bg: "bg-success/10" },
    { label: "Negative", value: 36, emoji: "☹️", color: "text-destructive", bg: "bg-destructive/10" },
  ];

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
      {/* Header Updated - Aligning Badge and Tag on the same line */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Sentiment Analysis</h1>
            
            {selectedProject && (
              <div className="flex items-center gap-3">
                {/* Badge Project Name - Style Keywords Biru Muda */}
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1 text-sm font-semibold transition-colors shadow-none">
                  {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
                </Badge>

                {/* Tag Category disamping Badge */}
                <span className="flex items-center gap-1.5 text-primary font-medium text-sm"> 
                  — <Tag className="w-3.5 h-3.5" /> {getCategoryLabel(selectedProject.category)}
                </span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">
            Analyze audience sentiment towards the discussed context
          </p>
        </motion.div>

        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 border border-border/50 bg-card hover:bg-muted text-white transition-all h-11 px-5 rounded-xl shadow-sm">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{selectedTopic}</span>
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-2xl rounded-xl p-1.5">
              <DropdownMenuItem 
                onClick={() => setSelectedTopic("All Topics")}
                className="cursor-pointer hover:bg-primary hover:text-white rounded-lg transition-colors font-semibold px-3 py-2.5 mb-1"
              >
                All Topics
              </DropdownMenuItem>
              {mockTopics.map((topic) => (
                <DropdownMenuItem 
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.name.replace('#', ''))}
                  className="cursor-pointer hover:bg-primary hover:text-white rounded-lg transition-colors capitalize font-semibold px-3 py-2.5"
                >
                  {topic.name.replace('#', '')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 bg-card border border-border/50 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tweets</p>
              <p className="text-3xl font-bold text-foreground">45,000</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Heart className="w-5 h-5 text-primary" />
              Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    separator=""
                    formatter={(value: number) => [`${(value * 450).toLocaleString()} Tweets`, ""]}
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ThumbsUp className="w-5 h-5 text-success" />
              Positive Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WordCloud 
              words={positiveWords} 
              color="hsl(142, 76%, 36%)" 
              hoveredWord={hoveredWord}
              setHoveredWord={setHoveredWord}
            />
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <ThumbsDown className="w-5 h-5 text-destructive" />
              Negative Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WordCloud 
              words={negativeWords} 
              color="hsl(0, 84%, 60%)" 
              hoveredWord={hoveredWord}
              setHoveredWord={setHoveredWord}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sentimentStats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedSentiment(
              selectedSentiment === stat.label.toLowerCase() ? null : stat.label.toLowerCase()
            )}
            className={cn(
              "cursor-pointer rounded-2xl p-6 bg-card border transition-all shadow-sm",
              selectedSentiment === stat.label.toLowerCase()
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-4xl", stat.bg)}>
                {stat.emoji}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold">
              Tweets {selectedSentiment && (
                <span className="ml-2">
                   — {selectedSentiment === "positive" ? "😊 " : "☹️ "}{selectedSentiment.charAt(0).toUpperCase() + selectedSentiment.slice(1)}
                </span>
              )}
            </span>
            {selectedSentiment && (
              <button
                onClick={() => setSelectedSentiment(null)}
                className="text-sm text-primary hover:underline ml-auto font-normal"
              >
                Clear filter
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} hideLabel={true} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;