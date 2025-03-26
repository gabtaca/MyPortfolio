// src/components/Home.js

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importation de Framer Motion
import ProjectsSlider from "./ProjectsSlider";
import CvMobile from "./CvMobile";
import IdeesMobile from "./IdeesMobile";
import LightningHeader from "./LightningHeader";
import classNames from "classnames";
import useTheme from "../hooks/useTheme";
import "animate.css"; // Importer Animate.css

export default function Home() {
  const { isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations } =
    useTheme();
  const [activeSection, setActiveSection] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  // Références pour la bulle et l'icône du téléphone
  const bubbleRef = useRef(null);
  const phoneIconRef = useRef(null);

  // Références pour les boutons de navigation
  const btnCvRef = useRef(null);
  const btnProjectsRef = useRef(null);
  const btnIdeasRef = useRef(null);

  // Fonction pour naviguer vers une section spécifique avec animations
  const handleSectionClick = (section) => {
    console.log(`handleSectionClick called with section: ${section}`);

    if (activeSection === section) {
      console.log("Resetting view to home.");
      resetView();
      return;
    }

    console.log(`Setting activeSection to: ${section}`);

    // Appliquer les animations en fonction de la section cible
    if (section === "CV") {
      // Animer les boutons Projets et Idées pour sortir
      if (btnIdeasRef.current) {
        btnIdeasRef.current.classList.add(
          "animate__animated",
          "animate__rotateOutDownLeft"
        );
        btnIdeasRef.current.addEventListener(
          "animationend",
          () => {
            btnIdeasRef.current.classList.remove(
              "animate__animated",
              "animate__rotateOutDownLeft"
            );
          },
          { once: true }
        );
      }
      if (btnProjectsRef.current) {
        btnProjectsRef.current.classList.add(
          "animate__animated",
          "animate__rotateOutDownRight"
        );
        btnProjectsRef.current.addEventListener(
          "animationend",
          () => {
            btnProjectsRef.current.classList.remove(
              "animate__animated",
              "animate__rotateOutDownRight"
            );
          },
          { once: true }
        );
      }
    } else if (section === "Projets") {
      // Animer les boutons CV et Idées pour sortir
      if (btnIdeasRef.current) {
        btnIdeasRef.current.classList.add(
          "animate__animated",
          "animate__fadeOutLeft"
        );
        btnIdeasRef.current.addEventListener(
          "animationend",
          () => {
            btnIdeasRef.current.classList.remove(
              "animate__animated",
              "animate__fadeOutLeft"
            );
          },
          { once: true }
        );
      }
      if (btnCvRef.current) {
        btnCvRef.current.classList.add(
          "animate__animated",
          "animate__fadeOutRight"
        );
        btnCvRef.current.addEventListener(
          "animationend",
          () => {
            btnCvRef.current.classList.remove(
              "animate__animated",
              "animate__fadeOutRight"
            );
          },
          { once: true }
        );
      }
    } else if (section === "Idées") {
      // Animer les boutons CV et Projets pour sortir
      if (btnCvRef.current) {
        btnCvRef.current.classList.add(
          "animate__animated",
          "animate__fadeOutUp"
        );
        btnCvRef.current.addEventListener(
          "animationend",
          () => {
            btnCvRef.current.classList.remove(
              "animate__animated",
              "animate__fadeOutUp"
            );
          },
          { once: true }
        );
      }
      if (btnProjectsRef.current) {
        btnProjectsRef.current.classList.add(
          "animate__animated",
          "animate__rotateOutUpRight"
        );
        btnProjectsRef.current.addEventListener(
          "animationend",
          () => {
            btnProjectsRef.current.classList.remove(
              "animate__animated",
              "animate__rotateOutUpRight"
            );
          },
          { once: true }
        );
      }
    }

    // Définir la nouvelle section active après un court délai pour permettre l'animation
    setTimeout(() => {
      setActiveSection(section);

      // Ajouter l'animation d'entrée pour le bouton correspondant
      if (section === "CV" && btnCvRef.current) {
        btnCvRef.current.classList.add("animate__animated", "animate__fadeIn");
        btnCvRef.current.addEventListener(
          "animationend",
          () => {
            btnCvRef.current.classList.remove(
              "animate__animated",
              "animate__fadeIn"
            );
          },
          { once: true }
        );
      } else if (section === "Projets" && btnProjectsRef.current) {
        btnProjectsRef.current.classList.add(
          "animate__animated",
          "animate__fadeIn"
        );
        btnProjectsRef.current.addEventListener(
          "animationend",
          () => {
            btnProjectsRef.current.classList.remove(
              "animate__animated",
              "animate__fadeIn"
            );
          },
          { once: true }
        );
      } else if (section === "Idées" && btnIdeasRef.current) {
        btnIdeasRef.current.classList.add(
          "animate__animated",
          "animate__fadeIn"
        );
        btnIdeasRef.current.addEventListener(
          "animationend",
          () => {
            btnIdeasRef.current.classList.remove(
              "animate__animated",
              "animate__fadeIn"
            );
          },
          { once: true }
        );
      }
    }, 500); // Ajustez ce délai selon la durée de vos animations
  };

  // Réinitialiser la vue à l'état initial
  const resetView = () => {
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

  // Variants pour les animations de Framer Motion
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

  return (
    <>
      {/* Passer handleSectionClick en tant que prop navigateTo */}
      <LightningHeader navigateTo={handleSectionClick} />
      <div className="home_container">
        <nav className="nav_main-home">

          {/* Afficher les boutons de navigation en fonction de la section active */}
          <motion.div
            className="nav_buttons"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={buttonVariants}
            transition={{ duration: 0.5 }}
          >
            {activeSection === null && (
              <>
                <button
                  ref={btnCvRef}
                  className="btn_cv-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("CV")}
                >
                  CV
                </button>
                <button
                  ref={btnProjectsRef}
                  className="btn_projets-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("Projets")}
                >
                  Projets
                </button>
                <button
                  ref={btnIdeasRef}
                  className="btn_idees-main-home text-h2-100 text-28 hover-underline font-italiana"
                  onClick={() => handleSectionClick("Idées")}
                >
                  Idées
                </button>
              </>
            )}
            {activeSection === "CV" && (
              <button
                ref={btnCvRef}
                className="btn_cv-main-home text-h2-100 text-28 hover-underline font-italiana"
                onClick={() => handleSectionClick("CV")}
              >
                CV
              </button>
            )}
            {activeSection === "Projets" && (
              <button
                ref={btnProjectsRef}
                className="btn_projets-main-home text-h2-100 text-28 hover-underline font-italiana"
                onClick={() => handleSectionClick("Projets")}
              >
                Projets
              </button>
            )}
            {activeSection === "Idées" && (
              <button
                ref={btnIdeasRef}
                className="btn_idees-main-home text-h2-100 text-28 hover-underline font-italiana"
                onClick={() => handleSectionClick("Idées")}
              >
                Idées
              </button>
            )}
          </motion.div>
        </nav>

        <div className="content-container">
          <AnimatePresence mode="wait">
            {activeSection === "CV" && (
              <motion.div
                key="cv"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                <CvMobile />
              </motion.div>
            )}
            {activeSection === "Projets" && (
              <motion.div
                key="projets"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                <ProjectsSlider />
              </motion.div>
            )}
            {activeSection === "Idées" && (
              <motion.div
                key="idees"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sectionVariants}
                transition={{ duration: 0.5 }}
              >
                <IdeesMobile />
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

        {/* Afficher le cv_footer seulement dans la section CV */}
        {activeSection === "CV" && (
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
        )}
      </div>
    </>
  );
}
