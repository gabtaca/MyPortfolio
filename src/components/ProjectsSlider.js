import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import ProjectColumn from "./ProjectColumn";
import ProjectsModal from "./ProjectsModal";
import projectsData from "../jsonFiles/projects.json";
import bookendsData from "../jsonFiles/bookends.json";
import { AnimatePresence, motion } from "framer-motion";
import ProjectsDatesFooterPortrait from "./ProjectsDatesFooterPortrait";
import ProjectsDatesFooterLandscape from "./ProjectsDatesFooterLandscape";
import ProjectsModalDesktop from "./ProjectsModalDesktop";

// 1) IMPORT your IdeesMobile component
import IdeesMobile from "./IdeesMobile"; // <-- adjust path if needed

const ProjectsSlider = forwardRef(({ setHighlightedDate, isDarkMode, onProjectHover }, ref) => {
  
  const sliderRef = useRef(null);

  // State for desktop or mobile transforms
  const [transforms, setTransforms] = useState([]);
  // Which column is highlighted
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  // Which project is open in the modal
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  // Positions used by footers
  const [buttonPositions, setButtonPositions] = useState({});

  // Orientation & desktop detection
  const [isLandscape, setIsLandscape] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Inactivity timers
  const mobileInactivityTimeout = useRef(null);
  const desktopInactivityTimeout = useRef(null);

  // Only initialize once
  const hasInitialized = useRef(false);
  const lastOrientation = useRef(null); // Tracker l'orientation précédente

  // Combine project data + bookends
  const combinedData = [
    ...bookendsData.slice(0, 2),
    ...projectsData,
    ...bookendsData.slice(2),
  ];

  // The center index in that combined array
  const startProjectIndex = Math.floor(projectsData.length / 2) + 2;

  // Fonction pour réinitialiser complètement le slider
  const reinitializeSlider = useCallback(() => {
    if (!sliderRef.current || !hasInitialized.current) return;
    
    // Rescroll au centre
    const project = sliderRef.current.children[startProjectIndex];
    if (project) {
      const offset =
        project.offsetLeft -
        sliderRef.current.offsetWidth / 2 +
        project.offsetWidth / 2;
      sliderRef.current.scrollTo({
        left: offset,
        behavior: "auto",
      });
    }
    
    // Recalculer après un délai
    setTimeout(() => {
      if (!sliderRef.current) return;
      
      // Recalculer scales et highlight
      if (!isDesktop) {
        const projects = Array.from(sliderRef.current.children);
        const sliderCenter = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
        const baseScales = [1, 0.9, 0.8, 0.7];
        let minDist = Infinity;
        let centerIdx = null;
        const newTransforms = new Array(projects.length).fill(1);

        projects.forEach((proj, i) => {
          const projCenter = proj.offsetLeft + proj.offsetWidth / 2;
          const dist = Math.abs(sliderCenter - projCenter);
          if (dist < minDist) {
            minDist = dist;
            centerIdx = i;
          }
        });

        projects.forEach((_, i) => {
          const dist = Math.abs(i - centerIdx);
          const scaleIdx = Math.min(dist, baseScales.length - 1);
          newTransforms[i] = baseScales[scaleIdx];
        });

        setTransforms(newTransforms);
        setHighlightedIndex(centerIdx);
      }
      
      // Recalculer positions
      if (isDesktop) {
        const projects = Array.from(sliderRef.current.children);
        const newPositions = {};
        projects.forEach((proj, i) => {
          const rect = proj.getBoundingClientRect();
          const sliderLeft = sliderRef.current.getBoundingClientRect().left;
          const xOffset = rect.left + rect.width / 2 - sliderLeft;
          newPositions[i] = { x: xOffset, y: rect.top };
        });
        setButtonPositions(newPositions);
      } else if (isLandscape) {
        const projects = Array.from(sliderRef.current.children);
        const newPositions = {};
        projects.forEach((proj, i) => {
          const xOffset = proj.offsetLeft + proj.offsetWidth / 2;
          newPositions[i] = { x: xOffset, y: 0, width: proj.offsetWidth };
        });
        setButtonPositions(newPositions);
      } else {
        const projects = Array.from(sliderRef.current.children);
        const scrollLeft = sliderRef.current.scrollLeft;
        const newPositions = {};
        projects.forEach((proj, i) => {
          const xOffset = proj.offsetLeft + proj.offsetWidth / 2 - scrollLeft;
          newPositions[i] = { x: xOffset, y: 0 };
        });
        setButtonPositions(newPositions);
      }
    }, 100);
  }, [isDesktop, isLandscape, startProjectIndex]);

  // Gaussian function for desktop height
  const gaussScaleY = (dist) => {
    // Tweak these for your curve
    const base = 0.7;
    const amplitude = 0.3;
    const alpha = 0.3;
    return base + amplitude * Math.exp(-alpha * dist * dist);
  };

  /**
   * On desktop, get {scaleX, scaleY} for each column,
   * so columns near center are taller & slightly wider,
   * edges are smaller & narrower.
   */
  const getDesktopTransforms = useCallback(
    (centerIndex) => {
      const total = combinedData.length;
      const newTransforms = new Array(total).fill({ scaleX: 1, scaleY: 1 });

      for (let i = 0; i < total; i++) {
        const dist = Math.abs(i - centerIndex);
        // Height from gaussian
        const scaleY = gaussScaleY(dist);
        // Slight taper in width
        const scaleX = 0.9 + 0.1 * scaleY;
        newTransforms[i] = { scaleX, scaleY };
      }
      return newTransforms;
    },
    [combinedData.length]
  );

  /**
   * On mobile: highlight based on scroll-center, using
   * an array of base scales like [1, 0.9, 0.8, 0.7].
   */
  const calculateScalesAndHighlightMobile = useCallback(() => {
    if (!sliderRef.current) return;
    const projects = Array.from(sliderRef.current.children);
    const sliderCenter =
      sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;

    const baseScales = [1, 0.9, 0.8, 0.7];
    let minDist = Infinity;
    let centerIdx = null;
    const newTransforms = new Array(projects.length).fill(1);

    projects.forEach((proj, i) => {
      const projCenter = proj.offsetLeft + proj.offsetWidth / 2;
      const dist = Math.abs(sliderCenter - projCenter);
      if (dist < minDist) {
        minDist = dist;
        centerIdx = i;
      }
    });

    projects.forEach((_, i) => {
      const dist = Math.abs(i - centerIdx);
      const scaleIdx = Math.min(dist, baseScales.length - 1);
      newTransforms[i] = baseScales[scaleIdx];
    });

    setTransforms(newTransforms);
    setHighlightedIndex(centerIdx);

    // If needed, inform parent about date
    if (setHighlightedDate && combinedData[centerIdx]) {
      const projDataIdx = centerIdx - 2;
      if (projectsData[projDataIdx]) {
        setHighlightedDate(projectsData[projDataIdx].date);
      }
    }
  }, [combinedData, setHighlightedDate]);

  /**
   * -------------
   * IMPORTANT:
   * We define updateButtonPositions BEFORE using it in handleScroll, handleResize
   * -------------
   */
  // Méthode desktop : positions statiques avec getBoundingClientRect
  const updateButtonPositionsDesktop = useCallback(() => {
    if (!sliderRef.current) return;
    const projects = Array.from(sliderRef.current.children);
    const newPositions = {};

    projects.forEach((proj, i) => {
      const rect = proj.getBoundingClientRect();
      const sliderLeft = sliderRef.current.getBoundingClientRect().left;
      const xOffset = rect.left + rect.width / 2 - sliderLeft;
      newPositions[i] = { x: xOffset, y: rect.top };
    });
    setButtonPositions(newPositions);
  }, []);

  // Méthode mobile : positions relatives avec offsetLeft (pas de reflow!)
  const updateButtonPositionsMobile = useCallback(() => {
    if (!sliderRef.current) return;
    const projects = Array.from(sliderRef.current.children);
    const scrollLeft = sliderRef.current.scrollLeft;
    const newPositions = {};

    projects.forEach((proj, i) => {
      // offsetLeft = position dans le conteneur (pas de reflow)
      const xOffset = proj.offsetLeft + proj.offsetWidth / 2 - scrollLeft;
      newPositions[i] = { x: xOffset, y: 0 };
    });
    setButtonPositions(newPositions);
  }, []);

  // Méthode landscape : positions ABSOLUES pour utilisation avec transform
  const updateButtonPositionsLandscape = useCallback(() => {
    if (!sliderRef.current) return;
    const projects = Array.from(sliderRef.current.children);
    const newPositions = {};

    projects.forEach((proj, i) => {
      // Position absolue dans le slider (pas de scrollLeft soustrait)
      const xOffset = proj.offsetLeft + proj.offsetWidth / 2;
      newPositions[i] = { x: xOffset, y: 0, width: proj.offsetWidth };
    });
    
    setButtonPositions(newPositions);
  }, []);

  // Scroll to a given project index (mobile)
  const scrollToProjectIndex = useCallback((index, smooth = true) => {
    if (!sliderRef.current) return;
    const project = sliderRef.current.children[index];
    if (!project) return;

    const offset =
      project.offsetLeft -
      sliderRef.current.offsetWidth / 2 +
      project.offsetWidth / 2;

    sliderRef.current.scrollTo({
      left: offset,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // MOBILE inactivity - défini après scrollToProjectIndex
  const resetMobileInactivityTimeout = useCallback(() => {
    if (isDesktop || isLandscape) return; // Désactiver en landscape
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      clearTimeout(mobileInactivityTimeout.current);
      mobileInactivityTimeout.current = setTimeout(() => {
        // Double vérification de landscape au moment de l'exécution
        const isCurrentlyLandscape = window.matchMedia("(orientation: landscape)").matches;
        if (highlightedIndex !== null && !isCurrentlyLandscape) {
          scrollToProjectIndex(highlightedIndex, true);
        }
      }, 2000);
    }
  }, [isDesktop, isLandscape, highlightedIndex, scrollToProjectIndex]);

  // DESKTOP inactivity
  const resetDesktopInactivityTimeout = useCallback(() => {
    if (!isDesktop) return;
    clearTimeout(desktopInactivityTimeout.current);
    desktopInactivityTimeout.current = setTimeout(() => {
      setHighlightedIndex(startProjectIndex);
    }, 2000);
  }, [isDesktop, startProjectIndex]);

  // Desktop transforms whenever highlight changes
  useEffect(() => {
    if (isDesktop && highlightedIndex !== null) {
      const newTransforms = getDesktopTransforms(highlightedIndex);
      setTransforms(newTransforms);

      // If needed, update date
      if (setHighlightedDate && combinedData[highlightedIndex]) {
        const projDataIdx = highlightedIndex - 2;
        if (projectsData[projDataIdx]) {
          setHighlightedDate(projectsData[projDataIdx].date);
        }
      }
    }
  }, [isDesktop, highlightedIndex, getDesktopTransforms]);

  // Hover event (desktop)
  const handleColumnHover = useCallback(
    (index) => {
      if (!isDesktop) return;
      setHighlightedIndex(index);
      resetDesktopInactivityTimeout();
    },
    [isDesktop, resetDesktopInactivityTimeout]
  );

  // SCROLL for mobile
  const handleScroll = useCallback(() => {
    if (!isDesktop) {
      calculateScalesAndHighlightMobile();
      resetMobileInactivityTimeout();
      // En landscape : pas de updateButtonPositions (on utilise transform)
      if (!isLandscape) {
        updateButtonPositionsMobile();
      }
    }
  }, [
    isDesktop,
    isLandscape,
    calculateScalesAndHighlightMobile,
    resetMobileInactivityTimeout,
    updateButtonPositionsMobile,
  ]);

  // RESIZE for mobile and desktop
  const handleResize = useCallback(() => {
    if (isDesktop) {
      updateButtonPositionsDesktop();
    } else if (isLandscape) {
      calculateScalesAndHighlightMobile();
      updateButtonPositionsLandscape();
    } else {
      calculateScalesAndHighlightMobile();
      updateButtonPositionsMobile();
    }
  }, [isDesktop, isLandscape, calculateScalesAndHighlightMobile, updateButtonPositionsMobile, updateButtonPositionsDesktop, updateButtonPositionsLandscape]);

  // Expose scrollToProjectIndex to parent
  useImperativeHandle(ref, () => ({
    scrollToProjectIndex,
    reinitializeSlider, // Permet au parent de réinitialiser
  }));

  // First mount
  useEffect(() => {
    if (!hasInitialized.current) {
      if (!isDesktop) {
        // Mobile
        scrollToProjectIndex(startProjectIndex, false);
        calculateScalesAndHighlightMobile();
        // Attendre que le scroll soit fini avant de calculer les positions
        setTimeout(() => {
          if (isLandscape) {
            updateButtonPositionsLandscape();
          } else {
            updateButtonPositionsMobile();
          }
        }, 200);
      } else {
        // Desktop
        setHighlightedIndex(startProjectIndex);
        updateButtonPositionsDesktop();
      }
      hasInitialized.current = true;
    }
  }, [
    isDesktop,
    isLandscape,
    scrollToProjectIndex,
    startProjectIndex,
    calculateScalesAndHighlightMobile,
    updateButtonPositionsMobile,
    updateButtonPositionsDesktop,
    updateButtonPositionsLandscape,
  ]);

  // Add event listeners
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  // Orientation & desktop detection
  useEffect(() => {
    const landscapeQuery = window.matchMedia("(orientation: landscape)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    setIsLandscape(landscapeQuery.matches);
    setIsDesktop(desktopQuery.matches);

    const handleOrientationChange = (e) => {
      setIsLandscape(e.matches);
      // Clear le timeout si on passe en landscape
      if (e.matches) {
        clearTimeout(mobileInactivityTimeout.current);
        // Recalculer les positions en mode absolu pour landscape
        setTimeout(() => {
          if (sliderRef.current) {
            updateButtonPositionsLandscape();
          }
        }, 100);
      } else {
        // Repasser en mode relatif pour portrait
        setTimeout(() => {
          if (sliderRef.current) {
            updateButtonPositionsMobile();
          }
        }, 100);
      }
    };
    const handleDesktopChange = (e) => setIsDesktop(e.matches);

    landscapeQuery.addEventListener("change", handleOrientationChange);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      landscapeQuery.removeEventListener("change", handleOrientationChange);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  // Effet séparé : recalculer quand isLandscape change APRÈS l'initialisation
  useEffect(() => {
    if (!hasInitialized.current) return; // Attendre que l'initialisation soit faite
    
    // Détecter un changement d'orientation
    const orientationChanged = lastOrientation.current !== null && lastOrientation.current !== isLandscape;
    lastOrientation.current = isLandscape;
    
    if (orientationChanged && sliderRef.current) {
      // Sauvegarder le projet actuellement highlighted
      const currentHighlighted = highlightedIndex !== null ? highlightedIndex : startProjectIndex;
      
      // Changement d'orientation détecté : rescroller vers le projet highlighted
      setTimeout(() => {
        if (!sliderRef.current) return;
        
        // Scroller vers le projet qui était highlighted
        const project = sliderRef.current.children[currentHighlighted];
        if (project) {
          const offset =
            project.offsetLeft -
            sliderRef.current.offsetWidth / 2 +
            project.offsetWidth / 2;
          sliderRef.current.scrollTo({
            left: offset,
            behavior: "auto",
          });
        }
        
        // Recalculer après le scroll
        setTimeout(() => {
          if (!sliderRef.current) return;
          
          // Recalculer scales avec le nouveau highlighted
          if (!isDesktop) {
            const projects = Array.from(sliderRef.current.children);
            const sliderCenter = sliderRef.current.scrollLeft + sliderRef.current.offsetWidth / 2;
            const baseScales = [1, 0.9, 0.8, 0.7];
            let minDist = Infinity;
            let centerIdx = null;
            const newTransforms = new Array(projects.length).fill(1);

            projects.forEach((proj, i) => {
              const projCenter = proj.offsetLeft + proj.offsetWidth / 2;
              const dist = Math.abs(sliderCenter - projCenter);
              if (dist < minDist) {
                minDist = dist;
                centerIdx = i;
              }
            });

            projects.forEach((_, i) => {
              const dist = Math.abs(i - centerIdx);
              const scaleIdx = Math.min(dist, baseScales.length - 1);
              newTransforms[i] = baseScales[scaleIdx];
            });

            setTransforms(newTransforms);
            setHighlightedIndex(centerIdx);
          }
          
          // Recalculer positions selon le mode
          const projects = Array.from(sliderRef.current.children);
          const newPositions = {};
          
          if (isDesktop) {
            projects.forEach((proj, i) => {
              const rect = proj.getBoundingClientRect();
              const sliderLeft = sliderRef.current.getBoundingClientRect().left;
              const xOffset = rect.left + rect.width / 2 - sliderLeft;
              newPositions[i] = { x: xOffset, y: rect.top };
            });
          } else if (isLandscape) {
            projects.forEach((proj, i) => {
              const xOffset = proj.offsetLeft + proj.offsetWidth / 2;
              newPositions[i] = { x: xOffset, y: 0, width: proj.offsetWidth };
            });
          } else {
            const scrollLeft = sliderRef.current.scrollLeft;
            projects.forEach((proj, i) => {
              const xOffset = proj.offsetLeft + proj.offsetWidth / 2 - scrollLeft;
              newPositions[i] = { x: xOffset, y: 0 };
            });
          }
          setButtonPositions(newPositions);
        }, 100);
      }, 100);
    }
    // Ne PAS inclure les fonctions dans les dépendances pour éviter la boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLandscape, isDesktop, highlightedIndex, startProjectIndex]);

  // Decide which footer
  const shouldUseLandscapeFooter = isDesktop || isLandscape;

  // Pré-render les colonnes avec useMemo pour éviter les re-renders en landscape
  const renderedColumns = useMemo(() => {
    // En desktop : filtrer les bookends (colonnes blanches)
    const dataToRender = isDesktop 
      ? combinedData.filter(project => !project.id.startsWith("blank"))
      : combinedData;
    
    return dataToRender.map((project, displayIndex) => {
      // En desktop, les indices dans buttonPositions correspondent à combinedData complet
      // Donc on doit retrouver l'index original
      const originalIndex = isDesktop 
        ? combinedData.findIndex(p => p.id === project.id)
        : displayIndex;
      
      const dist = Math.abs(originalIndex - highlightedIndex);
      const buttonZIndex = combinedData.length + 15 - dist;

      // transforms[originalIndex] is either a number (mobile) or {scaleX, scaleY} (desktop).
      const t = transforms[originalIndex] || 1;

      let scaleStyles;
      if (isDesktop && typeof t === "object") {
        scaleStyles = { scaleX: t.scaleX, scaleY: t.scaleY };
      } else {
        // Mobile - scale actif en portrait ET landscape
        scaleStyles = { scale: typeof t === "number" ? t : 1 };
      }

      return (
        <motion.div
          key={project.id}
          className="project-motion-wrapper"
          style={{
            transformOrigin: "bottom center",
            position: "relative",
            zIndex: buttonZIndex,
          }}
          animate={{
            ...scaleStyles,
            transition: { type: "spring", stiffness: 600, damping: 25 },
          }}
          // On desktop: highlight on hover
          onMouseEnter={() => {
            handleColumnHover(originalIndex);
            // Envoyer les infos du projet au parent (HomeDesktop)
            if (isDesktop && onProjectHover && !project.id.startsWith("blank")) {
              onProjectHover(project);
            }
          }}
          onMouseLeave={() => {
            // Réinitialiser quand on quitte
            if (isDesktop && onProjectHover) {
              onProjectHover(null);
            }
          }}
        >
          <ProjectColumn
            project={project}
            zIndexValue={buttonZIndex}
            centerIndex={highlightedIndex}
            index={originalIndex}
            isHighlighted={highlightedIndex === originalIndex}
            scale={1} // motion.div handles the actual scaling
            onClick={() => {
              // On mobile, center on this column
              if (!isDesktop && !project.id.startsWith("blank")) {
                scrollToProjectIndex(originalIndex);
              }
              // Then open the modal
              if (!project.id.startsWith("blank")) {
                setTimeout(() => setSelectedProjectIndex(originalIndex - 2), 300);
              }
            }}
          />
        </motion.div>
      );
    });
  }, [combinedData, highlightedIndex, transforms, isDesktop, isLandscape, handleColumnHover, onProjectHover, scrollToProjectIndex]);

  return (
    <>
      <div
        ref={sliderRef}
        className={`projects-slider-menu ${
          isDesktop
            ? "desktop-slider"
            : isLandscape
            ? "landscape-slider"
            : "portrait-slider"
        }`}
        style={{
          overflowX: isDesktop ? "visible" : "scroll",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseMove={() => {
          // On desktop, reset inactivity if user moves mouse
          if (isDesktop) {
            resetDesktopInactivityTimeout();
          }
        }}
      >
        {renderedColumns}
      </div>

      {/* Project Details Modal */}
<AnimatePresence>
  {selectedProjectIndex !== null &&
    (isDesktop ? (
      <ProjectsModalDesktop
        project={projectsData[selectedProjectIndex]}
        currentIndex={selectedProjectIndex}
        onClose={() => setSelectedProjectIndex(null)}
        onNext={() => {
          setSelectedProjectIndex((prevIndex) => {
            const newIndex = Math.min(prevIndex + 1, projectsData.length - 1);
            if (!isDesktop) scrollToProjectIndex(newIndex + 2);
            return newIndex;
          });
        }}
        onPrevious={() => {
          setSelectedProjectIndex((prevIndex) => {
            const newIndex = Math.max(prevIndex - 1, 0);
            if (!isDesktop) scrollToProjectIndex(newIndex + 2);
            return newIndex;
          });
        }}
        projectsData={projectsData}
        isDarkMode={isDarkMode}
      />
    ) : (
      <ProjectsModal
        project={projectsData[selectedProjectIndex]}
        currentIndex={selectedProjectIndex}
        onClose={() => setSelectedProjectIndex(null)}
        onNext={() => {
          setSelectedProjectIndex((prevIndex) => {
            const newIndex = Math.min(prevIndex + 1, projectsData.length - 1);
            if (!isDesktop) scrollToProjectIndex(newIndex + 2);
            return newIndex;
          });
        }}
        onPrevious={() => {
          setSelectedProjectIndex((prevIndex) => {
            const newIndex = Math.max(prevIndex - 1, 0);
            if (!isDesktop) scrollToProjectIndex(newIndex + 2);
            return newIndex;
          });
        }}
        projectsData={projectsData}
      />
    ))}
</AnimatePresence>

      {/* Footer (landscape or portrait) */}
      {shouldUseLandscapeFooter ? (
        <ProjectsDatesFooterLandscape
          projectsData={isDesktop ? projectsData : combinedData}
          buttonPositions={buttonPositions}
          scrollLeft={sliderRef.current?.scrollLeft || 0}
          isLandscape={isLandscape}
          isDesktop={isDesktop}
        />
      ) : (
        <ProjectsDatesFooterPortrait
          projectsData={projectsData}
          buttonPositions={buttonPositions}
          highlightedIndex={highlightedIndex - 2}
          scrollToProjectIndex={scrollToProjectIndex}
        />
      )}
    </>
  );
});

export default ProjectsSlider;
