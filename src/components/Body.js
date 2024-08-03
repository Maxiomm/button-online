import React, { useState, useEffect, useCallback, useRef } from "react";
import Confetti from "react-confetti";
import Header from "./Header";
import Stats from "./Stats";
import ClickButton from "./ClickButton";
import MovingDots from "./MovingDots";
import { useCountdown } from "../hooks/useCountdown";
import { useOnlineUsers } from "../hooks/useOnlineUsers";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase";

function Body() {
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

  // State to change UI mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // State to know if it's a HighScore for confetti display
  const [isHighScore, setIsHighScore] = useState(false);

  // Use the custom hook to get the time left for the countdown
  const timeLeft = useCountdown(1, () => {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000; // Time elapsed in seconds
      setCps((individualCount / elapsedTime).toFixed(2)); // Calculate CPS and format to 2 decimal places
    }
  });

  // Use the custom hook to get the number of online people on the app
  const onlineCount = useOnlineUsers();

  // Audio reference for cheering sounds when the HighScore is beaten
  const audioRef = useRef(null);

  // State to change opacity of the confettis
  const [confettiOpacity, setConfettiOpacity] = useState(1);

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

  // Function to reset the counter if needed based on the last reset date and time
  const resetCounterIfNeeded = useCallback(
    (lastResetDate) => {
      const now = new Date();
      const nowString = now.toISOString().slice(0, 16);
      if (lastResetDate !== nowString) {
        const currentHighScore = highScore;
        if (count > currentHighScore) {
          const currentDate = now.toLocaleDateString();
          set(highScoreRef, count);
          set(highScoreDateRef, currentDate);
          setHighScore(count);
          setHighScoreDate(currentDate);
          setConfettiOpacity(1); // Reset conffeti opacity
          setIsHighScore(true); // Set the flag to trigger confetti and sound
        }
        set(countRef, 0).then(() => {
          setCount(0);
          setIndividualCount(0);
          setStartTime(null);
          setCps(0);
          setHasReset(true);
        });
        set(lastResetDateRef, nowString);
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

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

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
        const now = new Date();
        const nowString = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
        set(lastResetDateRef, nowString);
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
      const currentHighScore = highScore; // Use local state instead of Firebase query
      if (count > currentHighScore) {
        const currentDate = new Date().toLocaleDateString(); // Get current date
        set(highScoreRef, count); // Update the high score in Firebase if current count is higher
        set(highScoreDateRef, currentDate); // Update the high score date in Firebase
        setHighScore(count); // Update the local high score state
        setHighScoreDate(currentDate); // Update the local high score date
        setConfettiOpacity(1); // Reset conffeti opacity
        setIsHighScore(true); // Set the flag to trigger confetti
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

  // Effect to apply the saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      setIsDarkMode(isDark);
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }
  }, []);

  // Handle confetti cleanup after display
  useEffect(() => {
    if (isHighScore) {
      if (audioRef.current) {
        audioRef.current.play();
      }

      const fadeOutInterval = setInterval(() => {
        setConfettiOpacity((prevOpacity) => {
          if (prevOpacity > 0) {
            return prevOpacity - 0.025; // Réduire l'opacité progressivement
          } else {
            clearInterval(fadeOutInterval);
            return 0;
          }
        });
      }, 100); // Intervalle de 100ms pour réduire l'opacité

      const timer = setTimeout(() => {
        setIsHighScore(false);
        setConfettiOpacity(1); // Reset conffeti opacity
      }, 4000); // Display confetti for 4 seconds

      return () => {
        clearTimeout(timer);
        clearInterval(fadeOutInterval);
      };
    }
  }, [isHighScore, startTime]);

  /* -----------HTML----------- */

  return (
    <div className="relative flex flex-col h-screen bg-base-100 dark:bg-gray-900 w-full overflow-hidden">
      {isHighScore && (
        <Confetti
          opacity={confettiOpacity}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
      <audio ref={audioRef} src="sounds/cheer.mp3" />
      <MovingDots />
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="flex-grow flex justify-center items-center h-full mt-20">
        <ClickButton incrementCount={incrementCount} />
      </div>
      <div className="w-full flex justify-center mb-4">
        <div className="max-w-5xl w-full">
          <Stats
            count={count}
            individualCount={individualCount}
            cps={cps}
            timeLeft={timeLeft}
            onlineCount={onlineCount}
            highScore={highScore}
            highScoreDate={highScoreDate}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default Body;
