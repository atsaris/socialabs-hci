import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Apa topik yang paling banyak dibicarakan?",
  "Bagaimana sentimen audiens terhadap teknologi AI?",
  "Siapa influencer paling berpengaruh dalam topik ini?",
  "Berapa persentase tweet dengan emosi positif?",
  "Jelaskan komunitas yang terbentuk dalam data ini",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Halo! 👋 Saya adalah AI assistant yang siap membantu Anda memahami hasil analisis media sosial. Silakan ajukan pertanyaan tentang topik, sentimen, emosi, influencer, atau komunitas yang terdeteksi.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        "topik": "📊 Berdasarkan analisis, topik yang paling banyak dibicarakan adalah **Teknologi AI** dengan 28% dari total tweets, diikuti oleh **Ekonomi Digital** (22%) dan **Kebijakan Pemerintah** (18%). Topik AI mendominasi karena banyak diskusi tentang perkembangan teknologi dan dampaknya terhadap industri.",
        "sentimen": "💭 Analisis sentimen menunjukkan bahwa 45% tweets bersifat **positif**, 30% **netral**, dan 25% **negatif**. Sentimen positif didominasi oleh excitement terhadap inovasi teknologi, sementara sentimen negatif lebih banyak terkait kekhawatiran dampak AI terhadap pekerjaan.",
        "influencer": "👤 Influencer paling berpengaruh adalah **@influencer_tech** dengan influence score 95/100 dan 2.5M followers. Engagement rate-nya mencapai 4.5%, jauh di atas rata-rata. Tweet-nya tentang teknologi AI sering menjadi viral dan banyak di-retweet.",
        "emosi": "😊 Distribusi emosi menunjukkan **Joy** mendominasi dengan 35%, diikuti **Surprise** (18%), **Anger** (15%), dan emosi lainnya. Emosi positif lebih banyak muncul pada diskusi tentang inovasi, sementara anger lebih banyak pada topik kebijakan.",
        "komunitas": "🌐 Terdeteksi 5 komunitas utama: **Tech Enthusiasts** (12.5K members), **Business Leaders** (8.9K), **Policy Watchers** (6.7K), **Education Advocates** (5.4K), dan **Health Professionals** (4.2K). Setiap komunitas memiliki topik diskusi yang berbeda-beda.",
      };

      let response = "Terima kasih atas pertanyaannya! ";
      
      if (input.toLowerCase().includes("topik")) {
        response = responses["topik"];
      } else if (input.toLowerCase().includes("sentimen")) {
        response = responses["sentimen"];
      } else if (input.toLowerCase().includes("influencer")) {
        response = responses["influencer"];
      } else if (input.toLowerCase().includes("emosi") || input.toLowerCase().includes("positif")) {
        response = responses["emosi"];
      } else if (input.toLowerCase().includes("komunitas")) {
        response = responses["komunitas"];
      } else {
        response = "Berdasarkan data yang tersedia, saya dapat membantu Anda menganalisis:\n\n• **Topik** - 6 topik utama teridentifikasi\n• **Sentimen** - 45% positif, 30% netral, 25% negatif\n• **Emosi** - Joy mendominasi dengan 35%\n• **Influencer** - 156 influencer teridentifikasi\n• **Komunitas** - 5 komunitas utama\n\nSilakan tanyakan lebih spesifik tentang aspek yang ingin Anda ketahui!";
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
            Tanyakan apapun tentang hasil analisis media sosial Anda
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
                <p className="text-sm font-medium">SocialX Assistant</p>
                <p className="text-xs text-muted-foreground">AI-powered insights</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
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
                <span>Pertanyaan yang disarankan:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
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
