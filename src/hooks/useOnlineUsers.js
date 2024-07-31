import { useState, useEffect } from "react";
import { ref, onValue, push, set, onDisconnect, off } from "firebase/database";
import { database } from "../firebase";

// Custom hook to manage online users count
export const useOnlineUsers = () => {
  // State to keep track of the online user count
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Reference to the special Firebase path that indicates connection status
    const onlineRef = ref(database, ".info/connected");

    // Reference to the path where online users are stored
    const userRef = ref(database, "onlineUsers");

    // Handler for connection status changes
    const handleConnectionStatus = (snapshot) => {
      if (snapshot.val() === true) {
        const newUserRef = push(userRef);
        set(newUserRef, true);
        onDisconnect(newUserRef).remove();
      }
    };

    // Handler for changes in the online user count
    const handleUserCount = (snapshot) => {
      if (snapshot.exists()) {
        setOnlineCount(snapshot.size);
      } else {
        setOnlineCount(0);
      }
    };

    // Attach the handlers to the Firebase references
    onValue(onlineRef, handleConnectionStatus);
    onValue(userRef, handleUserCount);

    // Cleanup function to detach handlers when the component unmounts
    return () => {
      off(onlineRef, "value", handleConnectionStatus);
      off(userRef, "value", handleUserCount);
    };
  }, []);

  // Return the current online user count
  return onlineCount;
};
