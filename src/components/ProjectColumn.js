// src/components/ProjectColumn.jsx

import React from "react";
import useTheme from "../hooks/useTheme";
import classNames from 'classnames';

export default function ProjectColumn({
  project,
  scale,
  isHighlighted,
  onClick,
  index,
  centerIndex,
  zIndexValue, 
  triangleZIndex,
}) {
  const { isDarkMode } = useTheme(); // Accès au thème via le hook
  const isBookend = project.id.startsWith("blank");

  // Déterminer la direction du triangle 
  const triangleDirection =
    index < centerIndex ? "triangle-right" : "triangle-left";

  console.log(`ProjectColumn - isDarkMode: ${isDarkMode}`);

  return (
    <div
      className="project-column"
      onClick={!isBookend ? onClick : undefined}
    >
      <div className="project-container">
        <img
          src={
            isHighlighted && !isBookend ? project.img : project.still || project.img
          }
          alt={project.imgAlt || "Project Image"}
          className="project-image"
        />
        {!isHighlighted && (
          <div
            className={classNames('triangle', triangleDirection, {
              'dark-mode': isDarkMode,
              'light-mode': !isDarkMode,
            })}
            style={{
              zIndex: triangleZIndex, 
            }}
          />
        )}
      </div>
    </div>
  );
}
