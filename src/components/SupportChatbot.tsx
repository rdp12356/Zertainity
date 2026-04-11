import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mail, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

const normalizeInput = (input: string) => input.toLowerCase().replace(/\s+/g, " ").trim();

const getLocalSupportReply = (message: string) => {
  const q = normalizeInput(message);
  const includesAny = (...terms: string[]) => terms.some((term) => q.includes(term));

  if (!q) return "I can help with careers, exams, pathways, quiz results, account issues, and legal pages.";
  if (/\b(hi|hello|hey|namaste)\b/.test(q)) return "Hi. Ask me about careers, exams, quiz flow, account settings, or legal pages.";
  if (includesAny("founder", "founded", "who built", "creator", "viney", "johan")) {
    return "Zertainity was founded and built by Viney Ragesh and Johan Manoj. Their roles are co-founders and core developers of the platform.";
  }
  if (includesAny("start", "get started", "how to use", "begin")) {
    return "Start at /education-level, continue the quiz flow, and check recommendations on /results.";
  }
  if (includesAny("exam", "jee", "neet", "cat", "upsc", "clat", "gate")) {
    return "Use /exams to search exams, filter categories, and open official notice/apply links.";
  }
  if (includesAny("career", "careers", "job", "profession")) {
    return "Use /careers to browse options and /pathways for detailed career paths.";
  }
  if (includesAny("login", "sign in", "sign up", "password", "account", "auth")) {
    return "Use /auth for sign in/up and forgot password. Manage profile settings in /settings.";
  }
  if (includesAny("privacy", "terms", "disclaimer", "policy", "legal")) {
    return "Legal pages are /privacy-policy, /terms-of-service, and /disclaimer.";
  }
  if (includesAny("contact", "email", "support", "help", "bug", "issue")) {
    return "For direct help, email zertainity@gmail.com or open /contact.";
  }

  return "I can answer questions about careers, exams, pathways, quiz flow, account access, and legal pages. For manual support, email zertainity@gmail.com.";
};

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

    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      if (!import.meta.env.VITE_SUPABASE_URL?.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: getLocalSupportReply(text) }]);
        return;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(supabaseKey ? { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } : {}),
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok) {
        throw new Error(`Support endpoint failed (${resp.status})`);
      }

      if (!resp.body) {
        setMessages((prev) => [...prev, { role: "assistant", content: getLocalSupportReply(text) }]);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: getLocalSupportReply(text) },
      ]);
    } finally {
      setIsLoading(false);
    }
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
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
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
