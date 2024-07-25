import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import { useCountdown } from "./hooks/useCountdown";
import { useOnlineUsers } from "./hooks/useOnlineUsers";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";

function App() {
  /* -----------HOOKS----------- */

  // State to keep track of the count
  const [count, setCount] = useState(0);

  // State for the high score
  const [highScore, setHighScore] = useState(0);

  // State to determine if it is the initial load of the component
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track if reset has been done
  const [hasReset, setHasReset] = useState(false); // Track if reset has been done

  // Use the custom hook to get the time left for the countdown
  const timeLeft = useCountdown(1);

  // Use the custom hook to get the number of online people on the app
  const onlineCount = useOnlineUsers();

  /* -----------FIREBASE REFERENCES----------- */

  // Firebase reference for the click count
  const countRef = ref(database, "clickCount");

  // Firebase reference for the high score
  const highScoreRef = ref(database, "highScore");

  /* -----------METHODS----------- */

  // Function to increment the count
  const incrementCount = () => {
    set(countRef, count + 1); // Update the count in Firebase
  };

  // Effect to read the click count and high score values from Firebase when the component mounts
  useEffect(() => {
    onValue(countRef, (snapshot) => {
      if (snapshot.exists()) {
        setCount(snapshot.val()); // Update local state with the value from Firebase
      }
      setIsInitialLoad(false); // Mark the initial load as complete
    });

    onValue(highScoreRef, (snapshot) => {
      if (snapshot.exists()) {
        setHighScore(snapshot.val()); // Update local state with the high score from Firebase
      }
    });
  }, [countRef, highScoreRef]);

  // Effect to reset the count to 0 when the timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isInitialLoad && !hasReset) {
      //console.log("reset count");
      if (count > highScore) {
        set(highScoreRef, count); // Update the high score in Firebase if current count is higher
        setHighScore(count); // Update the local high score state
      }
      set(countRef, 0).then(() => {
        setCount(0); // Reset the count in Firebase
        setHasReset(true);
      });
    }
  }, [
    timeLeft,
    isInitialLoad,
    hasReset,
    count,
    highScore,
    countRef,
    highScoreRef,
  ]);

  // Effect to reset `hasReset` flag when `timeLeft` is no longer 0
  useEffect(() => {
    if (timeLeft !== 0 && hasReset) {
      setHasReset(false);
    }
  }, [timeLeft, hasReset]);

  /* -----------HTML----------- */

  return (
    <div className="App">
      <Header
        count={count}
        incrementCount={incrementCount}
        timeLeft={timeLeft}
        onlineCount={onlineCount}
        highScore={highScore}
      />
    </div>
  );
}

export default App;
