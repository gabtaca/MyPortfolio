// src/hooks/useDrag.js
import { useState, useRef } from "react";

export default function useDrag({ onSwipeLeft, onSwipeRight, onSwipeDown }) {
  const [isDragging, setIsDragging] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const startCoords = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    setIsDragging(true);
    startCoords.current = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    };
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const currentY = e.clientY || e.touches[0].clientY;
    position.current = {
      x: currentX - startCoords.current.x,
      y: currentY - startCoords.current.y,
    };
  };

  const endDrag = () => {
    setIsDragging(false);
    // Determine swipe direction
    if (position.current.x > 50) {
      onSwipeRight();
    } else if (position.current.x < -50) {
      onSwipeLeft();
    } else if (position.current.y > 50) {
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
