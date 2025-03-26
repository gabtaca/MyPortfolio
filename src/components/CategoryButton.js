// src/components/CategoryButton.jsx

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { measureTextWidth } from "../hooks/measureTextWidth"; // Import the measurement function


// Helper function to generate safe IDs by removing spaces and special characters
const generateSafeId = (str) =>
  str.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');

const CategoryButton = ({ category, index, onClick, angle }) => {
  const pathRef = useRef(null);
  const [paths, setPaths] = useState(null); // Initially null

  // Generate a safe ID for SVG elements
  const safeCategoryId = generateSafeId(category);

  useLayoutEffect(() => {
    if (!paths) {
      // Ensure fonts are loaded
      document.fonts.ready.then(() => {
        const font = '50px Italiana, sans-serif'; // Match the CSS font
        const textWidth = measureTextWidth(category, font);
        console.log(`Measured text width for "${category}" (Index: ${index}): ${textWidth}px`);

        if (textWidth > 0) {
          const padding = 40; // Total padding (20px on each side)
          const svgWidth = textWidth + padding;
          const { initialPath, finalPath, finalPathWidth } = calculatePaths(textWidth, angle, svgWidth);
          console.log(`Calculated Paths for "${category}" (Index: ${index}):`, initialPath, finalPath, finalPathWidth);
          setPaths({ initialPath, finalPath, finalPathWidth, svgWidth });
        } else {
          console.error(`Text width is 0 for "${category}" (Index: ${index}). Using fallback paths.`);
          setPaths({
            initialPath: 'M20,35 L100,50 L180,35',
            finalPath: 'M20,50 L100,50 L180,50',
            finalPathWidth: 160, // (180 - 20)
            svgWidth: 200, // Default SVG width
          });
        }
      }).catch((error) => {
        console.error(`Font loading error for "${category}" (Index: ${index}):`, error);
        // Fallback paths in case of font loading failure
        setPaths({
          initialPath: 'M20,35 L100,50 L180,35',
          finalPath: 'M20,50 L100,50 L180,50',
          finalPathWidth: 160, // (180 - 20)
          svgWidth: 200, // Default SVG width
        });
      });
    }
  }, [category, index, angle, paths]);

  /**
   * Calculates the initial V-shaped path (pointing downward) and the final horizontal path
   * based on the text width and desired angle.
   *
   * @param {number} textWidth - Width of the text in pixels.
   * @param {number} angleDegrees - Desired opening angle of the V-shape.
   * @param {number} svgWidth - The width of the SVG canvas.
   * @param {number} finalLegY - The Y-coordinate where arms should settle.
   * @returns {object} - Contains initialPath, finalPath, and finalPathWidth.
   */
  const calculatePaths = (
    textWidth,
    angleDegrees,
    svgWidth = 200,
    finalLegY = 50 // Fixed Y-coordinate for arms
  ) => {
    try {
      const angleRad = (angleDegrees * Math.PI) / 10;
      const armAngleRad = angleRad / 2;
      const armLength = textWidth / (2 * Math.sin(armAngleRad));
      let deltaY = armLength * Math.sin(armAngleRad);

      // Ensure arms don't exceed the finalLegY
      if (deltaY > finalLegY - 35) { // Assuming initial y=35
        deltaY = finalLegY - 35;
      }

      const centerX = svgWidth / 2;
      const hingeY = 35; // Fixed Y-coordinate for the middle point

      // Adjust leftX and rightX based on textWidth and padding
      const padding = 20; // Padding on each side
      const leftX = centerX - (textWidth / 2);
      const rightX = centerX + (textWidth / 2);

      const initialPath = `M${leftX},${hingeY} L${centerX},${hingeY + deltaY} L${rightX},${hingeY}`;
      const finalPath = `M${leftX},${finalLegY} L${centerX},${finalLegY} L${rightX},${finalLegY}`;

      // Calculate final path width
      const finalPathWidth = rightX - leftX;

      return { initialPath, finalPath, finalPathWidth };
    } catch (error) {
      console.error("Error in calculatePaths:", error);
      return { 
        initialPath: `M20,35 L100,50 L180,35`, 
        finalPath: `M20,50 L100,50 L180,50`,
        finalPathWidth: 160, // (180 - 20)
      }; // Fallback paths
    }
  };

  // Define path animation variants
  const pathVariants = {
    initial: {
      d: paths ? paths.initialPath : 'M20,35 L100,50 L180,35', // Fallback initial path
      transition: { duration: 0 },
    },
    final: {
      d: paths ? paths.finalPath : 'M20,50 L100,50 L180,50', // Fallback final path
      transition: { 
        duration: 0.5, 
        ease: "easeInOut",
        delay: 0.1, // Additional delay before starting the path animation
      },
    },
  };

  return (
    <motion.button
      className="category-button"
      onClick={onClick}
      aria-label={`Category Button for ${category}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { 
          display: "none",
          opacity: 1,
          y:0,
        },
        visible: { 
          display: "block",
          opacity: 1,
          y: 0,
          transition: {
            opacity: { duration: 0.5, delay: 0 }, 
            y: { duration: 0.5, delay: 0 },      
          },
        },
      }}
    >
      {paths && (
        <svg
          className="svg-animation"
          viewBox={`0 0 ${paths.svgWidth} 60`} // Dynamic viewBox based on svgWidth
          width={paths.svgWidth} // Dynamic SVG width
          height={60} // Fixed SVG height
          aria-labelledby={`title-${safeCategoryId}-${index} desc-${safeCategoryId}-${index}`}
          role="img"
        >
          <title id={`title-${safeCategoryId}-${index}`}>
            {`Animated Text Path for ${category}`}
          </title>
          <desc id={`desc-${safeCategoryId}-${index}`}>
            {`Text animates from a closed V-shape to a horizontal line for ${category}.`}
          </desc>
          <motion.path
            id={`animatedPath-${safeCategoryId}-${index}`} // Unique, safe identifier
            className="animatedPath"
            d={paths.initialPath} // Initial path
            fill="none"
            stroke="none" // Stroke color
            strokeWidth="2" // Stroke width
            ref={pathRef}
            variants={pathVariants}
            initial="initial"
            animate="final"
          />
          <text className="text" fill="black" fontFamily="Roboto, sans-serif" fontSize="16px">
            <textPath
              href={`#animatedPath-${safeCategoryId}-${index}`} // Reference to the path
              className="textPathRef"
              startOffset="50%" // Center the text on the path
            >
              {category}
            </textPath>
          </text>
        </svg>
      )}
    </motion.button> 
  );
};

CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  angle: PropTypes.number.isRequired, // Ensure angle is passed and validated 
};

export default CategoryButton;
