import React from "react";

function Stats({
  count,
  individualCount,
  cps,
  timeLeft,
  onlineCount,
  highScore,
  highScoreDate,
  isDarkMode,
}) {
  return (
    <div
      className={`card w-full bg-base-100 shadow-xl my-4 border-2 ${
        isDarkMode ? "border-gray-800" : "border-gray-100"
      }`}
    >
      <div className="card-body">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              Total Clicks
            </div>
            <div className="stat-value flex items-center justify-center">
              {count}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              Individual Clicks
            </div>
            <div className="stat-value flex items-center justify-center">
              {individualCount}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              Clicks per Second
            </div>
            <div className="stat-value flex items-center justify-center">
              {cps}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              Time Left
            </div>
            <div className="stat-value flex items-center justify-center">
              {timeLeft}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              Online Users
            </div>
            <div className="stat-value flex items-center justify-center">
              {onlineCount}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title flex items-center justify-center">
              High Score
            </div>
            <div className="stat-value flex items-center justify-center">
              {highScore}
            </div>
            <div className="stat-desc flex items-center justify-center">
              on {highScoreDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
