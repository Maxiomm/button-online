import React from "react";

function Stats({
  count,
  individualCount,
  cps,
  timeLeft,
  onlineCount,
  highScore,
  highScoreDate,
}) {
  return (
    <div className="card w-full bg-base-100 shadow-xl my-4">
      <div className="card-body">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Clicks</div>
            <div className="stat-value">{count}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Individual Clicks</div>
            <div className="stat-value">{individualCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Clicks per Second</div>
            <div className="stat-value">{cps}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Time Left</div>
            <div className="stat-value">{timeLeft}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Online Users</div>
            <div className="stat-value">{onlineCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">High Score</div>
            <div className="stat-value">{highScore}</div>
            <div className="stat-desc">on {highScoreDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
