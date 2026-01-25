import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { TweetCard } from "@/components/ui/tweet-card";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Hash,
  FolderOpen,
  ArrowRight,
  Plus
} from "lucide-react";
import { mockProjects, mockTweets, trendData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang! Berikut ringkasan analisis media sosial Anda.
          </p>
        </div>
        <Link to="/create-project">
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Project Baru
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tweets"
          value="170K"
          change="+12.5%"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Total Projects"
          value={mockProjects.length}
          change="2 active"
          changeType="neutral"
          icon={FolderOpen}
        />
        <StatCard
          title="Influencers Found"
          value="156"
          change="+8"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Topics Detected"
          value="24"
          change="+5"
          changeType="positive"
          icon={Hash}
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tweet Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTweets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(203, 89%, 53%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(203, 89%, 53%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 10%, 60%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 60%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(222, 47%, 8%)", 
                      border: "1px solid hsl(222, 30%, 18%)",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "hsl(220, 14%, 96%)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tweets"
                    stroke="hsl(203, 89%, 53%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTweets)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                Recent Projects
              </span>
              <Link to="/create-project" className="text-primary text-sm hover:underline">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground truncate">
                    {project.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted-foreground/10 text-muted-foreground'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.tweetsCount.toLocaleString()} tweets</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tweets */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Recent Analyzed Tweets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
