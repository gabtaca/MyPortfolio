// src/components/IdeesMobile.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRandomFoldClass } from "../hooks/foldedCorner";
import ideesData from "../jsonFiles/ideesData.json"; // Import JSON data
import CategoryButton from "./CategoryButton"; // Ensure correct import
import DashedArrow from "./DashedArrow"; // Correct import
import classNames from "classnames";
import useTheme from "../hooks/useTheme";

const IdeesMobile = () => {
  const { isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations } =
    useTheme();
  const [activeCategory, setActiveCategory] = useState(null);
  const [arrowExpanded, setArrowExpanded] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]); // Controls visible categories
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown open state
  const containerRef = useRef(null);
  const ideesContainerRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  // Memorize categories
  const categories = useMemo(() => Object.keys(ideesData), [ideesData]);

  // Debugging: Reduce logs to avoid overload
  useEffect(() => {
    console.log("ideesData:", ideesData);
    console.log("categories:", categories);
  }, [categories, ideesData]);

  useEffect(() => {
    // Display categories after arrow expansion
    if (arrowExpanded && visibleCategories.length === 0) {
      // Prevent repeated additions
      categories.forEach((category, index) => {
        setTimeout(() => {
          setVisibleCategories((prev) => [...prev, category]);
        }, index * 300); // Adjust delay as needed
      });
    }
  }, [arrowExpanded, categories, visibleCategories.length]);

  // Handle closing active category when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsidePostIts =
        containerRef.current && !containerRef.current.contains(event.target);
      const isOutsideCategories =
        ideesContainerRef.current &&
        !ideesContainerRef.current.contains(event.target);

      if (isOutsidePostIts && isOutsideCategories) {
        setActiveCategory(null); // Close category if clicking outside both
      }
    };

    if (activeCategory) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCategory]);

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutsideDropdown);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

  const toggleCategory = (category) => {
    // Close active category if same; open new otherwise
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleArrowAnimationEnd = () => {
    if (!arrowExpanded) {
      // Ensure arrowExpanded is not already true
      console.log("Arrow animation completed.");
      setArrowExpanded(true);
    }
  };

  return (
    <div className="idees-container" ref={ideesContainerRef}>
      <p className="idees-subtitle">
        Un fourre-tout d'idées. Pas toujours de logique entre l'une et l'autre,
        mais un bel endroit pour relancer l'inspiration en cas de besoin !
      </p>

      {/* Container for categories in portrait mode */}
      <div className="categories_container-portrait">
        {categories.map((category, index) => {
          const isVisible = visibleCategories.includes(category);
          return (
            <div key={category} className="category-section">
              <AnimatePresence>
                {isVisible && (
                  <CategoryButton
                    category={category}
                    index={index}
                    angle={80} // Provide angle as needed, or make it dynamic
                    onClick={() => toggleCategory(category)}
                  />
                )}
              </AnimatePresence>
              {activeCategory === category && (
                <div className="post-it-container" ref={containerRef}>
                  {ideesData[activeCategory].map((idea) => {
                    const postItColor = getRandomPostItColor();
                    const randomRotation = getRandomRotation();
                    return (
                      <div
                        key={idea.id}
                        className={`post-it ${getRandomFoldClass()}`}
                        style={{
                          backgroundColor: postItColor,
                          "--post-it-color": postItColor,
                          transform: `rotate(${randomRotation}deg)`,
                        }}
                      >
                        <div className="post-it-content">
                          <h3>{idea.title}</h3>
                          <div className="post-it_descCTRL">
                            <p>
                              <span className="postit_description">
                                Description
                              </span>
                              {idea.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Container for categories in landscape mode (Custom Dropdown Menu) */}
      <div className="categories_container-landscape" ref={dropdownRef}>
        <button
          className="category-dropdown-button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          aria-controls="dropdown-menu-landscape"
        >
          {activeCategory ? activeCategory : "Catégories d'idées"}
          {/* Optional: Add an arrow icon */}
          <span
            className={classNames("dropdown-arrow", {
              open: isDropdownOpen,
              "dark-mode": isDarkMode,
              "light-mode": !isDarkMode,
            })}
          ></span>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="dropdown-menu-landscape"
              id="dropdown-menu-landscape"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className="dropdown-item-idees"
                  onClick={() => {
                    toggleCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {activeCategory && (
          <div className="post-it-container" ref={containerRef}>
            {ideesData[activeCategory].map((idea) => {
              const postItColor = getRandomPostItColor();
              const randomRotation = getRandomRotation();
              return (
                <div
                  key={idea.id}
                  className={`post-it ${getRandomFoldClass()}`}
                  style={{
                    backgroundColor: postItColor,
                    "--post-it-color": postItColor,
                    transform: `rotate(${randomRotation}deg)`,
                  }}
                >
                  <div className="post-it-content">
                    <h3>{idea.title}</h3>
                    <div className="post-it_descCTRL">
                      <p>
                        <span className="postit_description">Description</span>
                        {idea.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dashed Arrow Component */}
      <DashedArrow onAnimationComplete={handleArrowAnimationEnd} />
    </div>
  );
};

// Utility functions
const getRandomPostItColor = () => {
  const colors = [
    "var(--postItPink)",
    "var(--postItYellow)",
    "var(--postItGreen)",
    "var(--postItBlue)",
    "var(--postItOrange)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomRotation = () => {
  // Generate a random angle between -5 and 5 degrees
  return Math.random() * 10 - 5;
};

export default IdeesMobile;
