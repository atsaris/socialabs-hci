import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ForceGraph2D from "react-force-graph-2d";
import { mockCommunities, mockInfluencers, mockTopics, mockTweets } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Users, MessageSquare, User, Tag, ChevronRight, Info } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { TweetCard } from "@/components/ui/tweet-card";
import { useProject } from "@/context/ProjectContext";

const CommunityDetection = () => {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const { selectedProject } = useProject();

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    const randomUsernames = [
      "adi_saputra", "budi_santoso", "citra_lestari", "dimas_pratama", "eka_susanti",
      "fajar_nugraha", "gita_pertiwi", "hendra_wijaya", "indah_cahya", "joko_prasetyo",
      "kartika_dewi", "lukman_hakim", "maya_sari", "novi_andriani", "oscar_mahendra",
      "putri_rahmadani", "rizky_fauzi", "siti_aminah", "teguh_wibowo", "usman_afandi",
      "vina_amelia", "wahyu_hidayat", "yusuf_pratama", "zainal_arifin", "asep_saepudin",
      "dadang_suhendar", "ujang_solihin", "deden_kurniawan", "cecep_mulyana", "elis_nurlaila",
      "neng_sri99", "kang_maman", "teh_rini", "mang_oleh", "bi_ijah", "gilang_ramadhan",
      "hani_handayani", "indra_kusuma", "jessica_mila", "kiki_fatmala"
    ];

    const getRandomUsername = (index: number) => {
      const baseName = randomUsernames[index % randomUsernames.length];
      const randomSuffix = Math.floor(Math.random() * 99);
      return Math.random() > 0.5 ? `@${baseName}${randomSuffix}` : `@${baseName}`;
    };

    mockInfluencers.forEach((inf, i) => {
      const community = mockCommunities[i % mockCommunities.length];
      if (!community) return;

      nodes.push({
        id: inf.id,
        name: inf.username,
        val: 30, 
        color: community.color,
        isInfluencer: true,
        communityId: community.id,
      });

      mockInfluencers.forEach((otherInf) => {
        if (inf.id !== otherInf.id) {
          links.push({
            source: inf.id,
            target: otherInf.id,
            color: "#ffffff20", // Ditingkatkan sedikit agar lebih kelihatan
            width: 1,
            distance: 250, // Dirapatkan sedikit antar influencer
          });
        }
      });
    });

    let userGlobalIndex = 0;
    mockCommunities.forEach((community) => {
      const influencer = nodes.find(n => n.communityId === community.id && n.isInfluencer);
      if (!influencer) return;

      const numUsers = 15;
      const communityUsers: any[] = [];

      for (let i = 0; i < numUsers; i++) {
        const userId = `user-${community.id}-${i}`;
        const randomName = getRandomUsername(userGlobalIndex);
        userGlobalIndex++; 

        const newUserNode = {
          id: userId,
          name: randomName,
          val: 5, 
          color: community.color,
          isInfluencer: false,
          communityId: community.id,
        };
        
        nodes.push(newUserNode);
        communityUsers.push(newUserNode);

        links.push({
          source: userId,
          target: influencer.id,
          color: community.color, 
          width: 0.8, // Garis lebih tebal
          distance: 40, // Jarak ke influencer lebih rapat (sebelumnya 70)
        });

        if (i > 0) {
          links.push({
            source: userId,
            target: communityUsers[i - 1].id,
            color: `${community.color}70`, // Opacity ditingkatkan agar garis mesh terlihat
            width: 0.4,
            distance: 30, // Jarak antar user lebih rapat (sebelumnya 50)
          });
        }
        if (i > 2) {
          links.push({
            source: userId,
            target: communityUsers[Math.floor(Math.random() * (i - 1))].id,
            color: `${community.color}50`, // Opacity ditingkatkan
            width: 0.3,
            distance: 35, // Jarak acak lebih rapat (sebelumnya 60)
          });
        }
      }
    });

    return { nodes, links };
  }, []);

  const activeTopics = useMemo(() => {
    if (!selectedCommunity) return mockTopics;
    const offset = parseInt(selectedCommunity);
    return [...mockTopics.slice(offset), ...mockTopics.slice(0, offset)];
  }, [selectedCommunity]);

  const activeTweets = useMemo(() => {
    if (!selectedCommunity) return mockTweets.slice(0, 3);
    return mockTweets.filter((_, i) => i % 2 !== 0).slice(0, 3);
  }, [selectedCommunity]);

  const activeCommunityName = selectedCommunity 
    ? mockCommunities.find(c => c.id === selectedCommunity)?.name 
    : "All Communities";

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">Community Detection</h1>
          <Badge variant="secondary" className="text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            <Tag className="w-3 h-3 mr-1" />
            Layvin Kurzawa
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Identify groups and influencers involved in the discussion
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Communities" value={mockCommunities.length} icon={Network} />
        <StatCard title="Total Nodes" value={graphData.nodes.length} icon={Users} />
        <StatCard title="Connections" value={graphData.links.length} icon={Network} />
        <StatCard title="Influencers" value={mockInfluencers.length} icon={User} />
      </div>

      <Card className="bg-card border-border/50 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              Social Network Graph
            </CardTitle>
            <div className="flex gap-2">
               {selectedCommunity && (
                <Badge 
                  variant="destructive" 
                  className="cursor-pointer" 
                  onClick={() => {
                    setSelectedCommunity(null);
                    graphRef.current?.zoomToFit(400); 
                  }}
                >
                  Reset Filter ✕
                </Badge>
               )}
               <Badge variant="outline" className="gap-1">
                 <Info className="w-3 h-3" />
                 Drag nodes to interact
               </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 relative bg-slate-950" ref={containerRef}>
          <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase">Communities</p>
            <div className="space-y-1">
              {mockCommunities.map((c) => (
                <div 
                  key={c.id} 
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${selectedCommunity === c.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => setSelectedCommunity(c.id)}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs text-slate-200">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <ForceGraph2D
            ref={graphRef}
            width={containerWidth}
            height={550}
            graphData={graphData}
            nodeLabel="name"
            backgroundColor="#020617"
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name as string;
              const fontSize = 12 / globalScale;
              const isSelected = selectedCommunity === (node as any).communityId;
              const opacity = selectedCommunity && !isSelected ? 0.2 : 1;
              ctx.globalAlpha = opacity;

              const radius = (node as any).isInfluencer ? 8 : 3;
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = (node as any).color;
              ctx.fill();
              
              if ((node as any).isInfluencer) {
                ctx.lineWidth = 2 / globalScale;
                ctx.strokeStyle = '#fff';
                ctx.stroke();
              }

              if ((node as any).isInfluencer || node === (graphRef.current?.hoverNode?.())) {
                ctx.font = `${(node as any).isInfluencer ? 'bold' : ''} ${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2 - radius - 4, bckgDimensions[0], bckgDimensions[1]);
                
                ctx.fillStyle = 'white';
                ctx.fillText(label, node.x!, node.y! - radius - 4);
              }
              ctx.globalAlpha = 1;
            }}
            onNodeClick={(node) => {
              setSelectedCommunity((node as any).communityId);
              graphRef.current?.centerAt(node.x, node.y, 1000);
              graphRef.current?.zoom(2, 1000);
            }}
            // linkColor ditingkatkan agar garis tetap tajam meskipun difilter
            linkColor={(link: any) => selectedCommunity && link.source.communityId !== selectedCommunity ? '#ffffff05' : link.color}
            linkWidth={(link: any) => (link.source as any).isInfluencer && (link.target as any).isInfluencer ? 1.5 : 1}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Trending Topics in {activeCommunityName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTopics.slice(0, 4).map((topic, i) => (
              <div key={topic.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">#{topic.name}</span>
                  <span className="text-muted-foreground">{topic.tweetsCount.toLocaleString()} tweets</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.percentage}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
            <button className="w-full mt-4 text-sm text-primary flex items-center justify-center hover:underline">
              View All Topics <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Conversation in {activeCommunityName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDetection;