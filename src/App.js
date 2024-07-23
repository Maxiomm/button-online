import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import { useCountdown } from "./hooks/useCountdown";

function App() {
  // State to keep track of the count
  const [count, setCount] = useState(0);
  // State to determine if it is the initial load of the component
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // Use the custom hook to get the time left for the countdown
  const timeLeft = useCountdown(1);

  // Effect to read the saved count value from localStorage when the component mounts
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount !== null) {
      setCount(parseInt(savedCount, 10));
    }
    setIsInitialLoad(false); // Mark the initial load as complete
  }, []);

  // Effect to save the count value to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem("count", count);
    }
  }, [count, isInitialLoad]);

  // Function to increment the count
  const incrementCount = () => {
    setCount(count + 1);
  };

  // Effect to reset the count to 0 when the timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isInitialLoad) {
      console.log("reset du count.");
      setCount(0);
    }
  }, [timeLeft, isInitialLoad]);

  return (
    <div className="App">
      <Header
        count={count}
        incrementCount={incrementCount}
        timeLeft={timeLeft}
      />
    </div>
  );
}

export default App;
