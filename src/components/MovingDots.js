import React, { useEffect, useRef, useMemo } from "react";

const MovingDots = () => {
  const canvasRef = useRef(null);

  // Helper function to generate a random gray color
  const getRandomGrayColor = () => {
    const grayValue = Math.floor(Math.random() * (200 - 100 + 1)) + 100; // Generate a random number between 100 and 200
    return `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.8)`; // Return the color in rgba format
  };

  // Initialize the dots using useMemo to avoid changing dependencies
  const dots = useMemo(() => {
    const numDots = 100;
    const newDots = [];
    for (let i = 0; i < numDots; i++) {
      newDots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 1,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * 2 * Math.PI,
        color: getRandomGrayColor(), // Assign a random gray color
      });
    }
    return newDots;
  }, []);

  // Draw the moving dots
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each dot
      dots.forEach((dot) => {
        // Update dot position based on speed and direction
        dot.x += dot.speed * Math.cos(dot.direction);
        dot.y += dot.speed * Math.sin(dot.direction);

        // Wrap around the screen
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color; // Use the random gray color
        ctx.fill();
      });

      // Request the next frame
      requestAnimationFrame(animate);
    };

    // Start the animation
    animate();

    // Adjust canvas size on window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dots]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default MovingDots;
