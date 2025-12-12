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
   * Calcule le chemin initial en forme de V (pointant vers le haut) et le chemin final horizontal
   * basé sur la largeur du texte et l'angle désiré.
   *
   * @param {number} textWidth - Largeur du texte en pixels.
   * @param {number} angleDegrees - Angle d'ouverture désiré du V.
   * @param {number} svgWidth - Largeur du canvas SVG.
   * @param {number} finalLegY - Coordonnée Y où les bras doivent se poser.
   * @returns {object} - Contient initialPath, finalPath, et finalPathWidth.
   */
  const calculatePaths = (
    textWidth,
    angleDegrees,
    svgWidth = 200,
    finalLegY = 50 // Coordonnée Y fixe pour les bras
  ) => {
    try {
      const centerX = svgWidth / 2;
      const hingeY = 50; // Point final (horizontal)

      // Ajuster leftX et rightX basé sur la largeur du texte et le padding
      const padding = 20; // Padding de chaque côté
      const leftX = centerX - (textWidth / 2);
      const rightX = centerX + (textWidth / 2);

      // Calcul simple et direct pour l'angle
      // Pour un V, chaque bras fait la moitié de l'angle total
      const halfAngleRad = (angleDegrees / 2) * Math.PI / -180;
      const halfWidth = textWidth / 2;
      
      // Calculer deltaY basé sur la tangente de l'angle
      // tan(angle) = deltaY / halfWidth, donc deltaY = halfWidth * tan(angle)
      const deltaY = halfWidth * Math.tan(halfAngleRad);

      // Pour un livre qui s'ouvre vers le HAUT :
      // Les bords (gauche/droite) sont EN BAS → Y plus GRAND
      // Le centre est EN HAUT → Y plus PETIT
      const initialPath = `M${leftX},${hingeY + deltaY} L${centerX},${hingeY} L${rightX},${hingeY + deltaY}`;
      const finalPath = `M${leftX},${finalLegY} L${centerX},${finalLegY} L${rightX},${finalLegY}`;

      // Calculer la largeur du chemin final
      const finalPathWidth = rightX - leftX;

      return { initialPath, finalPath, finalPathWidth };
    } catch (error) {
      console.error("Erreur dans calculatePaths:", error);
      return { 
        initialPath: `M20,35 L100,50 L180,35`, 
        finalPath: `M20,50 L100,50 L180,50`,
        finalPathWidth: 160, // (180 - 20)
      }; // Chemins de secours
    }
  };

  // Définir les durées d'animation avec variation organique
  // Les durées varient de façon non-linéaire pour un effet plus naturel
  const animationDurations = [0.5, 0.44, 0.38, 0.34, 0.3, 0.28]; // En secondes
  const animationDuration = animationDurations[index] || 0.35; // Durée par défaut

  const pathVariants = {
    initial: {
      d: paths ? paths.initialPath : 'M20,50 L100,25 L180,50', // V pointant vers le HAUT (100,25 est plus haut que 20,50)
      transition: { duration: 0 },
    },
    final: {
      d: paths ? paths.finalPath : 'M20,50 L100,50 L180,50', // Ligne horizontale
      transition: { 
        duration: animationDuration,
        ease: [0.34, 1.56, 0.64, 1], // Courbe organique avec léger rebond
        delay: 0,
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
