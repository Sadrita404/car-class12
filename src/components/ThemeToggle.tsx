import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const THEME_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  return (
    <div className="fixed top-4 right-4 z-20">
      <Toggle
        aria-label="Toggle theme"
        pressed={theme === "dark"}
        onPressedChange={(pressed: boolean) => setTheme(pressed ? "dark" : "light")}
        className="h-10 w-10 p-1 flex items-center justify-center"
      >
        {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </Toggle>
    </div>
  );
}
