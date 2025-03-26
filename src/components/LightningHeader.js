// src/components/LightningHeader.jsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, stagger } from 'framer-motion';
import useTheme from '../hooks/useTheme';
import classNames from 'classnames';


export default function LightningHeader({ navigateTo }) { // Recevoir navigateTo en prop
  const { isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations } = useTheme(); // Accès au thème via le hook
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const burgerButtonRef = useRef(null); // Référence pour le bouton burger

  // Effet pour gérer les clics en dehors du menu déroulant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !burgerButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Variants pour les animations de Framer Motion
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {},
  };

  return (
    <div className="lightning-header">
      {/* Navigation */}
      <nav className="nav_header">
        <button
          className={classNames("btn_burger-header", {
            "dark-mode": isDarkMode,
            "light-mode": !isDarkMode,
          })}
          onClick={() => setOpen(!open)}
          ref={burgerButtonRef} // Attacher la référence au bouton burger
          style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
        >
          {/* Utiliser un SVG ou une image comme icône de burger */}
          <img
            src={isDarkMode ? '/images/menu_burgerDarkMode.svg' : '/images/menu_burger.svg'}
            alt="Menu"
            className="burger-icon"
          />
        </button>
      </nav>

      {/* Menu déroulant */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="dropdown-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            ref={dropdownRef}
          >
            {/* Liste des items avec stagger */}
            <motion.div
              className="dropdown-list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Bouton Accueil */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
                onClick={() => {
                  navigateTo(null, "dropdown"); // Réinitialiser à l'accueil
                  setOpen(false); // Fermer le menu déroulant
                }}
              >
                <button
                  className={classNames("svg-icon home-accueil", {
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}
                  title="Accueil"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                ></button>
                <span
                  onClick={() => {
                    navigateTo(null, "dropdown"); // Réinitialiser à l'accueil
                    setOpen(false); // Fermer le menu déroulant
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Accueil
                </span>
              </motion.div>

              {/* Lien vers CV */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("CV", "dropdown");
                  setOpen(false); // Fermer le menu déroulant
                }}
              >
                <button
                  className={classNames("svg-icon home-cv", { // Utiliser "home-cv" pour correspondre au SCSS
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}
                  title="CV"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                ></button>
                <span
                  onClick={() => {
                    navigateTo("CV", "dropdown");
                    setOpen(false); // Fermer le menu déroulant
                  }}
                  style={{ cursor: "pointer" }}
                >
                  CV
                </span>
              </motion.div>

              {/* Lien vers Projets */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("Projets", "dropdown");
                  setOpen(false); // Fermer le menu déroulant
                }}
              >
                <button
                  className={classNames("svg-icon home-projects", { // Utiliser "home-projects" pour correspondre au SCSS
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}
                  title="Projets"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                ></button>
                <span
                  onClick={() => {
                    navigateTo("Projets", "dropdown");
                    setOpen(false); // Fermer le menu déroulant
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Projets
                </span>
              </motion.div>

              {/* Lien vers Idées */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("Idées", "dropdown");
                  setOpen(false); // Fermer le menu déroulant
                }}
              >
                <button
                  className={classNames("svg-icon home-ideas", { // Utiliser "home-ideas" pour correspondre au SCSS
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}
                  title="Idées"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                ></button>
                <span
                  onClick={() => {
                    navigateTo("Idées", "dropdown");
                    setOpen(false); // Fermer le menu déroulant
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Idées
                </span>
              </motion.div>

              {/* Toggle Mode Sombre */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
              >
                <span>Mode Sombre</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleDarkMode} // Utiliser la fonction toggleDarkMode du contexte
                  />
                  <span className="slider round"></span>
                </label>
              </motion.div>

              {/* Toggle Animations */}
              <motion.div
                className="dropdown-item"
                variants={itemVariants}
              >
                <span>Animations</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={animationsEnabled}
                    onChange={toggleAnimations} // Utiliser la fonction toggleAnimations du contexte
                  />
                  <span className="slider round"></span>
                </label>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteneur des nuages */}
      <div className="clouds">
        {/* Vos nuages ici */}
      </div>
    </div>
  );
}
