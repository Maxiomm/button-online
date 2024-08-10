import React, { useEffect, useRef, useState } from "react";
import amongUsImage1 from "../assets/images/amongus_1.webp";
import amongUsImage2 from "../assets/images/amongus_2.webp";
import amongUsImage3 from "../assets/images/amongus_3.webp";
import amongUsImage4 from "../assets/images/amongus_4.webp";
import amongUsImage5 from "../assets/images/amongus_5.webp";
import amongUsImage6 from "../assets/images/amongus_6.webp";
import amongUsImage7 from "../assets/images/amongus_7.webp";
import amongUsImage8 from "../assets/images/amongus_8.webp";
import amongUsImage9 from "../assets/images/amongus_9.webp";
import amongUsImage10 from "../assets/images/amongus_10.webp";
import amongUsImage11 from "../assets/images/amongus_11.webp";
import amongUsImage12 from "../assets/images/amongus_12.webp";
import amongUsImage13 from "../assets/images/amongus_13.webp";

const amongUsImages = [
  amongUsImage1,
  amongUsImage2,
  amongUsImage3,
  amongUsImage4,
  amongUsImage5,
  amongUsImage6,
  amongUsImage7,
  amongUsImage8,
  amongUsImage9,
  amongUsImage10,
  amongUsImage11,
  amongUsImage12,
  amongUsImage13,
];

const AmongUs = ({ setShowAmongUs }) => {
  const canvasRef = useRef(null);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const getRandomSpeed = () => Math.random() * (1.2 - 0.6) + 0.6;

    const getRandomStartingPosition = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, directionAngle;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -50;
          directionAngle = Math.random() * Math.PI; // Downward direction
          break;
        case 1: // Right
          x = canvas.width + 50;
          y = Math.random() * canvas.height;
          directionAngle = Math.random() * Math.PI + Math.PI / 2; // Leftward direction
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 50;
          directionAngle = Math.random() * Math.PI + Math.PI; // Upward direction
          break;
        case 3: // Left
          x = -50;
          y = Math.random() * canvas.height;
          directionAngle = Math.random() * Math.PI - Math.PI / 2; // Rightward direction
          break;
        default:
          x = 0;
          y = 0;
          directionAngle = 0;
      }

      return { x, y, directionAngle };
    };

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * amongUsImages.length);
      const image = new Image();
      image.src = amongUsImages[randomIndex];
      return image;
    };

    const spawnAmongUsCharacter = () => {
      let {
        x: startX,
        y: startY,
        directionAngle,
      } = getRandomStartingPosition();
      let amongUsImage = getRandomImage();
      let speed = getRandomSpeed();

      let x = startX;
      let y = startY;

      const dx = Math.cos(directionAngle) * speed;
      const dy = Math.sin(directionAngle) * speed;

      let rotationAngle = 0;
      let rotationSpeed =
        (Math.random() * 0.001 + 0.01) * (Math.random() < 0.5 ? 1 : -1);

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(x + 25, y + 25); // Assuming the character is 50x50 pixels
        rotationAngle += rotationSpeed;
        ctx.rotate(rotationAngle);

        ctx.drawImage(amongUsImage, -25, -25, 50, 50);

        ctx.restore();

        x += dx;
        y += dy;

        // Update the state when the character is out of bounds
        if (
          (x > canvas.width + 50 || x < -50) &&
          (y > canvas.height + 50 || y < -50)
        ) {
          setIsDestroyed(true);
        } else {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    spawnAmongUsCharacter();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDestroyed) {
      // Delay to ensure animation is fully out of bounds before setting to false
      setTimeout(() => {
        setShowAmongUs(false);
      }, 100); // Small delay to ensure proper destruction
    }
  }, [isDestroyed, setShowAmongUs]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default AmongUs;
