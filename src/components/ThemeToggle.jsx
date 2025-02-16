import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState("light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </Button>
  );
};

export default ThemeToggle;
