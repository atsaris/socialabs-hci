import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";
import { mockTopics } from "@/data/mockData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const { selectedProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Halo! 👋 Saya adalah AI assistant Socialabs yang siap membantu Anda memahami hasil analisis${selectedProject ? ` untuk project "${selectedProject.name}"` : ''}. Silakan ajukan pertanyaan tentang topik, sentimen, emosi, influencer, atau komunitas yang terdeteksi.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Project-based suggested questions
  const projectQuestions = selectedProject ? [
    `Apa topik yang paling banyak dibicarakan tentang ${selectedProject.keywords[0]}?`,
    `Bagaimana sentimen publik terhadap ${selectedProject.keywords[0]}?`,
    `Siapa influencer yang paling berpengaruh di topik ${selectedProject.keywords[0]}?`,
    `Berapa persentase sentimen positif tentang ${selectedProject.name}?`,
  ] : [
    "Tolong pilih project terlebih dahulu untuk melihat analisis",
  ];

  // Topic-based suggested questions
  const topicQuestions = mockTopics.slice(0, 2).map(topic => 
    `Jelaskan lebih detail tentang topik "${topic.name}"`
  );

  const allSuggestedQuestions = [...projectQuestions, ...topicQuestions];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "topik": `📊 Berdasarkan analisis project "${selectedProject?.name || 'yang dipilih'}", topik yang paling banyak dibicarakan adalah **${mockTopics[0].name}** dengan ${mockTopics[0].percentage}% dari total tweets. Topik ini mencakup diskusi tentang ${mockTopics[0].keywords.join(", ")}. Topik kedua terbanyak adalah **${mockTopics[1].name}** dengan ${mockTopics[1].percentage}%.`,
        "sentimen": `💭 Analisis sentimen untuk kata kunci "${selectedProject?.keywords[0] || 'yang dipilih'}" menunjukkan bahwa **64% tweets bersifat positif** dan **36% bersifat negatif**. Sentimen positif didominasi oleh antusiasme dan dukungan, sementara sentimen negatif lebih banyak terkait kekhawatiran dan kritik.`,
        "influencer": `👤 Influencer paling berpengaruh dalam topik ini adalah **@bobotoh_official** dengan influence score 95/100 dan 2.5M followers. Engagement rate-nya mencapai 4.5%, jauh di atas rata-rata. Influencer lainnya termasuk @persib_update dan @viking_persib.`,
        "emosi": `😊 Distribusi emosi menunjukkan **Joy** mendominasi dengan 35%, diikuti **Surprise** (18%), **Anger** (15%), dan emosi lainnya. Emosi positif lebih banyak muncul pada diskusi tentang performa, sementara anger lebih banyak pada topik kritik.`,
        "komunitas": `🌐 Terdeteksi ${mockTopics.length} komunitas utama: **Bobotoh Core** (15.2K members), **Analis Taktik** (8.9K), **Supporter Kritis** (6.7K), dan **Media Olahraga** (5.4K). Setiap komunitas memiliki topik diskusi dan karakteristik yang berbeda.`,
        "transfer": `⚽ Diskusi tentang **Transfer Pemain** mendominasi dengan 41% dari total tweets. Fans sangat antusias dengan kedatangan pemain baru dan banyak yang membahas pengalaman serta kualitas pemain dari klub sebelumnya.`,
        "positif": `✅ Dari analisis, **64% konten bersifat positif**. Kata-kata yang paling sering muncul dalam sentimen positif adalah: "keren", "mantap", "hebat", "bagus", dan "berkelas". Ini menunjukkan antusiasme tinggi dari audiens.`,
      };

      let response = `Terima kasih atas pertanyaannya tentang project "${selectedProject?.name || ''}"! `;
      
      const inputLower = input.toLowerCase();
      if (inputLower.includes("topik")) {
        response = responses["topik"];
      } else if (inputLower.includes("sentimen")) {
        response = responses["sentimen"];
      } else if (inputLower.includes("influencer")) {
        response = responses["influencer"];
      } else if (inputLower.includes("emosi")) {
        response = responses["emosi"];
      } else if (inputLower.includes("komunitas")) {
        response = responses["komunitas"];
      } else if (inputLower.includes("transfer")) {
        response = responses["transfer"];
      } else if (inputLower.includes("positif") || inputLower.includes("persentase")) {
        response = responses["positif"];
      } else {
        response = `Berdasarkan data yang tersedia untuk project "${selectedProject?.name || 'yang dipilih'}", saya dapat membantu Anda menganalisis:\n\n• **Topik** - ${mockTopics.length} topik utama teridentifikasi\n• **Sentimen** - 64% positif, 36% negatif\n• **Emosi** - Joy mendominasi dengan 35%\n• **Influencer** - 4 influencer utama teridentifikasi\n• **Komunitas** - 4 komunitas utama\n\nSilakan tanyakan lebih spesifik tentang aspek yang ingin Anda ketahui!`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Chatbot</h1>
          <p className="text-muted-foreground">
            Ask anything about your social media analysis
            {selectedProject && (
              <span className="text-primary"> — {selectedProject.name}</span>
            )}
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col bg-card border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 py-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Socialabs Assistant</p>
                <p className="text-xs text-muted-foreground">AI-powered insights</p>
              </div>
              {/* <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div> */}
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    message.role === "user" ? "bg-primary" : "bg-muted"
                  )}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={cn(
                      "text-[10px] mt-2",
                      message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <Lightbulb className="w-3 h-3" />
                <span>Suggested questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allSuggestedQuestions.slice(0, 5).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs h-auto py-1.5"
                  >
                    {question}
                  </Button>
                ))}
              </div>
              {mockTopics.length > 0 && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 mt-3">
                    <TrendingUp className="w-3 h-3" />
                    <span>Questions based on trending topics:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topicQuestions.map((question, index) => (
                      <Button
                        key={`topic-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-xs h-auto py-1.5"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="gradient-primary text-primary-foreground"
              >
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
