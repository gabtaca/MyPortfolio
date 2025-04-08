// src/components/IdeesMobile.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getRandomFoldClass } from "../hooks/foldedCorner";
import ideesData from "../jsonFiles/ideesData.json"; // Données JSON des idées
import CategoryButton from "./CategoryButton";
import DashedArrow from "./DashedArrow";
import classNames from "classnames";
import useTheme from "../hooks/useTheme";

// Hook personnalisé pour obtenir la largeur de la fenêtre
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

// Fonctions utilitaires pour les post-it
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
  return Math.random() * 10 - 5; // Rotation entre -5° et 5°
};

const IdeesMobile = ({ activeCategory, setActiveCategory }) => {
  const { isDarkMode } = useTheme();
  const windowWidth = useWindowWidth();
  // Détection de l'orientation : en paysage si la largeur est supérieure à la hauteur
  const isLandscape = window.innerWidth > window.innerHeight;
  // Mode dropdown si la largeur >= 1200px OU si l'appareil mobile est en paysage
  const isDropdownMode = windowWidth >= 1200 || isLandscape;

  // État pour le hover sur le bouton (pour le ruban)
  const [hovered, setHovered] = useState(false);

  // États spécifiques au mode mobile portrait
  const [arrowExpanded, setArrowExpanded] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState([]);

  // État pour le mode dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef(null);
  const ideesContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mémoriser les catégories depuis ideesData
  const categories = useMemo(() => Object.keys(ideesData), [ideesData]);

  useEffect(() => {
    console.log("ideesData:", ideesData);
    console.log("categories:", categories);
  }, [categories, ideesData]);

  // En mode mobile portrait, afficher progressivement les catégories après l'expansion de la flèche
  useEffect(() => {
    if (!isDropdownMode && arrowExpanded && visibleCategories.length === 0) {
      categories.forEach((category, index) => {
        setTimeout(() => {
          setVisibleCategories((prev) => [...prev, category]);
        }, index * 300);
      });
    }
  }, [arrowExpanded, categories, visibleCategories.length, isDropdownMode]);

  // En mode dropdown, définir la catégorie par défaut sur "Art" si elle existe, sinon la première catégorie
  useEffect(() => {
    if (isDropdownMode && !activeCategory && categories.length > 0) {
      if (categories.includes("Art")) {
        setActiveCategory("Art");
      } else {
        setActiveCategory(categories[0]);
      }
    }
  }, [isDropdownMode, activeCategory, categories]);

  // Fermeture de la catégorie active en cliquant en dehors (pour les post-it)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsidePostIts =
        containerRef.current && !containerRef.current.contains(event.target);
      const isOutsideCategories =
        ideesContainerRef.current && !ideesContainerRef.current.contains(event.target);
      if (isOutsidePostIts && isOutsideCategories) {
        setActiveCategory(null);
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

  // Fermeture du dropdown en cliquant en dehors (mode dropdown)
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

  // Fonction pour activer/désactiver une catégorie
  const toggleCategory = (category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const handleArrowAnimationEnd = () => {
    if (!arrowExpanded) {
      console.log("Animation de la flèche terminée.");
      setArrowExpanded(true);
    }
  };

  // Rendu en fonction du mode
  if (!isDropdownMode) {
    // Mode Mobile Portrait
    return (
      <div className="idees-container" ref={ideesContainerRef}>
        <p className="idees-subtitle">
          Un fourre-tout d'idées. Pas toujours de logique entre l'une et l'autre, mais un bel endroit pour relancer l'inspiration en cas de besoin !
        </p>
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
                      angle={80}
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
            );
          })}
        </div>
        <DashedArrow onAnimationComplete={handleArrowAnimationEnd} />
      </div>
    );
  } else {
    // Mode Dropdown Desktop / Mobile en paysage
    // Le bouton affiche l'image neutre par défaut,
    // l'image hover lorsqu'il est survolé, et l'image active uniquement quand le dropdown est ouvert.
    let boutonImage = "/images/btn_idees_desktop-neutre.svg";
    if (isDropdownOpen) {
      boutonImage = "/images/btn_idees_desktop-active.svg";
    } else if (hovered) {
      boutonImage = "/images/btn_idees_desktop-hover.svg";
    }
    return (
      // Utilisation d'un motion.div avec layout pour animer le conteneur
      <motion.div layout className="idees-desktop-container" ref={ideesContainerRef}>
        <div className="idees-desktop-button-container" ref={dropdownRef}>
          <motion.button
            className="idees-desktop-button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img src={boutonImage} alt="Bouton catégories d'idées" />
          </motion.button>
          <AnimatePresence>
            {hovered && !isDropdownOpen && (
              <motion.div
                className="idees-desktop-ribbon"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                Catégories
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="idees-desktop-dropdown"
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 1 }}
              exit={{ opacity: 0, scale: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  className="idees-desktop-dropdown-item"
                  onClick={() => {
                    toggleCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.2 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {activeCategory && (
          <div className="idees-desktop-active-category" ref={containerRef}>
            {ideesData[activeCategory].map((idea) => {
              const postItColor = getRandomPostItColor();
              const randomRotation = getRandomRotation();
              return (
                <div
                  key={idea.id}
                  className={`idees-desktop-idea post-it ${getRandomFoldClass()}`}
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
      </motion.div>
    );
  }
};

export default IdeesMobile;
