import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useSupportChat } from "@/contexts/SupportChatContext";

export const FloatingThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const { isOpen } = useSupportChat();
  if (isOpen) return null;
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
};
