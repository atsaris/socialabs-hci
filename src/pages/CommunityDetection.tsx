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

  // Resize graph otomatis mengikuti lebar layar
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

  // PERSIAPAN DATA GRAPH
  // PERSIAPAN DATA GRAPH
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    // DATA DUMMY NAMA USER TWITTER (REALISTIS - NAMA ORANG)
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

    // Fungsi helper untuk ambil random username
    const getRandomUsername = (index: number) => {
      // Kombinasi nama base + angka acak (biar kaya username asli)
      const baseName = randomUsernames[index % randomUsernames.length];
      const randomSuffix = Math.floor(Math.random() * 99);
      // Kadang pake suffix angka, kadang nggak (biar variatif)
      return Math.random() > 0.5 ? `@${baseName}${randomSuffix}` : `@${baseName}`;
    };

    // 1. Buat Node Influencer (Titik Pusat Komunitas)
    mockInfluencers.forEach((inf, i) => {
      const community = mockCommunities[i % mockCommunities.length];
      if (!community) return;

      nodes.push({
        id: inf.id,
        name: inf.username, // Nama Influencer tetap (e.g. Bobotoh Official)
        val: 30, 
        color: community.color,
        isInfluencer: true,
        communityId: community.id,
      });

      // Hubungkan Influencer satu sama lain (Core Connection)
      mockInfluencers.forEach((otherInf) => {
        if (inf.id !== otherInf.id) {
          links.push({
            source: inf.id,
            target: otherInf.id,
            color: "#e2e8f0", 
            width: 1,
            distance: 300,
          });
        }
      });
    });

    // 2. Buat Node User Biasa (Mengelilingi Influencer)
    let userGlobalIndex = 0; // Counter global

    mockCommunities.forEach((community) => {
      // Cari influencer komunitas ini
      const influencer = nodes.find(n => n.communityId === community.id && n.isInfluencer);
      if (!influencer) return;

      const numUsers = 15; // Jumlah user per komunitas
      for (let i = 0; i < numUsers; i++) {
        const userId = `user-${community.id}-${i}`;
        
        // GUNAKAN NAMA RANDOM ORANG
        const randomName = getRandomUsername(userGlobalIndex);
        userGlobalIndex++; 

        nodes.push({
          id: userId,
          name: randomName,
          val: 5, 
          color: community.color,
          isInfluencer: false,
          communityId: community.id,
        });

        // Hubungkan User ke Influencer (Star Topology)
        links.push({
          source: userId,
          target: influencer.id,
          color: community.color, 
          width: 0.5,
          distance: 50,
        });
      }
    });

    return { nodes, links };
  }, []);
  // Filter Data (Topik & Tweets) berdasarkan Komunitas yang dipilih di Graph
  const activeTopics = useMemo(() => {
    if (!selectedCommunity) return mockTopics;
    // Dummy logic: Geser array topik biar terlihat beda tiap komunitas
    const offset = parseInt(selectedCommunity);
    return [...mockTopics.slice(offset), ...mockTopics.slice(0, offset)];
  }, [selectedCommunity]);

  const activeTweets = useMemo(() => {
    if (!selectedCommunity) return mockTweets.slice(0, 3);
    return mockTweets.filter((_, i) => i % 2 !== 0).slice(0, 3); // Dummy filter
  }, [selectedCommunity]);

  const activeCommunityName = selectedCommunity 
    ? mockCommunities.find(c => c.id === selectedCommunity)?.name 
    : "All Communities";

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* HEADER */}
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

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Communities" value={mockCommunities.length} icon={Network} />
        <StatCard title="Total Nodes" value={graphData.nodes.length} icon={Users} />
        <StatCard title="Connections" value={graphData.links.length} icon={MessageSquare} />
        <StatCard title="Influencers" value={mockInfluencers.length} icon={User} />
      </div>

      {/* GRAPH VISUALIZATION SECTION */}
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
                    // Reset zoom kamera graph
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
          {/* Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <p className="text-xs font-bold text-slate-300 mb-2 uppercase">Communities</p>
            <div className="space-y-1">
              {mockCommunities.map((c) => (
                <div 
                  key={c.id} 
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors ${selectedCommunity === c.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => {
                     setSelectedCommunity(c.id);
                     // Optional: Zoom ke komunitas (logic butuh koordinat)
                  }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-xs text-slate-200">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* THE GRAPH ENGINE */}
          <ForceGraph2D
            ref={graphRef}
            width={containerWidth}
            height={550}
            graphData={graphData}
            nodeLabel="name"
            backgroundColor="#020617" // slate-950
            
            // Logic Gambar Node Custom
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name as string;
              const fontSize = 12 / globalScale;
              const isSelected = selectedCommunity === (node as any).communityId;
              
              // Efek redup jika ada komunitas lain yang dipilih
              const opacity = selectedCommunity && !isSelected ? 0.2 : 1;
              ctx.globalAlpha = opacity;

              // Gambar Lingkaran Node
              const radius = (node as any).isInfluencer ? 8 : 3;
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = (node as any).color;
              ctx.fill();
              
              // Border putih untuk Influencer
              if ((node as any).isInfluencer) {
                ctx.lineWidth = 2 / globalScale;
                ctx.strokeStyle = '#fff';
                ctx.stroke();
              }

              // Gambar Teks (Hanya untuk Influencer ATAU Node yang sedang di-hover/dipilih)
              if ((node as any).isInfluencer || node === (graphRef.current?.hoverNode?.())) {
                ctx.font = `${(node as any).isInfluencer ? 'bold' : ''} ${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                // Background teks hitam transparan agar terbaca
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(node.x! - bckgDimensions[0] / 2, node.y! - bckgDimensions[1] / 2 - radius - 4, bckgDimensions[0], bckgDimensions[1]);
                
                ctx.fillStyle = 'white';
                ctx.fillText(label, node.x!, node.y! - radius - 4);
              }
              
              ctx.globalAlpha = 1; // Reset opacity
            }}
            
            // Event Handlers
            onNodeClick={(node) => {
              setSelectedCommunity((node as any).communityId);
              graphRef.current?.centerAt(node.x, node.y, 1000);
              graphRef.current?.zoom(2, 1000);
            }}
            
            // Link Style
            linkColor={(link: any) => selectedCommunity && link.source.communityId !== selectedCommunity ? '#ffffff10' : link.color}
            linkWidth={(link: any) => (link.source as any).isInfluencer && (link.target as any).isInfluencer ? 1 : 0.5}
            activeParticleShading={selectedCommunity ? 0 : 4} // Efek partikel jalan di link
          />
        </CardContent>
      </Card>

      {/* BOTTOM SECTION: DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TOPICS DETAIL */}
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

        {/* TWEETS DETAIL */}
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