import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTweets, sentimentData, trendData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ThumbsUp, ThumbsDown, Minus, MessageSquare } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SentimentAnalysis = () => {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

  const filteredTweets = selectedSentiment
    ? mockTweets.filter((t) => t.sentiment === selectedSentiment)
    : mockTweets;

  const sentimentStats = [
    { label: "Positive", value: 45, icon: ThumbsUp, color: "text-success", bg: "bg-success/10" },
    { label: "Negative", value: 25, icon: ThumbsDown, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Neutral", value: 30, icon: Minus, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Sentiment Analysis</h1>
        <p className="text-muted-foreground">
          Analisis keberpihakan audiens terhadap konteks yang dibicarakan
        </p>
      </motion.div>

      {/* Sentiment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    innerRadius={60}
                    paddingAngle={2}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart - Trend */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Sentiment Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 10%, 60%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 60%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="hsl(142, 76%, 36%)" fill="url(#colorPositive)" />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="hsl(0, 84%, 60%)" fill="url(#colorNegative)" />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="hsl(38, 92%, 50%)" fill="url(#colorNeutral)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tweets by Sentiment */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tweets {selectedSentiment && `- ${selectedSentiment.charAt(0).toUpperCase() + selectedSentiment.slice(1)}`}
            {selectedSentiment && (
              <button
                onClick={() => setSelectedSentiment(null)}
                className="text-sm text-primary hover:underline ml-auto"
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
