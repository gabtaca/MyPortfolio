// src/components/Home.js

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importation de Framer Motion
import ProjectsSlider from "./ProjectsSlider";
import CvMobile from "./CvMobile";
import IdeesMobile from "./IdeesMobile";
import LightningHeader from "./LightningHeader";
import classNames from "classnames";
import useTheme from "../hooks/useTheme";

export default function Home() {
  const { isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations } =
    useTheme();
  const [activeSection, setActiveSection] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [buttonsToHide, setButtonsToHide] = useState(new Set());

  // Référence pour ProjectsSlider
  const projectsSliderRef = useRef(null);

  // Références pour la bulle et l'icône du téléphone
  const bubbleRef = useRef(null);
  const phoneIconRef = useRef(null);

  // Fonction pour naviguer vers une section spécifique avec animations
  const handleSectionClick = (section) => {
    if (activeSection === section) {
      resetView();
      return;
    }

    // Determine which buttons to hide based on the selected section
    let hideButtons = new Set();
    if (section === "CV") {
      hideButtons = new Set(["Projets", "Idées"]);
    } else if (section === "Projets") {
      hideButtons = new Set(["CV", "Idées"]);
    } else if (section === "Idées") {
      hideButtons = new Set(["CV", "Projets"]);
    }

    setButtonsToHide(hideButtons);

    // Set the active section after animation delay
    setTimeout(() => {
      setActiveSection(section);
    }, 600);
  };

  // Réinitialiser la vue à l'état initial
  const resetView = () => {
    setButtonsToHide(new Set());
    setActiveSection(null);
  };

  // Fonction pour copier le numéro de téléphone dans le presse-papiers
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("+1 (418) 930-3703");
    alert("Numéro copié dans le presse-papiers !");
  };

  // Fonction pour gérer le clic sur l'icône du téléphone
  const handlePhoneClick = () => {
    setIsBubbleVisible(!isBubbleVisible);
  };

  // Utiliser useEffect pour gérer le clic en dehors de la bulle
  useEffect(() => {
    if (isBubbleVisible) {
      const handleClickOutside = (event) => {
        if (
          bubbleRef.current &&
          !bubbleRef.current.contains(event.target) &&
          phoneIconRef.current &&
          !phoneIconRef.current.contains(event.target)
        ) {
          setIsBubbleVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isBubbleVisible]);

  // Réinitialiser le slider quand on revient à la section Projets
  // Temporairement désactivé pour debug
  /*
  useEffect(() => {
    if (activeSection === "Projets" && projectsSliderRef.current?.reinitializeSlider) {
      setTimeout(() => {
        projectsSliderRef.current.reinitializeSlider();
      }, 300);
    }
  }, [activeSection]);
  */

  // Variants pour les animations de Framer Motion
  const exitAnimations = {
    rotateOutDownLeft: {
      opacity: 0,
      rotate: -45,
      y: 100,
      transition: { duration: 0.5 }
    },
    rotateOutDownRight: {
      opacity: 0,
      rotate: 45,
      y: 100,
      transition: { duration: 0.5 }
    },
    fadeOutLeft: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.5 }
    },
    fadeOutRight: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.5 }
    },
    fadeOutUp: {
      opacity: 0,
      y: -100,
      transition: { duration: 0.5 }
    },
    rotateOutUpRight: {
      opacity: 0,
      rotate: 90,
      y: -100,
      transition: { duration: 0.5 }
    },
    fadeIn: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Get button exit animation based on section
  const getButtonExitAnimation = (buttonName, section) => {
    if (section === "CV") {
      if (buttonName === "Projets") return exitAnimations.rotateOutDownRight;
      if (buttonName === "Idées") return exitAnimations.rotateOutDownLeft;
    } else if (section === "Projets") {
      if (buttonName === "CV") return exitAnimations.fadeOutRight;
      if (buttonName === "Idées") return exitAnimations.fadeOutLeft;
    } else if (section === "Idées") {
      if (buttonName === "CV") return exitAnimations.fadeOutUp;
      if (buttonName === "Projets") return exitAnimations.rotateOutUpRight;
    }
    return exitAnimations.fadeIn;
  };

  return (
    <>
      {/* Passer handleSectionClick en tant que prop navigateTo */}
      <LightningHeader navigateTo={handleSectionClick} />
      <div className="home_container">
        <nav className={`nav_main-home ${activeSection ? 'section-active' : ''}`}>

          {/* Afficher les boutons de navigation en fonction de la section active */}
          <motion.div
            className="nav_buttons"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={buttonVariants}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="sync">
              {/* Bouton CV */}
              {!buttonsToHide.has("CV") && (
                <motion.button
                  key="cv-btn"
                  className="btn_cv-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("CV")}
                  initial={{ opacity: activeSection === "CV" ? 0 : 1, y: activeSection === "CV" ? -20 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={getButtonExitAnimation("CV")}
                  transition={{ duration: 0.5 }}
                >
                  CV
                </motion.button>
              )}
              
              {/* Bouton Projets */}
              {!buttonsToHide.has("Projets") && (
                <motion.button
                  key="projects-btn"
                  className="btn_projets-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("Projets")}
                  initial={{ opacity: activeSection === "Projets" ? 0 : 1, y: activeSection === "Projets" ? -20 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={getButtonExitAnimation("Projets")}
                  transition={{ duration: 0.5 }}
                >
                  Projets
                </motion.button>
              )}
              
              {/* Bouton Idées */}
              {!buttonsToHide.has("Idées") && (
                <motion.button
                  key="ideas-btn"
                  className="btn_idees-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("Idées")}
                  initial={{ opacity: activeSection === "Idées" ? 0 : 1, y: activeSection === "Idées" ? -20 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={getButtonExitAnimation("Idées")}
                  transition={{ duration: 0.5 }}
                >
                  Idées
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>

        <div className={`content-container ${
          activeSection === "CV" ? "cv-active" :
          activeSection === "Projets" ? "projects-active" :
          activeSection === "Idées" ? "idees-active" : ""
        }`}>
          <AnimatePresence mode="wait">
            {activeSection === "CV" && (
              <motion.div
                className="content_motion-cv"
                key="cv"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                  <div className={`cv_ctrl`}></div>
                <CvMobile />
                <div className={`cv_ctrl-bottom`}></div>
                <footer className="cv_footer">
                  <a
                    href="/pdf/CV-Gabriel_Taca.pdf"
                    download="CV-Gabriel_Taca.pdf"
                    className="cv_footer-download"
                  >
                    <button
                      className={classNames("svg-icon cv_footer-download", {
                        "dark-mode": isDarkMode,
                        "light-mode": !isDarkMode,
                      })}
                      title="Télécharger le CV"
                      style={{ cursor: "pointer" }}
                    ></button>
                  </a>
                </footer>
              </motion.div>
            )}
            {activeSection === "Projets" && (
              <motion.div
                className="content_motion-projets"
                key="projets"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                <ProjectsSlider ref={projectsSliderRef} />
                
              </motion.div>
            )}
            {activeSection === "Idées" && (
              <motion.div
                className="content_motion-idees"
                key="idees"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                <IdeesMobile 
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Afficher le home_footer seulement si aucune section n'est active */}
        {!activeSection && (
          <footer className="home_footer">
            {/* LinkedIn */}
            <button
              className={classNames("svg-icon home-linkedin", {
                "dark-mode": isDarkMode,
                "light-mode": !isDarkMode,
              })}
              title="LinkedIn"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/gabriel-taca-7a65961a/?originalSubdomain=ca",
                  "_blank"
                )
              }
              style={{ cursor: "pointer", marginRight: "10px" }}
            ></button>
            {/* Email */}
            <button
              className={classNames("svg-icon home-mail", {
                "dark-mode": isDarkMode,
                "light-mode": !isDarkMode,
              })}
              title="Email"
              onClick={() =>
                (window.location.href = "mailto:gabrieltaca117@gmail.com")
              }
              style={{ cursor: "pointer" }}
            ></button>

            {/* Icône du téléphone et Bulle de Dialogue */}
            <div className="phone-container" style={{ position: "relative" }}>
              <button
                className={classNames("svg-icon home-call", {
                  "dark-mode": isDarkMode,
                  "light-mode": !isDarkMode,
                })}
                
                onClick={handlePhoneClick}
                style={{ cursor: "pointer" }}
                ref={phoneIconRef}
              ></button>

              {/* Bulle de Dialogue */}
              <AnimatePresence>
                {isBubbleVisible && (
                  <motion.div
                    ref={bubbleRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="comic_bubble"
                  >
                    <p style={{ margin: 0, fontWeight: "600" }}>Gabriel Taca</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      <a
                        href="tel:+14189303703"
                        style={{ textDecoration: "none", flexGrow: 1 }}
                      >
                        +1 (418) 930-3703
                      </a>
                      <button
                        className={classNames("svg-icon home-copy-call", {
                          "dark-mode": isDarkMode,
                          "light-mode": !isDarkMode,
                        })}
                        title="Copy"
                        onClick={copyPhoneNumber}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      ></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </footer>
        )}


      </div>
    </>
  );
}
