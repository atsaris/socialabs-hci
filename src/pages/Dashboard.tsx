import { motion } from "framer-motion";
import { useProject } from "@/context/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, TrendingUp, Smile, 
  Users, BarChart3, Tag, ArrowUpRight 
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { sentimentData, mockTopics, emotionData } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  const { selectedProject } = useProject();
  const navigate = useNavigate();

  const barChartData = emotionData
    .map(item => ({
      ...item,
      tweetCount: (item.value * 45000) / 100
    }))
    .sort((a, b) => b.tweetCount - a.tweetCount);

  if (!selectedProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <BarChart3 className="w-20 h-20 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold italic text-muted-foreground">No active project</h2>
        <p className="text-muted-foreground max-w-sm">Select a project from the "Projects" page to start analyzing the data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Project Overview</h1>
          <Badge variant="secondary" className="text-sm">
            <Tag className="w-3 h-3 mr-1" />
            Sports
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Comprehensive summary and analysis overview of the 
          <span className="text-primary font-medium mx-1">
            {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}
          </span> 
          discussion context.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Tweets" value="45,000" icon={MessageSquare} />
        <StatCard title="Overall Sentiment" value="Positive" icon={Smile} />
        <StatCard title="Top Influencer" value="@bandungfootball" icon={Users} />
        <StatCard title="Identified Topics" value={mockTopics.length} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Sentiment Distribution */}
        <Card className="bg-card border-border/50 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary" />
              Sentiment Distribution
            </CardTitle>
            <button 
              onClick={() => navigate("/sentiment")}
              className="p-1 hover:bg-primary/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Emotion Comparison */}
        <Card className="bg-card border-border/50 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Emotion Comparison
            </CardTitle>
            <button 
              onClick={() => navigate("/emotion")}
              className="p-1 hover:bg-primary/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    domain={[0, 45000]}
                    stroke="hsl(220, 10%, 60%)" 
                    fontSize={10} 
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 60%)" fontSize={10} width={70} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    separator=""
                    formatter={(value: number) => [`${value.toLocaleString()} Tweets`, ""]}
                    contentStyle={{ backgroundColor: "hsl(222, 47%, 8%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", color: "#fff" }}
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

        {/* 3. Top Trending Topics - Tanpa Hashtag & Angka */}
        <Card className="bg-card border-border/50 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Trending Topics
            </CardTitle>
            <button 
              onClick={() => navigate("/trending-topics")}
              className="p-1 hover:bg-primary/10 rounded-md transition-colors text-muted-foreground hover:text-primary"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTopics.slice(0, 5).map((topic) => (
              <div 
                key={topic.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all cursor-pointer" 
                onClick={() => navigate("/trending-topics")}
              >
                {/* Menghilangkan '#' dan merapikan teks */}
                <span className="font-semibold text-primary text-sm capitalize">
                  {topic.name.replace('#', '')}
                </span>
                {/* Badge Angka sudah dihapus */}
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;