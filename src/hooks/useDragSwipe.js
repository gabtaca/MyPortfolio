// src/hooks/useDragSwipe.js
import { useState, useRef } from "react";

export default function useDragSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const startCoords = useRef({ x: 0, y: 0 });
  const swipeThreshold = 40;

  const startDrag = (e) => {
    setIsDragging(true);
    const { clientX, clientY } = e.type.includes("touch") ? e.touches[0] : e;
    startCoords.current = { x: clientX, y: clientY };
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const { clientX, clientY } = e.type.includes("touch") ? e.touches[0] : e;
    position.current = {
      x: clientX - startCoords.current.x,
      y: clientY - startCoords.current.y,
    };
  };

  const endDrag = () => {
    setIsDragging(false);
    const { x, y } = position.current;
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > swipeThreshold) {
      if (x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else if (Math.abs(y) > swipeThreshold && y > 0) {
      onSwipeDown();
    }
    position.current = { x: 0, y: 0 };
  };

  return {
    isDragging,
    position: position.current,
    startDrag,
    onDrag,
    endDrag,
  };
}
