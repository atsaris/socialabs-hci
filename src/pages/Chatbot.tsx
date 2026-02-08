import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Lightbulb, TrendingUp, MessageSquare, Plus, History, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";
import { mockTopics, emotionData } from "@/data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: Date;
}

const Chatbot = () => {
  const { selectedProject } = useProject();
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("socialabs_chats");
    return saved ? JSON.parse(saved).map((s: any) => ({ 
      ...s, 
      date: new Date(s.date), 
      messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) 
    })) : [];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = activeSession?.messages || [];

  useEffect(() => {
    localStorage.setItem("socialabs_chats", JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: "New Chat",
      date: new Date(),
      messages: [{
        id: "1",
        role: "assistant",
        content: `Halo! 👋 Saya adalah AI assistant Socialabs yang siap membantu Anda memahami hasil analisis${selectedProject ? ` untuk project "${selectedProject.name}"` : ''}. Silakan ajukan pertanyaan tentang topik, sentimen, emosi, influencer, atau komunitas yang terdeteksi.`,
        timestamp: new Date(),
      }]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    if (activeSessionId === id) {
      setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null);
    }
  };

  useEffect(() => {
    if (sessions.length === 0) createNewChat();
    else if (!activeSessionId) setActiveSessionId(sessions[0].id);
  }, []);

  const projectQuestions = selectedProject ? [
    `Apa topik yang paling banyak dibicarakan tentang ${selectedProject.keywords[0]}?`,
    `Bagaimana sentimen publik terhadap ${selectedProject.keywords[0]}?`,
    `Siapa influencer yang paling berpengaruh di topik ${selectedProject.keywords[0]}?`,
    `Seberapa populer ${selectedProject.keywords[0]}?`,
  ] : ["Tolong pilih project terlebih dahulu"];

  const topicQuestions = mockTopics.slice(0, 2).map(topic => 
    `Jelaskan lebih detail tentang topik "${topic.name}"`
  );

  const allSuggestedQuestions = [...projectQuestions, ...topicQuestions];

  // --- FUNGSI HANDLESEND YANG SUDAH DIPERBAIKI ---
  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || !activeSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirstUserMsg = !s.messages.some(m => m.role === "user");
        return {
          ...s,
          title: isFirstUserMsg ? textToSend.substring(0, 30) : s.title,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const projectName = selectedProject?.name === "Persib Bandung" ? "Layvin Kurzawa" : (selectedProject?.name || "project ini");
      const inputLower = textToSend.toLowerCase();
      let response = "";

      // Logic Filter Jawaban agar "NYAMBUNG" dengan data dummy
      if (inputLower.includes("influencer")) {
        response = `Aktor kunci atau influencer yang paling berpengaruh dalam pusaran diskusi **${projectName}** adalah akun komunitas **@bandungfootball**. 

Akun ini terdeteksi memiliki *influence score* yang sangat tinggi (95/100) karena mampu menggerakkan opini massa dengan cepat dan memiliki engagement rate sebesar 4.5%. Selain itu, akun seperti @persib_update juga turut memberikan dampak besar. Jika Anda ingin melakukan strategi jangkauan, memantau narasi dari akun-akun ini sangat krusial karena jangkauan mereka yang luas ke basis pendukung utama.`;
      } 
      else if (inputLower.includes("sentimen")) {
        response = `Secara umum, sentimen publik terhadap **${projectName}** terpantau sangat sehat dan cenderung positif. Berdasarkan analisis dari **45.000 tweet**, sekitar **64% audiens memberikan respon positif**. 

Meskipun mayoritas menyambut dengan antusias, kita tetap perlu memperhatikan adanya **36% sentimen negatif**. Suara negatif ini terpantau bukan merupakan penolakan total, melainkan lebih ke arah kekhawatiran audiens terhadap riwayat cedera pemain atau detail finansial kontrak yang sempat ramai beredar di media sosial.`;
      }
      else if (inputLower.includes("populer") || inputLower.includes("seberapa")) {
        response = `Tingkat popularitas **${projectName}** saat ini sedang berada di puncaknya. Dengan volume percakapan mencapai **45.000 tweet** dalam periode analisis singkat ini, atensi audiens bisa dibilang sangat masif. 

Intensitas diskusi ini didorong oleh rasa penasaran tinggi, di mana topik mengenai kepindahan atau transfer pemain sendiri menyumbang lebih dari 41% total diskusi. Kepopuleran ini menandakan bahwa setiap detail kecil mengenai project ini memiliki potensi tinggi untuk menjadi trending topic di media sosial.`;
      }
      else if (inputLower.includes("topik")) {
        response = `Berdasarkan pantauan saya pada project **${projectName}**, saat ini terdapat **${mockTopics.length} topik utama** yang sedang hangat diperbincangkan. 

Diskusi paling dominan adalah topik **"${mockTopics[0].name}"**, yang mencakup sekitar **${mockTopics[0].percentage}%** dari total volume percakapan. Sebagian besar audiens membicarakan detail seperti ${mockTopics[0].keywords.slice(0,3).join(", ")}. Ada juga topik sekunder yang membahas performa teknis dan riwayat klub sang pemain sebelumnya.`;
      }
      else if (inputLower.includes("emosi")) {
        const joyValue = emotionData.find(e => e.name === "Joy")?.value || 35;
        response = `Jika kita membedah sisi emosional audiens, saat ini sedang didominasi oleh perasaan **Joy (Kegembiraan)** di angka **${joyValue}%**. 

Hal ini menunjukkan antusiasme yang kuat. Namun, menariknya ada emosi **Surprise (18%)** dan **Anger (15%)** yang muncul. Emosi Anger ini biasanya dipicu oleh perdebatan antar fans mengenai strategi transfer klub, sementara Surprise mencerminkan keterkejutan fans atas langkah tak terduga yang diambil dalam project ${projectName} ini.`;
      }
      else {
        response = `Terima kasih atas pertanyaannya mengenai project **${projectName}**! Secara keseluruhan, data analitik menunjukkan bahwa diskusi masih sangat aktif dengan sentimen **64% positif**. 

Saya bisa membedah data ini lebih jauh, misalnya mengenai detail topik yang sedang tren, siapa saja influencer utamanya, atau bagaimana distribusi emosi audiens saat ini. Ada bagian spesifik yang ingin Anda ketahui?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));
      setIsTyping(false);
    }, 1500);
  };
  // --- AKHIR FUNGSI HANDLESEND ---

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)] flex gap-6">
      {/* SIDEBAR HISTORY */}
      <div className="w-64 flex flex-col gap-4 flex-shrink-0">
        <Button onClick={createNewChat} className="w-full flex gap-2 gradient-primary text-white border-none shadow-md h-12">
          <Plus className="w-4 h-4" /> New Chat
        </Button>
        <Card className="flex-1 bg-card/50 border-border/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border/50 flex items-center gap-2 text-muted-foreground">
            <History className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Recent</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map(s => (
              <div key={s.id} className="group relative">
                <button
                  onClick={() => setActiveSessionId(s.id)}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-lg text-sm truncate pr-10 transition-all flex items-center gap-2",
                    activeSessionId === s.id ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <MessageSquare className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CHAT AREA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Chatbot</h1>
            <p className="text-muted-foreground text-sm">
              Ask anything about your social media analysis 
              {selectedProject && (
                <span className="text-primary"> — {selectedProject.name === "Persib Bandung" ? "Layvin Kurzawa" : selectedProject.name}</span>
              )}
            </p>
          </div>
        </div>

        <Card className="flex-1 flex flex-col bg-card border-border/50 overflow-hidden shadow-xl">
          <CardHeader className="border-b border-border/50 py-3 bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium">Socialabs Assistant</p>
                <p className="text-[10px] text-muted-foreground">AI-powered insights</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
            <AnimatePresence>
              {currentMessages.map((message, index) => (
                <div key={message.id} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "")}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", message.role === "user" ? "bg-primary" : "bg-muted")}>
                      {message.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-foreground" />}
                    </div>
                    <div className={cn("max-w-[75%] rounded-2xl px-4 py-3 text-sm border border-border/30", message.role === "user" ? "bg-primary text-white" : "bg-muted text-foreground")}>
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                      <p className="text-[10px] mt-2 opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>

                  {/* Dynamic Suggestions di bawah bubble bot terakhir */}
                  {message.role === "assistant" && index === currentMessages.length - 1 && index > 0 && !isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 ml-11">
                      {topicQuestions.map((q, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={() => handleSend(q)} className="text-[10px] h-7 border-primary/20 rounded-full py-0 px-3 hover:bg-primary/10 transition-colors">
                          <Lightbulb className="w-3 h-3 mr-1 text-primary" /> {q}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="flex gap-3 animate-pulse ml-1">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Bot className="w-4 h-4" /></div>
                <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-1 text-xs italic">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggested Awal */}
          {currentMessages.length <= 1 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Lightbulb className="w-3 h-3" />
                <span>Suggested questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allSuggestedQuestions.slice(0, 5).map((question, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={() => handleSend(question)} className="text-xs h-auto py-1.5 hover:bg-muted/50">{question}</Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-muted/20 border-t border-border/50">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanyakan detail analisis..." className="flex-1 bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary" disabled={isTyping} />
              <Button type="submit" disabled={!input.trim() || isTyping} className="gradient-primary text-white shadow-md">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Chatbot;