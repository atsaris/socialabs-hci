import { motion } from "framer-motion";
import { mockCommunities, mockInfluencers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Users, MessageSquare, User } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

const CommunityDetection = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Community Detection</h1>
        <p className="text-muted-foreground">
          Identifikasi kelompok-kelompok yang terlibat dalam konteks yang dibicarakan
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
          value="37.7K"
          icon={Users}
        />
        <StatCard
          title="Connections"
          value="125K"
          icon={MessageSquare}
        />
        <StatCard
          title="Key Influencers"
          value="24"
          icon={User}
        />
      </div>

      {/* Network Graph Placeholder */}
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

              {/* Connections */}
              <g stroke="hsl(203, 89%, 53%)" strokeOpacity="0.2" strokeWidth="1">
                <line x1="400" y1="250" x2="200" y2="150" />
                <line x1="400" y1="250" x2="600" y2="150" />
                <line x1="400" y1="250" x2="250" y2="350" />
                <line x1="400" y1="250" x2="550" y2="350" />
                <line x1="200" y1="150" x2="150" y2="100" />
                <line x1="200" y1="150" x2="250" y2="80" />
                <line x1="600" y1="150" x2="650" y2="100" />
                <line x1="600" y1="150" x2="550" y2="80" />
                <line x1="250" y1="350" x2="180" y2="400" />
                <line x1="250" y1="350" x2="300" y2="420" />
                <line x1="550" y1="350" x2="620" y2="400" />
                <line x1="550" y1="350" x2="500" y2="420" />
              </g>

              {/* Community Clusters */}
              {mockCommunities.map((community, index) => {
                const positions = [
                  { x: 200, y: 150 },
                  { x: 600, y: 150 },
                  { x: 250, y: 350 },
                  { x: 550, y: 350 },
                  { x: 400, y: 250 },
                ];
                const pos = positions[index % positions.length];
                const size = 30 + (community.members / 500);
                
                return (
                  <motion.g
                    key={community.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size + 20}
                      fill={community.color}
                      fillOpacity="0.1"
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size}
                      fill={community.color}
                      fillOpacity="0.3"
                      stroke={community.color}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + size + 25}
                      textAnchor="middle"
                      fill="hsl(220, 14%, 96%)"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {community.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + size + 40}
                      textAnchor="middle"
                      fill="hsl(220, 10%, 60%)"
                      fontSize="10"
                    >
                      {community.members.toLocaleString()} members
                    </text>
                  </motion.g>
                );
              })}

              {/* Small nodes */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2;
                const radius = 150 + Math.random() * 100;
                const x = 400 + Math.cos(angle) * radius;
                const y = 250 + Math.sin(angle) * radius * 0.6;
                
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={3 + Math.random() * 4}
                    fill={mockCommunities[i % mockCommunities.length].color}
                    fillOpacity={0.6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  />
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-2">Communities</p>
              <div className="space-y-2">
                {mockCommunities.slice(0, 5).map((community) => (
                  <div key={community.id} className="flex items-center gap-2">
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

      {/* Community Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCommunities.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all">
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
