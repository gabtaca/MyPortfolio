import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDatesFooter({
  projectsData,
  buttonPositions,
  highlightedIndex,
  scrollToProjectIndex,
  arcWidth = 375,
  arcHeight = 80,
  yOffsetAdjustment = 150,
  visibilityThreshold = 400,
}) {
  const [responsiveArcWidth, setResponsiveArcWidth] = useState(arcWidth);
  const [responsiveYOffset, setResponsiveYOffset] = useState(yOffsetAdjustment);

  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      setResponsiveArcWidth(width);
    };

    updateResponsiveValues();
    window.addEventListener("resize", updateResponsiveValues);
    return () => window.removeEventListener("resize", updateResponsiveValues);
  }, []);

  const datePositions = useMemo(() => {
    return projectsData.map((_, index) => {
      const buttonPosX = buttonPositions[index + 2]?.x || 0;
      const xNormalized = (buttonPosX / window.innerWidth) * responsiveArcWidth;
      const xPosition = xNormalized;
      const yPosition =
        -arcHeight *
          (1 -
            Math.pow(
              (xNormalized - responsiveArcWidth / 2) / (responsiveArcWidth / 2),
              2
            )) +
        responsiveYOffset;

      return {
        x: xPosition,
        y: yPosition,
        isVisible: Math.abs(buttonPosX) < visibilityThreshold,
      };
    });
  }, [
    projectsData.length,
    buttonPositions,
    responsiveArcWidth,
    arcHeight,
    responsiveYOffset,
    visibilityThreshold,
  ]);

  const handleDateClick = (index) => {
    if (scrollToProjectIndex) {
      scrollToProjectIndex(index + 2); // Adjust index
    }
  };

  return (
    <div className="project-dates-footer" style={{ overflow: "hidden" }}>
      {highlightedIndex != null && projectsData[highlightedIndex] && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            top: responsiveYOffset - arcHeight + "px",
          }}
        >
          <motion.p className="project-type">
            {projectsData[highlightedIndex].type}
          </motion.p>
          <motion.p className="project-name">
            {projectsData[highlightedIndex].name}
          </motion.p>
        </div>
      )}

      {datePositions.map((pos, index) => {
        const project = projectsData[index];
        if (!project) return null;

        return (
          pos.isVisible && (
            <AnimatePresence key={project.id}>
              <motion.button
                className="date-button"
                style={{
                  position: "absolute",
                  left: pos.x + "px",
                  top: pos.y + "px",
                  transform: "translate(-50%, -120%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleDateClick(index)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {project.date}
              </motion.button>
            </AnimatePresence>
          )
        );
      })}
    </div>
  );
}
