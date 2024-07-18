import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // Read the saved value when the component mounts
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount !== null) {
      setCount(parseInt(savedCount, 10));
    }
    const initialTimeLeft = getTimeUntilNextReset();
    setTimeLeft(initialTimeLeft);
    setIsInitialLoad(false);
  }, []);

  // Save the count value whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("count", count);
    }
  }, [count, isInitialLoad]);

  // Counter incrementation
  const incrementCount = () => {
    setCount(count + 1);
  };

  // Calculate the time in seconds until the next reset time
  function getTimeUntilNextReset() {
    const now = new Date();
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      Math.ceil(now.getMinutes() / 5) * 5,
      0,
      0
    );
    if (nextReset <= now) {
      nextReset.setMinutes(nextReset.getMinutes() + 5);
    }
    return Math.round((nextReset.getTime() - now.getTime()) / 1000);
  }

  const scheduleNextReset = useCallback(() => {
    const timeToNextReset = getTimeUntilNextReset();
    setTimeLeft(timeToNextReset);

    const timeoutId = setTimeout(() => {
      setCount(0);
      scheduleNextReset();
    }, timeToNextReset * 1000); // Convert seconds to milliseconds

    return timeoutId;
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      // Schedule the initial reset
      const timeoutId = scheduleNextReset();

      // Update the countdown timer every second
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 1) {
            return prevTimeLeft - 1;
          } else {
            const newTimeLeft = getTimeUntilNextReset();
            return newTimeLeft; // Reset timeLeft to the next period
          }
        });
      }, 1000);

      // Clear the interval and timeout on component unmount
      return () => {
        clearTimeout(timeoutId);
        clearInterval(timer);
      };
    }
  }, [isInitialLoad, scheduleNextReset]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{count}</h1>
        <button onClick={incrementCount}>Click</button>
        <div className="timer">Next reset in: {timeLeft}s</div>
      </header>
    </div>
  );
}

export default App;
