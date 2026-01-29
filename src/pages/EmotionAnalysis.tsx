import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTweets, emotionData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, MessageSquare, Tag } from "lucide-react";
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

const EmotionAnalysis = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const { selectedProject } = useProject();

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

      {/* Emotion Cards */}
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
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{ 
                    color: "#fff" // <-- TAMBAHKAN INI (Biar teks list item/data jadi putih)
                    }}
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
                <BarChart data={emotionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis type="number" stroke="hsl(220, 10%, 60%)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 60%)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 8%)",
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{ 
                    color: "#fff" // <-- TAMBAHKAN INI (Biar teks list item/data jadi putih)
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {emotionData.map((entry, index) => (
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
