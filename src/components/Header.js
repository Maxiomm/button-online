import React from "react";

// Header component to display the counter, button, and timer
function Header({
  count,
  individualCount,
  cps,
  incrementCount,
  timeLeft,
  onlineCount,
  highScore,
  highScoreDate,
}) {
  return (
    <header className="App-header">
      <h1>{count}</h1>
      <div className="individual-count">Your clicks: {individualCount}</div>
      <div className="cps">{cps}</div>
      <button onClick={incrementCount}>Click</button>
      <div className="timer">Next reset in: {timeLeft}s</div>
      <div className="online-counter">{onlineCount} currently online</div>
      <div className="high-score">
        High-Score: {highScore} ({highScoreDate})
      </div>
    </header>
  );
}

export default Header;
