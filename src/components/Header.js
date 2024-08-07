import React from "react";
import ThemeToggle from "./ThemeToggle";

function Header({ toggleTheme, isDarkMode }) {
  return (
    <header className="p-4 flex justify-between items-center z-10">
      <h1 className="text-4xl font-bold font-handwriting tracking-tighter select-none">
        BUTTON ONLINE
      </h1>
      <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </header>
  );
}

export default Header;
