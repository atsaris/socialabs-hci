import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTweets, emotionData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, MessageSquare, Tag, Users } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const emotionEmojis: Record<string, { emoji: string; color: string; bg: string }> = {
  joy: { emoji: "😊", color: "text-green-500", bg: "bg-green-500/10" },
  anger: { emoji: "😤", color: "text-red-500", bg: "bg-red-500/10" },
  sadness: { emoji: "😢", color: "text-blue-500", bg: "bg-blue-500/10" },
  fear: { emoji: "😨", color: "text-purple-500", bg: "bg-purple-500/10" },
  surprise: { emoji: "😮", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  disgust: { emoji: "🤢", color: "text-orange-500", bg: "bg-orange-500/10" },
};

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

const EmotionAnalysis = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const { selectedProject } = useProject();

  const barChartData = emotionData
    .map(item => ({
      ...item,
      tweetCount: (item.value * 45000) / 100
    }))
    .sort((a, b) => b.tweetCount - a.tweetCount);

  const filteredTweets = selectedEmotion
    ? mockTweets.filter((t) => t.emotion === selectedEmotion)
    : mockTweets;

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
          <h1 className="text-3xl font-bold text-foreground">Emotion Analysis</h1>
          {selectedProject && (
            <Badge variant="secondary" className="text-sm">
              <Tag className="w-3 h-3 mr-1" />
              {getCategoryLabel(selectedProject.category)}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Analyze audience emotional reactions to the discussed context
          {selectedProject && (
            <span className="text-primary"> 
              — {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
            </span>
          )}
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
      </div>

      {/* Emotion Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {emotionData.map((emotion, index) => (
          <motion.div
            key={emotion.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedEmotion(
              selectedEmotion === emotion.name.toLowerCase() ? null : emotion.name.toLowerCase()
            )}
            className={cn(
              "cursor-pointer rounded-2xl p-4 bg-card border text-center transition-all",
              selectedEmotion === emotion.name.toLowerCase()
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/50 hover:border-primary/30"
            )}
          >
            <span className="text-4xl block mb-2">
              {emotionEmojis[emotion.name.toLowerCase()]?.emoji || "😐"}
            </span>
            <p className="font-medium text-foreground text-sm">{emotion.name}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{emotion.value}%</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-primary" />
              Emotion Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
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
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value}%`, 
                      name
                    ]}
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

        {/* Bar Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Emotion Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 45000]}
                    stroke="hsl(220, 10%, 60%)" 
                    fontSize={12} 
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 60%)" fontSize={12} width={80} />
                  <Tooltip
                    separator=""
                    formatter={(value: number) => [
                      `${value.toLocaleString()} Tweets`, 
                      ""
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="tweetCount" radius={[0, 4, 4, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tweets by Emotion */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tweets {selectedEmotion && `— ${selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)}`}
            {selectedEmotion && (
              <button
                onClick={() => setSelectedEmotion(null)}
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

export default EmotionAnalysis;