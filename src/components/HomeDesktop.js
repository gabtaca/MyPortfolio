import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import ProjectsSlider from "./ProjectsSlider";
import IdeesMobile from "./IdeesMobile"; // <-- import your ideas component

const HomeDesktop = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Manage drawers
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isIdeesOpen, setIsIdeesOpen] = useState(false);

  // Chain pulled for dark mode
  const [chainPulled, setChainPulled] = useState(false);

  // State to force re-mounting of the overlay to trigger the neon flicker animation
  const [flickerKey, setFlickerKey] = useState(0);

  // Toggle only one drawer at a time
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

  // Pull chain click => toggle dark mode and trigger neon flicker animation when switching to dark mode
  const handlePullChain = () => {
    setChainPulled(true);
    if (!isDarkMode) {
      // Increment the key so the overlay re-mounts and runs the neon flicker animation
      setFlickerKey((prev) => prev + 1);
    }
    toggleDarkMode();
  };

  // Reset chainPulled after 1 second so user can reclick
  useEffect(() => {
    let timer;
    if (chainPulled) {
      timer = setTimeout(() => {
        setChainPulled(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [chainPulled]);

  // Evenly spaced times for 27 keyframes
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
          {/* Neon Tube Flicker Overlay – rendered only in Dark Mode */}
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
                  left: "22%",
                  width: "70%",
                  height: "180px",
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Pull-chain button */}
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
                idle: {
                  rotate: 0,
                  transformOrigin: "top center",
                },
                pull: {
                  rotate: [0, 4, -3, 2, -2, 1, 0],
                  scaleY: [1, 1.01, 0.995, 1.005, 1],
                  transformOrigin: "top center",
                  transition: {
                    duration: 1,
                    ease: "easeInOut",
                  },
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
                  <p>Fermer</p>
                </button>
                <div className="cv-content">
                  <iframe
                    src="/pdf/CV-Gabriel_Taca.pdf"
                    width="100%"
                    height="1200px"
                    style={{ border: "none" }}
                    title="CV Gabriel Taca"
                  ></iframe>
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
                  <p>Fermer</p>
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
                className="drawer drawer-idees"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <button
                  className="close-drawer-btn close-ideas"
                  onClick={() => setIsIdeesOpen(false)}
                  >
                  <p>Fermer</p>
                </button>
                <IdeesMobile />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="home_desktop-idees"
            onClick={() => toggleDrawer("idees")}
          >
            <h2 className="btn_idees-homeDesktop">Idées</h2>
          </button>
        </section>
      </nav>
      <div className="home_desktop-presentation-content">
        <img
          className="home_desktop-portrait"
          src={
            isDarkMode
              ? "/images/portrait_desktop-darrkmode.png"
              : "/images/portrait_desktop.png"
          }
          alt="Portrait de Gabriel Taca"
        />
        <text>
          <p>Designer UI/UX,</p>
          <br></br>
          <p>
            Fort de plus de vingt ans d’expérience dans le domaine de la construction et l'immobilier.
            Jumelé à une décennie en tant qu’entrepreneur général, j’ai appris à concevoir et créer des espaces de vie où
            l’harmonie, la fonctionnalité et l’esthétique se conjuguent et offrent des expériences uniques.
          </p>
          <br></br>
          <p>
            Pour l'avenir, j’ai choisi de transposer cette expertise du monde réel à l’univers du
            numérique. Tout comme j’ai façonné des pièces et des intérieurs pour
            améliorer le quotidien de mes clients, je conçois désormais des
            interfaces intuitives et engageantes, où chaque détail compte.
          </p>
          <br></br>
          <p>
            Mon approche: inspiration, idéation, pragmatisme. À chaque projet nous visons à bâtir des expériences digitales solides et
            élégantes. Des projets virtuels qui, à l’image d’une maison bien
            conçue, invitent à la découverte et au bien-être.
          </p>
        </text>
      </div>
    </div>
  );
};

export default HomeDesktop;
