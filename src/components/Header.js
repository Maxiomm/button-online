import React from "react";

// Header component to display the counter, button, and timer
function Header({ count, incrementCount, timeLeft, onlineCount }) {
  return (
    <header className="App-header">
      <h1>{count}</h1>
      <button onClick={incrementCount}>Click</button>
      <div className="timer">Next reset in: {timeLeft}s</div>
      <div className="online-counter">{onlineCount} currently online</div>
    </header>
  );
}

export default Header;
