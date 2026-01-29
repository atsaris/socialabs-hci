import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { mockCommunities, mockInfluencers, mockTopics, mockTweets } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Users, MessageSquare, User, Tag } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TweetCard } from "@/components/ui/tweet-card";
import { useProject } from "@/context/ProjectContext";

// Force-directed graph node type
interface GraphNode {
  id: string;
  x: number;
  y: number;
  username: string;
  isInfluencer: boolean;
  community: string;
  color: string;
  size: number;
}

const CommunityDetection = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { selectedProject } = useProject();

  // Generate nodes for force-directed graph simulation
  const graphNodes = useMemo(() => {
    const nodes: GraphNode[] = [];
    const centerX = 400;
    const centerY = 250;
    
    // Add influencer nodes (larger)
    mockInfluencers.forEach((influencer, i) => {
      const community = mockCommunities[i % mockCommunities.length];
      const angle = (i / mockInfluencers.length) * Math.PI * 2;
      const radius = 120;
      nodes.push({
        id: influencer.id,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: centerY + Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 40,
        username: influencer.username,
        isInfluencer: true,
        community: community.id,
        color: community.color,
        size: 20 + (influencer.influence / 10),
      });
    });

    // Add regular user nodes (smaller) for each community
    mockCommunities.forEach((community, communityIndex) => {
      const baseAngle = (communityIndex / mockCommunities.length) * Math.PI * 2;
      const numNodes = 8 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < numNodes; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * 1.2;
        const radius = 180 + Math.random() * 80;
        nodes.push({
          id: `user-${community.id}-${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius * 0.6,
          username: `user_${community.id.toLowerCase()}_${i + 1}`,
          isInfluencer: false,
          community: community.id,
          color: community.color,
          size: 4 + Math.random() * 4,
        });
      }
    });

    return nodes;
  }, []);

  // Filter nodes by selected community
  const filteredNodes = selectedCommunity 
    ? graphNodes.filter(n => n.community === selectedCommunity)
    : graphNodes;

  // Get topics for selected community
  const communityTopics = selectedCommunity
    ? mockTopics.filter((_, i) => i % mockCommunities.length === parseInt(selectedCommunity) - 1 || i === 0)
    : mockTopics;

  // Get tweets for selected community
  const communityTweets = selectedCommunity
    ? mockTweets.slice(0, 3)
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
          <h1 className="text-3xl font-bold text-foreground">Community Detection</h1>
          {selectedProject && (
            <Badge variant="secondary" className="text-sm">
              <Tag className="w-3 h-3 mr-1" />
              {getCategoryLabel(selectedProject.category)}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Identify groups involved in the discussed context
          {selectedProject && (
            <span className="text-primary"> — {selectedProject.name}</span>
          )}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Communities Found"
          value={mockCommunities.length}
          icon={Network}
        />
        <StatCard
          title="Total Members"
          value="36.2K"
          icon={Users}
        />
        <StatCard
          title="Connections"
          value="89K"
          icon={MessageSquare}
        />
        <StatCard
          title="Key Influencers"
          value={mockInfluencers.length}
          icon={User}
        />
      </div>

      {/* Community Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Filter by community:</span>
        <Select value={selectedCommunity || ""} onValueChange={(v) => setSelectedCommunity(v || null)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Communities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Communities</SelectItem>
            {mockCommunities.map((community) => (
              <SelectItem key={community.id} value={community.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: community.color }}
                  />
                  {community.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCommunity && (
          <button 
            onClick={() => setSelectedCommunity(null)}
            className="text-sm text-primary hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Network Graph */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Social Network Analysis Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[500px] rounded-xl bg-muted/30 border border-border/50 overflow-hidden">
            {/* SVG Network Visualization */}
            <svg className="w-full h-full" viewBox="0 0 800 500">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(222, 30%, 15%)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connections between nodes */}
              <g stroke="hsl(203, 89%, 53%)" strokeOpacity="0.15" strokeWidth="1">
                {filteredNodes.filter(n => n.isInfluencer).map((influencer) => (
                  filteredNodes.filter(n => !n.isInfluencer && n.community === influencer.community).map((node, i) => (
                    <line 
                      key={`${influencer.id}-${node.id}`}
                      x1={influencer.x} 
                      y1={influencer.y} 
                      x2={node.x} 
                      y2={node.y}
                      strokeOpacity={selectedCommunity ? 0.3 : 0.1}
                    />
                  ))
                ))}
              </g>

              {/* Small nodes */}
              {filteredNodes.filter(n => !n.isInfluencer).map((node, i) => (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    fillOpacity={hoveredNode === node.id ? 1 : 0.6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.02 }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  />
                  {hoveredNode === node.id && (
                    <g>
                      <rect
                        x={node.x - 40}
                        y={node.y - 25}
                        width="80"
                        height="20"
                        rx="4"
                        fill="hsl(222, 47%, 11%)"
                        stroke="hsl(222, 30%, 25%)"
                      />
                      <text
                        x={node.x}
                        y={node.y - 12}
                        textAnchor="middle"
                        fill="hsl(220, 14%, 96%)"
                        fontSize="10"
                      >
                        @{node.username}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* Influencer nodes (larger with username) */}
              {filteredNodes.filter(n => n.isInfluencer).map((node, index) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size + 8}
                    fill={node.color}
                    fillOpacity="0.2"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    stroke={node.color}
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                  <text
                    x={node.x}
                    y={node.y + node.size + 15}
                    textAnchor="middle"
                    fill="hsl(220, 14%, 96%)"
                    fontSize="10"
                    fontWeight="600"
                  >
                    @{node.username}
                  </text>
                </motion.g>
              ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-2">Communities</p>
              <div className="space-y-2">
                {mockCommunities.map((community) => (
                  <div 
                    key={community.id} 
                    className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                      selectedCommunity && selectedCommunity !== community.id ? 'opacity-40' : ''
                    }`}
                    onClick={() => setSelectedCommunity(
                      selectedCommunity === community.id ? null : community.id
                    )}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: community.color }}
                    />
                    <span className="text-xs text-muted-foreground">{community.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Topics & Tweets */}
      {selectedCommunity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topics in Community */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Top Topics in {mockCommunities.find(c => c.id === selectedCommunity)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communityTopics.slice(0, 3).map((topic, index) => (
                <div 
                  key={topic.id}
                  className="p-3 rounded-lg bg-muted/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{topic.name}</p>
                      <p className="text-sm text-muted-foreground">{topic.tweetsCount.toLocaleString()} tweets</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{topic.percentage}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tweets from Community */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Tweets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communityTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Community Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCommunities.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`bg-card border-border/50 hover:border-primary/30 transition-all cursor-pointer ${
                selectedCommunity === community.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCommunity(
                selectedCommunity === community.id ? null : community.id
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${community.color}20` }}
                  >
                    <Users className="w-6 h-6" style={{ color: community.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{community.name}</h3>
                    <p className="text-sm text-muted-foreground">{community.members.toLocaleString()} members</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Main Topic</span>
                    <span className="text-sm font-medium text-foreground">{community.mainTopic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Top Influencer</span>
                    <span className="text-sm font-medium text-primary">
                      @{mockInfluencers[index % mockInfluencers.length]?.username}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDetection;
