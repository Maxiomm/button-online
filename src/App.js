import React, { useState, useEffect, useCallback } from "react";
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

  // State to keep track of the individual count
  const [individualCount, setIndividualCount] = useState(0);

  // State for start time
  const [startTime, setStartTime] = useState(null);

  // State to keep track of clicks per second
  const [cps, setCps] = useState(0);

  // State for the high score
  const [highScore, setHighScore] = useState(0);

  // State for the high score date
  const [highScoreDate, setHighScoreDate] = useState("");

  // State to determine if it is the initial load of the component
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track if reset has been done
  const [hasReset, setHasReset] = useState(false); // Track if reset has been done

  // Use the custom hook to get the time left for the countdown
  const timeLeft = useCountdown(1, () => {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000; // Time elapsed in seconds
      setCps((individualCount / elapsedTime).toFixed(2)); // Calculate CPS and format to 2 decimal places
    }
  });

  // Use the custom hook to get the number of online people on the app
  const onlineCount = useOnlineUsers();

  /* -----------FIREBASE REFERENCES----------- */

  // Firebase reference for the click count
  const countRef = ref(database, "clickCount");

  // Firebase reference for the high score
  const highScoreRef = ref(database, "highScore");

  // Firebase reference for the high score date
  const highScoreDateRef = ref(database, "highScoreDate");

  // Firebase reference for the last reset date
  const lastResetDateRef = ref(database, "lastResetDate");

  /* -----------METHODS----------- */

  // Function to increment the count
  const incrementCount = () => {
    set(countRef, count + 1); // Update the count in Firebase
    setIndividualCount((prevCount) => prevCount + 1); // Update the local individual count
    if (!startTime) {
      setStartTime(Date.now()); // Set start time if not already set
    }
  };

  // Function to reset the counter if needed based on the last reset date
  const resetCounterIfNeeded = useCallback(
    (lastResetDate) => {
      const today = new Date().toISOString().split("T")[0];
      if (lastResetDate !== today) {
        if (count > highScore) {
          const currentDate = new Date().toLocaleDateString();
          set(highScoreRef, count);
          set(highScoreDateRef, currentDate);
          setHighScore(count);
          setHighScoreDate(currentDate);
        }
        set(countRef, 0);
        set(lastResetDateRef, today);
        setCount(0);
        setIndividualCount(0);
        setStartTime(null);
        setCps(0);
      }
    },
    [
      count,
      highScore,
      highScoreRef,
      highScoreDateRef,
      countRef,
      lastResetDateRef,
    ]
  );

  // Effect to read the values from Firebase when the component mounts
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

    onValue(highScoreDateRef, (snapshot) => {
      if (snapshot.exists()) {
        setHighScoreDate(snapshot.val());
      }
    });

    onValue(lastResetDateRef, (snapshot) => {
      if (snapshot.exists()) {
        resetCounterIfNeeded(snapshot.val());
      } else {
        // If the last reset date does not exist, initialize it
        const today = new Date().toISOString().split("T")[0];
        set(lastResetDateRef, today);
      }
    });
  }, [
    countRef,
    highScoreRef,
    highScoreDateRef,
    lastResetDateRef,
    resetCounterIfNeeded,
  ]);

  // Effect to reset the count to 0 when the timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !isInitialLoad && !hasReset) {
      //console.log("reset count");
      if (count > highScore) {
        const currentDate = new Date().toLocaleDateString(); // Get current date
        set(highScoreRef, count); // Update the high score in Firebase if current count is higher
        set(highScoreDateRef, currentDate); // Update the high score date in Firebase
        setHighScore(count); // Update the local high score state
        setHighScoreDate(currentDate); // Update the local high score date
      }
      set(countRef, 0).then(() => {
        setCount(0); // Reset the count in Firebase
        setIndividualCount(0); // Reset the individual count
        setStartTime(null); // Reset start time
        setCps(0); // Reset CPS
        setHasReset(true); // Indicate that reset has been done
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
    highScoreDateRef,
  ]);

  // Effect to reset `hasReset` flag when `timeLeft` is no longer 0
  useEffect(() => {
    if (timeLeft !== 0 && hasReset) {
      setHasReset(false);
    }
  }, [timeLeft, hasReset]);

  // Effet pour mettre à jour le CPS toutes les 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) {
        const elapsedTime = (Date.now() - startTime) / 1000; // Time elapsed in seconds
        setCps((individualCount / elapsedTime).toFixed(2)); // Calculate CPS and format to 2 decimal places
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [startTime, individualCount]);

  /* -----------HTML----------- */

  return (
    <div className="App">
      <Header
        count={count}
        individualCount={individualCount}
        cps={cps}
        incrementCount={incrementCount}
        timeLeft={timeLeft}
        onlineCount={onlineCount}
        highScore={highScore}
        highScoreDate={highScoreDate}
      />
    </div>
  );
}

export default App;
