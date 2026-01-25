import { motion } from "framer-motion";
import { TopicCard } from "@/components/ui/topic-card";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTopics, mockTweets } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, MessageSquare, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState } from "react";

const TopicModeling = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredTweets = selectedTopic
    ? mockTweets.filter((t) => t.topic === selectedTopic)
    : mockTweets;

  const pieColors = ["#1DA1F2", "#17BF63", "#FFAD1F", "#F45D22", "#794BC4", "#E0245E"];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Topic Modeling</h1>
        <p className="text-muted-foreground">
          Identifikasi topik-topik utama yang sedang dibicarakan
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Hash className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Topics</p>
                <p className="text-2xl font-bold text-foreground">{mockTopics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tweets</p>
                <p className="text-2xl font-bold text-foreground">125K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Topic</p>
                <p className="text-2xl font-bold text-foreground">Teknologi AI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Distribution & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Topic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockTopics}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                  >
                    {mockTopics.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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

        {/* Topic Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              onClick={() => setSelectedTopic(selectedTopic === topic.name ? null : topic.name)}
              className={selectedTopic === topic.name ? "ring-2 ring-primary" : ""}
            />
          ))}
        </div>
      </div>

      {/* Tweets by Topic */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tweets {selectedTopic && `- ${selectedTopic}`}
            {selectedTopic && (
              <button
                onClick={() => setSelectedTopic(null)}
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

export default TopicModeling;
