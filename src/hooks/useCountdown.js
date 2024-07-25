import { useState, useEffect, useCallback } from "react";

// Custom hook to manage a countdown timer that resets at a specified interval
export const useCountdown = (resetInterval) => {
  // State to keep track of the time left until the next reset
  const [timeLeft, setTimeLeft] = useState(
    getTimeUntilNextReset(resetInterval)
  );

  // Function to calculate the time in seconds until the next reset
  function getTimeUntilNextReset(interval) {
    const now = new Date();
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      Math.ceil(now.getMinutes() / interval) * interval,
      0,
      0
    );
    if (nextReset <= now) {
      nextReset.setMinutes(nextReset.getMinutes() + interval);
    }
    return Math.round((nextReset.getTime() - now.getTime()) / 1000);
  }

  // Function to schedule the next reset and update the time left
  const scheduleNextReset = useCallback(() => {
    const timeToNextReset = getTimeUntilNextReset(resetInterval);
    setTimeLeft(timeToNextReset);

    const timeoutId = setTimeout(() => {
      scheduleNextReset(); // Schedule the next reset after the current interval
    }, timeToNextReset * 1000); // Convert seconds to milliseconds

    return timeoutId;
  }, [resetInterval]);

  // Effect to start the countdown and set intervals to update the time left
  useEffect(() => {
    const timeoutId = scheduleNextReset();

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft =
          prevTimeLeft > 0
            ? prevTimeLeft - 1
            : getTimeUntilNextReset(resetInterval);
        //console.log("Time left:", newTimeLeft);
        return newTimeLeft;
      });
    }, 1000); // Update the time left every second

    // Clean up the timeout and interval on component unmount
    return () => {
      clearTimeout(timeoutId);
      clearInterval(timer);
    };
  }, [scheduleNextReset, resetInterval]);

  return timeLeft; // Return the time left to the component using the hook
};
