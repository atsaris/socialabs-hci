import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTweets, sentimentData, positiveWords, negativeWords } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ThumbsUp, ThumbsDown, MessageSquare, Tag, Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Fungsi untuk merender label persentase statis di dalam Pie Chart
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

// Word Cloud Component
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
  
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center p-4 min-h-[200px]">
      {words.map((word, index) => {
        const size = 0.7 + (word.count / maxCount) * 1.3;
        const isHovered = hoveredWord === word.text;
        
        return (
          <motion.div
            key={word.text}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
            onMouseEnter={() => setHoveredWord(word.text)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            <span
              className={cn(
                "cursor-default transition-all duration-200 font-medium",
                isHovered && "underline"
              )}
              style={{
                fontSize: `${size}rem`,
                // UBAH DISINI: Warna langsung menggunakan 'color' asli tanpa opacity 99
                color: color,
              }}
            >
              {word.text}
            </span>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border px-2 py-1 rounded text-xs whitespace-nowrap z-10"
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
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const { selectedProject } = useProject();

  const filteredTweets = selectedSentiment
    ? mockTweets.filter((t) => t.sentiment === selectedSentiment)
    : mockTweets;

  const sentimentStats = [
    { label: "Positive", value: 64, icon: ThumbsUp, color: "text-success", bg: "bg-success/10" },
    { label: "Negative", value: 36, icon: ThumbsDown, color: "text-destructive", bg: "bg-destructive/10" },
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Sentiment Analysis</h1>
          {selectedProject && (
            <Badge variant="secondary" className="text-sm">
              <Tag className="w-3 h-3 mr-1" />
              {getCategoryLabel(selectedProject.category)}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Analyze audience sentiment towards the discussed context
          {selectedProject && (
            <span className="text-primary"> 
              — {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
            </span>
          )}
        </p>
      </motion.div>

      {/* Stats Grid: Total Tweets (Kiri) + Sentiment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Total Tweets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          // whileHover={{ scale: 1.02 }}
          className="rounded-2xl p-6 bg-card border border-border/50 transition-all shadow-sm"
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

        {/* Sentiment Stats */}
        {sentimentStats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedSentiment(
              selectedSentiment === stat.label.toLowerCase() ? null : stat.label.toLowerCase()
            )}
            className={cn(
              "cursor-pointer rounded-2xl p-6 bg-card border transition-all",
              selectedSentiment === stat.label.toLowerCase()
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/50 hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                    innerRadius={0}
                    paddingAngle={0}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip          
                  separator="" // Menghilangkan tanda titik dua (:)
                   formatter={(value: number) => [`${(value * 450).toLocaleString()} Tweets`, ""]} // Mengosongkan nama label
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

        {/* Positive Word Cloud */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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

        {/* Negative Word Cloud */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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

      {/* Tweets by Sentiment */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tweets {selectedSentiment && `— ${selectedSentiment.charAt(0).toUpperCase() + selectedSentiment.slice(1)}`}
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
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;