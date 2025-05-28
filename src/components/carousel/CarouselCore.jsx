import React, { useEffect, useState, useRef } from "react";
import "../../styles/Carousel.css";


const MAX_VISIBILITY = 3;

const Carousel = ({ children }) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const count = React.Children.count(children);
  const pauseTimeoutRef = useRef(null);

  const handlePause = () => {
    setIsPaused(true);
    clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  };

  const handlePrev = () => {
    if (active > 0) {
      setActive((i) => i - 1);
      handlePause();
    }
  };

  const handleNext = () => {
    if (active < count - 1) {
      setActive((i) => i + 1);
      handlePause();
    }
  };

  useEffect(() => {
    if (isPaused || count <= 1) return;

    const interval = setInterval(() => {
      setActive((prev) => {
        if (prev === count - 1) {
          setDirection(-1);
          return prev - 1;
        } else if (prev === 0) {
          setDirection(1);
          return prev + 1;
        } else {
          return prev + direction;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [count, direction, isPaused]);

  useEffect(() => {
    return () => clearTimeout(pauseTimeoutRef.current);
  }, []);

  return (
    <div
      className="carousel"
      role="region"
      aria-label="Book carousel"
      tabIndex={-1}
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-9999px",
          height: 0,
          overflow: "hidden",
        }}
      >
        {`Active book: ${
          React.Children.toArray(children)[active]?.props.title || ""
        }`}
      </div>

      {active > 0 && (
        <button
          className="nav left"
          onClick={handlePrev}
          aria-label="Past book"
          type="button"
        >
          <i className="fa-solid fa-arrow-left py-5"></i>
        </button>
      )}

      {React.Children.map(children, (child, i) => (
        <div
          className="cardC-container"
          style={{
            "--active": i === active ? 1 : 0,
            "--offset": (active - i) / 3,
            "--direction": Math.sign(active - i),
            "--abs-offset": Math.abs(active - i) / 3,
            pointerEvents: active === i ? "auto" : "none",
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? "0" : "1",
            display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
          }}
        >
          {child}
        </div>
      ))}

      {active < count - 1 && (
        <button
          className="nav right"
          onClick={handleNext}
          aria-label="Next book"
          type="button"
        >
          <i className="fa-solid fa-arrow-right py-5"></i>
        </button>
      )}
    </div>
  );
};

export default Carousel;
