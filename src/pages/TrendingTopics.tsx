import { motion } from "framer-motion";
import { TweetCard } from "@/components/ui/tweet-card";
import { mockTopics, mockTweets } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Tambahkan Users ke dalam import lucide-react
import { TrendingUp, MessageSquare, Tag, Users } from "lucide-react"; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { cn } from "@/lib/utils";

const TrendingTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { selectedProject } = useProject();

  const filteredTweets = selectedTopic
    ? mockTweets.filter((t) => t.topic === selectedTopic)
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
          <h1 className="text-3xl font-bold text-foreground">Trending Topics</h1>
          {selectedProject && (
            <Badge variant="secondary" className="text-sm">
              <Tag className="w-3 h-3 mr-1" />
              {getCategoryLabel(selectedProject.category)}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Identify the main topics being discussed
          {selectedProject && (
            <span className="text-primary"> 
              — {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
            </span>
          )}
        </p>
      </motion.div>

      {/* Stats - Urutan: Total Tweets (Kiri), Total Topics (Tengah), Top Topic (Kanan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Tweets - Menggunakan ikon Users (Orang) */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tweets</p>
                <p className="text-2xl font-bold text-foreground">45,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Topics - Menggunakan ikon MessageSquare (Bubble Chat) */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Topics</p>
                <p className="text-2xl font-bold text-foreground">{mockTopics.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Topic */}
        <Card className="bg-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Topic</p>
                <p className="text-2xl font-bold text-foreground">{mockTopics[0]?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Topic Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Topic</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopics.map((topic, index) => (
                <TableRow
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.name ? null : topic.name)}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedTopic === topic.name 
                      ? "bg-primary/10 hover:bg-primary/15" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        index === 0 ? "bg-primary" :
                        index === 1 ? "bg-success" :
                        index === 2 ? "bg-warning" :
                        "bg-muted-foreground"
                      )} />
                      {topic.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {topic.description || "No description available"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tweets by Topic */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Tweets {selectedTopic && `— ${selectedTopic}`}
            {selectedTopic && (
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-sm text-primary hover:underline ml-auto font-normal"
              >
                Clear filter
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTweets.length > 0 ? (
            filteredTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No tweets found for this topic.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingTopics;