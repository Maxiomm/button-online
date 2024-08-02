import React from "react";
import ThemeToggle from "./ThemeToggle";

function Header({ toggleTheme, isDarkMode }) {
  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Button Online</h1>
      <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </header>
  );
}

export default Header;
