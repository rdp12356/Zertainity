import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Check localStorage and system preference on mount
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = stored || (prefersDark ? "dark" : "light");
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        // Apply theme to document and save to localStorage
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const setLightTheme = () => setTheme("light");
    const setDarkTheme = () => setTheme("dark");

    return { theme, toggleTheme, setTheme, setLightTheme, setDarkTheme };
}
