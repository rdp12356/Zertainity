import { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CareerMatch } from "@/lib/scoringEngine";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AskMentorProps {
    resultId: string;
    topCareer: CareerMatch;
}

export const AskMentor = ({ resultId, topCareer }: AskMentorProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hi there! I'm your AI Career Mentor. I see your top match is **${topCareer.career}**. What specific questions do you have about this path, required exams, or future growth?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Please sign in to ask the mentor.");

            const response = await supabase.functions.invoke('ask-mentor', {
                body: {
                    resultId,
                    question: userMsg,
                    history: messages.slice(-4) // Send last 4 messages for context
                },
            });

            if (response.error) {
                throw new Error(response.error.message || "Failed to get response");
            }

            const answer = response.data?.answer || "I'm sorry, I couldn't process that right now.";
            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);

        } catch (err: any) {
            console.error("Mentor error:", err);
            toast.error(err.message || "Failed to ask mentor. Please try again.");
            // Remove the user message if it failed completely to avoid confusion, or leave it. 
            // We'll just leave it and let them try again.
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] border shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-4 pt-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Ask AI Mentor</CardTitle>
                        <CardDescription>Get personalised answers about your career path</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'
                                    }`}>
                                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-muted rounded-tl-none prose prose-sm dark:prose-invert prose-p:my-1 prose-strong:text-foreground'
                                    }`}>
                                    {/* Basic markdown parsing for bold text if needed, otherwise just text */}
                                    {msg.role === 'assistant' ? (
                                        <div dangerouslySetInnerHTML={{
                                            __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                                        }} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 shrink-0 rounded-full bg-muted border flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-muted rounded-tl-none flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="E.g. What is the average starting salary?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};
