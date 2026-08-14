



import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { MessageCircle, X, Send, Bot, ExternalLink, Target, Briefcase, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSupportChat } from "@/contexts/SupportChatContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`;

const normalizeInput = (input: string) => input.toLowerCase().replace(/\s+/g, " ").trim();

const getLocalSupportReply = (message: string) => {
  const q = normalizeInput(message);
  const includesAny = (...terms: string[]) => terms.some((term) => q.includes(term));

  if (!q) return "I can help with careers, exams, pathways, quiz results, account issues, and legal pages.";
  if (/\b(hi|hello|hey|namaste)\b/.test(q)) return "Hi. Ask me about careers, exams, quiz flow, account settings, or legal pages.";
  if (includesAny("founder", "founded", "who built", "creator", "johan")) {
    return "Zertainity was founded and built by Johan Manoj. His role is founder and lead developer of the platform.";
  }
  if (includesAny("start", "get started", "how to use", "begin")) {
    return "Start at /education-level, continue the quiz flow, and check recommendations on /results.";
  }
  if (includesAny("exam", "jee", "neet", "cat", "upsc", "clat", "gate")) {
    return "Use /exams to search exams, filter categories, and open official notice/apply links.";
  }
  if (includesAny("college", "colleges", "institution", "institutes", "pathway")) {
    return "Use /pathways to see career roadmaps, verified exams, and the colleges shown for each career.";
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
    return "For direct help, email support@zertainity.in or open /contact.";
  }

  return "I can answer questions about careers, exams, pathways, quiz flow, account access, and legal pages. For manual support, email support@zertainity.in.";
};

const normalizeRoute = (rawHref: string): { isInternal: boolean; targetRoute: string } => {
  let clean = (rawHref || "").trim();
  clean = clean.replace(/[.,)]+$/, "");

  if (!clean) return { isInternal: false, targetRoute: "" };

  if (clean.startsWith("/")) {
    return { isInternal: true, targetRoute: clean };
  }

  try {
    const url = new URL(clean);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.includes("zertainity") || host.endsWith(".local")) {
      const path = (url.pathname + url.search + url.hash) || "/";
      return { isInternal: true, targetRoute: path };
    }
  } catch {
    if (clean.startsWith("/") || clean.includes("localhost") || clean.includes("zertainity")) {
      const path = clean.replace(/^(https?:\/\/)?(localhost(:\d+)?|zertainity\.in)/, "");
      return { isInternal: true, targetRoute: path.startsWith("/") ? path : "/" + path };
    }
  }

  return { isInternal: false, targetRoute: clean };
};

function preprocessMessageContent(content: string): string {
  if (!content) return "";
  let result = content;

  // Convert raw URLs (http:// or https://) not in markdown links into markdown links
  result = result.replace(/(?<!\]\()(https?:\/\/[^\s<)]+)/gi, (url) => `[${url}](${url})`);

  // Convert standalone route paths (like /subject-quiz or /careers) into markdown links if not already wrapped
  const knownRoutes = [
    "/education-level",
    "/subject-quiz",
    "/subject-selection",
    "/grade-selection",
    "/marks-entry",
    "/careers",
    "/pathways",
    "/exams",
    "/results",
    "/quiz",
    "/platform",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/disclaimer",
    "/auth",
    "/settings",
  ];

  knownRoutes.forEach((route) => {
    if (result.includes(route)) {
      const escaped = route.replace(/\//g, "\\/");
      const pattern = "(?<!\\]\\(|`|\\[)" + escaped + "(?!\\)|`)";
      const regex = new RegExp(pattern, "g");
      result = result.replace(regex, `[${route}](${route})`);
    }
  });

  return result;
}

export const SupportChatbot = () => {
  const navigate = useNavigate();
  const { isOpen: open, setIsOpen: setOpen } = useSupportChat();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open, isLoading]);

  const send = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
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

        const lines = textBuffer.split("\n");
        textBuffer = lines.pop() ?? "";

        for (let line of lines) {
          if (line.endsWith("\r")) line = line.slice(0, -1);
          line = line.trim();
          if (!line || line.startsWith(":")) continue;
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
          } catch (e) {
            console.warn("Failed to parse SSE JSON chunk:", jsonStr, e);
          }
        }
      }

      if (!assistantSoFar.trim()) {
        setMessages((prev) => [...prev, { role: "assistant", content: getLocalSupportReply(text) }]);
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && assistantSoFar.trim()) {
          return prev;
        }
        return [...prev, { role: "assistant", content: getLocalSupportReply(text) }];
      });
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-4rem)] rounded-2xl border border-border bg-card shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white" />
              <span className="font-semibold text-white text-sm">Zertainity Support</span>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  aria-label="Clear chat"
                  className="text-white/70 hover:text-white text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Clear
                </button>
              )}
              <button onClick={() => setOpen(false)} aria-label="Close support chat" className="text-white/70 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="py-4 space-y-4">
                <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                  Ask about careers, exams, pathways, the quiz flow, or account settings.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: <><Target className="w-4 h-4 mr-1 inline-block" /> Take Quiz</>, route: "/education-level" },
                    { label: <><Briefcase className="w-4 h-4 mr-1 inline-block" /> Browse Careers</>, route: "/careers" },
                    { label: <><GraduationCap className="w-4 h-4 mr-1 inline-block" /> Entrance Exams</>, route: "/exams" },
                  ].map((nav) => (
                    <button
                      key={nav.route}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        navigate(nav.route);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-full border border-primary/20 transition-colors font-medium cursor-pointer"
                    >
                      {nav.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Suggested Questions</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "How do I retake the assessment?",
                      "What exams should I look at after 12th science?",
                      "Where can I find my saved results?",
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="text-left text-xs bg-muted/40 hover:bg-muted/80 text-foreground px-3 py-2 rounded-xl border border-border/60 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-border/40">
                  Need a human? Email <a href="mailto:support@zertainity.in" className="text-primary hover:underline">support@zertainity.in</a>
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                      : "bg-muted/30 text-slate-900 dark:text-slate-100 border border-border/40"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                        a: ({ href, children }) => {
                          const hrefStr = href || "";
                          const { isInternal, targetRoute } = normalizeRoute(hrefStr);

                          const handleRedirect = (e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(false);
                            if (isInternal && targetRoute) {
                              navigate(targetRoute);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            } else if (hrefStr) {
                              window.open(hrefStr, "_blank", "noopener,noreferrer");
                            }
                          };

                          return (
                            <a
                              href={hrefStr}
                              onClick={handleRedirect}
                              className="text-primary font-semibold underline hover:opacity-80 cursor-pointer inline text-left"
                            >
                              {children}
                            </a>
                          );
                        },
                        code: ({ children }) => {
                          const text = String(children).trim();
                          const { isInternal, targetRoute } = normalizeRoute(text);
                          if (isInternal && targetRoute && text.startsWith("/") && !text.includes(" ")) {
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpen(false);
                                  navigate(targetRoute);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="bg-primary/10 text-primary hover:bg-primary/20 px-1.5 py-0.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer inline-flex items-center gap-1 border border-primary/30"
                              >
                                {text}
                              </button>
                            );
                          }
                          return (
                            <code className="bg-muted/50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                          );
                        },
                      }}
                    >
                      {preprocessMessageContent(msg.content)}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted/30 border border-border/40 rounded-2xl px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
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
