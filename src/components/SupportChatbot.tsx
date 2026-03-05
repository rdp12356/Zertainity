import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mail, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

export const SupportChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerText = text.toLowerCase();
    let responseText = "I'm not sure I understand. Could you please rephrase or email us at zertainity@gmail.com for help?";

    if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      responseText = "Hello! Ask me any questions about Zertainity or our platform features. I can help explain how our career guidance works.";
    } else if (lowerText.includes("cost") || lowerText.includes("price") || lowerText.includes("free")) {
      responseText = "Zertainity is currently free to use! You can access all basic quizzes and career recommendations at no cost.";
    } else if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("support") || lowerText.includes("problem") || lowerText.includes("suggestion")) {
      responseText = "For problems, suggestions, or personalized guidance, you can email us at zertainity@gmail.com. We're here for you!";
    } else if (lowerText.includes("quiz") || lowerText.includes("assessment") || lowerText.includes("test")) {
      responseText = "Our Interest Assessment quiz evaluates your academic performance and subject interests to discover your true passions. It's the first step to unlocking your potential.";
    } else if (lowerText.includes("ai") || lowerText.includes("analysis") || lowerText.includes("algorithm")) {
      responseText = "Zertainity uses advanced AI-Powered Analysis to give you personalized career recommendations based on your unique profile and quiz results.";
    } else if (lowerText.includes("career") || lowerText.includes("explore") || lowerText.includes("pathway") || lowerText.includes("roadmap")) {
      responseText = "Zertainity provides detailed Career Pathways. These are comprehensive roadmaps that guide you from school all the way to your dream profession.";
    } else if (lowerText.includes("college") || lowerText.includes("university") || lowerText.includes("recommendation")) {
      responseText = "Based on your career goals, we provide Smart Recommendations to help you find the absolute best colleges tailored to your profile.";
    } else if (lowerText.includes("exam") || lowerText.includes("entrance")) {
      responseText = "Our platform offers detailed information on required entrance exams for various career paths and colleges.";
    } else if (lowerText.includes("works") || lowerText.includes("how it works") || lowerText.includes("feature")) {
      responseText = "Our intelligent platform guides you through a comprehensive assessment to unlock your potential. Features include Interest Assessment, AI-Powered Analysis, Career Pathways, and Smart Recommendations.";
    } else if (lowerText.includes("why") || lowerText.includes("choose") || lowerText.includes("benefit")) {
      responseText = "Why choose us? We offer comprehensive subject interest analysis, academic performance evaluation, AI-driven career matching, and standardized guidance from school to professional career levels.";
    } else if (lowerText.includes("what is") || lowerText.includes("about") || text.toLowerCase() === "zertainity") {
      responseText = "Zertainity is an AI-powered career guidance and educational pathway planning platform for students. We empower you to find your dream career with confidence!";
    } else if (lowerText.includes("founder") || lowerText.includes("creator") || lowerText.includes("who made") || lowerText.includes("built") || lowerText.includes("cto") || lowerText.includes("team") || lowerText.includes("viney") || lowerText.includes("johan")) {
      responseText = "Zertainity was founded by Viney Ragesh and Johan Manoj. Johan Manoj also serves as the CTO. They created this platform to empower students to find their perfect career path.";
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: responseText }
    ]);

    setIsLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] rounded-2xl border border-border bg-card shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-hero animate-gradient px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white" />
              <span className="font-semibold text-white text-sm">Zertainity Support</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <Bot className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Hi! 👋 I'm your Zertainity assistant. Ask me anything about careers, pathways, or the platform.</p>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>Or email us at <a href="mailto:zertainity@gmail.com" className="text-primary underline">zertainity@gmail.com</a></span>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-foreground border border-border/40"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted/30 border border-border/40 rounded-2xl px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-full bg-muted/20 border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
