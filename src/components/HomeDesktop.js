// src/components/HomeDesktop.js
import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import ProjectsSlider from "./ProjectsSlider";
import IdeesMobile from "./IdeesMobile"; // Composant gérant la section Idées (mobile et dropdown)
import ideesData from "../jsonFiles/ideesData.json"; // Pour récupérer la liste des catégories

const HomeDesktop = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // États pour gérer l'ouverture des tiroirs
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isIdeesOpen, setIsIdeesOpen] = useState(false);

  // État pour la chaîne (pour le mode sombre)
  const [chainPulled, setChainPulled] = useState(false);

  // État pour forcer le remontage de l'overlay (animation flicker)
  const [flickerKey, setFlickerKey] = useState(0);

  // État global pour la catégorie active (défini avec useState)
  const [activeCategory, setActiveCategory] = useState(null);

  // Lors de l'ouverture du tiroir "Idées", si aucune catégorie n'est définie, on définit la catégorie par défaut
  useEffect(() => {
    if (isIdeesOpen && activeCategory === null) {
      const categories = Object.keys(ideesData);
      if (categories.includes("Art")) {
        setActiveCategory("Art");
      } else if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, [isIdeesOpen, activeCategory]);

  // Fonction pour toggler un seul tiroir à la fois
  const toggleDrawer = (drawerName) => {
    if (drawerName === "cv") {
      setIsCvOpen(!isCvOpen);
      setIsProjectsOpen(false);
      setIsIdeesOpen(false);
    } else if (drawerName === "projects") {
      setIsProjectsOpen(!isProjectsOpen);
      setIsCvOpen(false);
      setIsIdeesOpen(false);
    } else if (drawerName === "idees") {
      setIsIdeesOpen(!isIdeesOpen);
      setIsCvOpen(false);
      setIsProjectsOpen(false);
    }
  };

  // Gestion du clic sur la chaîne pour changer le mode sombre et déclencher l'animation flicker
  const handlePullChain = () => {
    setChainPulled(true);
    if (!isDarkMode) {
      // Incrémente la clé pour forcer le remontage de l'overlay
      setFlickerKey((prev) => prev + 1);
    }
    toggleDarkMode();
  };

  // Réinitialisation de chainPulled après 1 seconde
  useEffect(() => {
    let timer;
    if (chainPulled) {
      timer = setTimeout(() => {
        setChainPulled(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [chainPulled]);

  // Tableau de keyframes pour l'animation flicker
  const keyframeTimes = [
    0, 0.038, 0.077, 0.115, 0.154, 0.192, 0.231, 0.269, 0.308, 0.346, 0.385,
    0.423, 0.462, 0.5, 0.538, 0.577, 0.615, 0.654, 0.692, 0.731, 0.769, 0.808,
    0.846, 0.885, 0.923, 0.962, 1,
  ];

  return (
    <div className="home_desktop-main">
      {/* HEADER */}
      <div className="home_desktop-header">
        <div
          className="home_desktop-titles"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <h1>Gabriel Taca</h1>
          <p>Idéation créative en mode solution</p>
          {/* Animation Neon Flicker en mode sombre */}
          <AnimatePresence>
            {isDarkMode && (
              <motion.div
                key={`flickerOverlay-${flickerKey}`}
                className="flicker-overlay"
                initial="flicker"
                animate="final"
                exit={{ opacity: 0, transition: { duration: 0 } }}
                variants={{
                  flicker: {
                    opacity: [1],
                    filter: [
                      "brightness(0.1)",
                      "brightness(0.5)",
                      "brightness(0.7)",
                      "brightness(0.2)",
                      "brightness(1.2)",
                      "brightness(0.9)",
                    ],
                  },
                  final: { opacity: 1, filter: "brightness(0.9)" },
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  times: keyframeTimes,
                }}
                style={{
                  position: "absolute",
                  top: "-90px",
                  left: "18%",
                  width: "70%",
                  height: "180px",
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Bouton pull-chain pour le mode sombre */}
        <div className="ctrl_darkmode-pull">
          <button className="btn_pull-chain" onClick={handlePullChain}>
            <motion.img
              src={
                isDarkMode
                  ? "/images/lamp_pull-dark.png"
                  : "/images/lamp_pull-light.png"
              }
              alt="Chaine de lampe pour interupteur"
              initial="idle"
              animate={chainPulled ? "pull" : "idle"}
              variants={{
                idle: { rotate: 0, transformOrigin: "top center" },
                pull: {
                  rotate: [0, 4, -3, 2, -2, 1, 0],
                  scaleY: [1, 1.01, 0.995, 1.005, 1],
                  transformOrigin: "top center",
                  transition: { duration: 1, ease: "easeInOut" },
                },
              }}
            />
          </button>
        </div>
      </div>

      {/* NAV / SECTIONS */}
      <nav className="home_desktop-nav">
        {/* === CV SECTION === */}
        <section className="section_desktop-cv">
          <AnimatePresence>
            {isCvOpen && (
              <motion.div
                className="drawer drawer-cv"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn close-cv"
                  onClick={() => setIsCvOpen(false)}
                >
                  <h4>CV</h4>
                  <p>✖</p>
                </button>
                <div className="cv-content">
                  <object
                    className="cv-object"
                    data="/pdf/CV-Gabriel_Taca.pdf"
                    width="100%"
                    style={{ border: "none" }}
                    title="CV Gabriel Taca"
                  >
                    <p>
                      Your browser does not support PDFs.{" "}
                      <a href="/pdf/CV-Gabriel_Taca.pdf">Download the PDF</a>.
                    </p>
                  </object>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="home_desktop-cv"
            onClick={() => toggleDrawer("cv")}
          >
            <h2 className="btn_cv-homeDesktop">CV</h2>
          </button>
        </section>

        {/* === PROJECTS SECTION === */}
        <section className="section_desktop-projects">
          <AnimatePresence>
            {isProjectsOpen && (
              <motion.div
                className="drawer drawer-projects"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn close-projects"
                  onClick={() => setIsProjectsOpen(false)}
                >
                  <h4>Projets</h4>
                  <p>✖</p>
                </button>
                <ProjectsSlider forceLandscapeFooter />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="home_desktop-projects"
            onClick={() => toggleDrawer("projects")}
          >
            <h2 className="btn_projects-homeDesktop">Projets</h2>
          </button>
        </section>

        {/* === IDÉES SECTION === */}
        <section className="section_desktop-idees">
          <AnimatePresence>
            {isIdeesOpen && (
              <motion.div
                key="idees-drawer"
                className="drawer drawer-idees"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <button
                  className="close-drawer-btn close-ideas"
                  onClick={() => setIsIdeesOpen(false)}
                >
                  <h4>Idées</h4>
                  <p>✖</p>
                </button>
                {/* On enveloppe IdeesMobile dans un div statique pour que son contenu ne déclenche pas de nouvelle animation de scale */}
                <div className="idees-content-wrapper">
                  <IdeesMobile
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="home_desktop-idees"
            onClick={() => {
              // Si le tiroir d'idées est ouvert, le fermer ; sinon l'ouvrir
              if (isIdeesOpen) {
                setIsIdeesOpen(false);
              } else {
                toggleDrawer("idees");
              }
            }}
          >
            <h2 className="btn_idees-homeDesktop">Idées</h2>
          </button>
        </section>
      </nav>

      <div
        className="home_desktop-presentation-content"
        style={{
          filter:
            isCvOpen || isProjectsOpen || isIdeesOpen ? "blur(1.5rem)" : "none",
        }}
      >
        <img
          className="home_desktop-portrait"
          src={
            isDarkMode
              ? "/images/portrait_desktop-darrkmode.png"
              : "/images/portrait_desktop.png"
          }
          alt="Portrait de Gabriel Taca"
        />
        <span>
          <p>Designer UI/UX,</p>
          <br />
          <p>
            Fort de plus d'une vingtaine d'années d'expérience dans la
            construction et l'immobilier, j'ai appris à concevoir et créer des
            espaces de vie alliant harmonie, fonctionnalité et esthétisme. Que
            ce soit en tant qu'entrepreneur, ouvrier ou même propriétaire, mon
            parcours m'a doté d'une vision globale et d'une approche centrée sur
            le service client, des atouts essentiels dans tous mes projets.
          </p>
          <br />
          <p>
            Aujourd'hui, j'ai choisi de transposer cette expertise du monde réel
            vers l'univers numérique. Dans la même logique qui m'a permis de
            façonner l'environnement de mes clients pour améliorer leur
            quotidien, je conçois désormais des interfaces adaptées, intuitives
            et engageantes, où chaque détail compte.
          </p>
          <br />
          <p>
            Mon approche repose sur l'inspiration, l'idéation et le pragmatisme.
            Pour chaque projet, nous visons à bâtir une expérience digitale à la
            fois robuste et élégante, des espaces virtuels qui, à l'image d'une
            maison bien conçue, invitent au bien-être et à la découverte.
          </p>
        </span>
      </div>
    </div>
  );
};

export default HomeDesktop;
