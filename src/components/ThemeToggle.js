import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function ThemeToggle({ toggleTheme, isDarkMode }) {
  return (
    <label className="swap swap-rotate">
      {/* This hidden checkbox controls the state */}
      <input type="checkbox" onChange={toggleTheme} checked={isDarkMode} />

      {/* Sun Icon */}
      <FontAwesomeIcon
        icon={faSun}
        className="swap-on fill-current w-10 h-10 text-yellow-500"
      />

      {/* Moon Icon */}
      <FontAwesomeIcon
        icon={faMoon}
        className="swap-off fill-current w-10 h-10 text-gray-800"
      />
    </label>
  );
}

export default ThemeToggle;
