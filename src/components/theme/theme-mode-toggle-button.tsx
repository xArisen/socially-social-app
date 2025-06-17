"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useCallback } from "react";
import { Button } from "../ui/button/button";

export function ThemeModeToggleButton() {
  const { theme, setTheme } = useTheme();

  const handleChangeTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [setTheme, theme]);

  return (
    <Button variant="outline" size="icon" onClick={handleChangeTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
