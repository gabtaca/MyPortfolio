import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import ProjectColumn from "./ProjectColumn";
import ProjectsModal from "./ProjectsModal";
import projectsData from "../jsonFiles/projects.json";
import bookendsData from "../jsonFiles/bookends.json";
import { AnimatePresence, motion } from "framer-motion";
import ProjectsDatesFooterPortrait from "./ProjectsDatesFooterPortrait";
import ProjectsDatesFooterLandscape from "./ProjectsDatesFooterLandscape";

// 1) IMPORT your IdeesMobile component
import IdeesMobile from "./IdeesMobile"; // <-- adjust path if needed

const ProjectsSlider = forwardRef(({ setHighlightedDate }, ref) => {
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

  // Combine project data + bookends
  const combinedData = [
    ...bookendsData.slice(0, 2),
    ...projectsData,
    ...bookendsData.slice(2),
  ];

  // The center index in that combined array
  const startProjectIndex = Math.floor(projectsData.length / 2) + 2;

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
  const updateButtonPositions = useCallback(() => {
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

  // MOBILE inactivity
  const resetMobileInactivityTimeout = useCallback(() => {
    if (isDesktop) return;
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      clearTimeout(mobileInactivityTimeout.current);
      mobileInactivityTimeout.current = setTimeout(() => {
        if (highlightedIndex !== null) {
          scrollToProjectIndex(highlightedIndex, true);
        }
      }, 2000);
    }
  }, [isDesktop, highlightedIndex]);

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
      updateButtonPositions();
    }
  }, [
    isDesktop,
    calculateScalesAndHighlightMobile,
    resetMobileInactivityTimeout,
    updateButtonPositions,
  ]);

  // RESIZE for mobile
  const handleResize = useCallback(() => {
    if (!isDesktop) {
      calculateScalesAndHighlightMobile();
      updateButtonPositions();
    }
  }, [isDesktop, calculateScalesAndHighlightMobile, updateButtonPositions]);

  // Expose scrollToProjectIndex to parent
  useImperativeHandle(ref, () => ({
    scrollToProjectIndex,
  }));

  // First mount
  useEffect(() => {
    if (!hasInitialized.current) {
      if (!isDesktop) {
        // Mobile
        scrollToProjectIndex(startProjectIndex, false);
        calculateScalesAndHighlightMobile();
      } else {
        // Desktop
        setHighlightedIndex(startProjectIndex);
      }
      updateButtonPositions();
      hasInitialized.current = true;
    }
  }, [
    isDesktop,
    scrollToProjectIndex,
    startProjectIndex,
    calculateScalesAndHighlightMobile,
    updateButtonPositions,
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

    const handleOrientationChange = (e) => setIsLandscape(e.matches);
    const handleDesktopChange = (e) => setIsDesktop(e.matches);

    landscapeQuery.addEventListener("change", handleOrientationChange);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      landscapeQuery.removeEventListener("change", handleOrientationChange);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  // Decide which footer
  const shouldUseLandscapeFooter = isDesktop || isLandscape;

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
          overflowX: isDesktop ? "hidden" : "scroll",
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
        {combinedData.map((project, index) => {
          const dist = Math.abs(index - highlightedIndex);
          const buttonZIndex = combinedData.length + 15 - dist;

          // transforms[index] is either a number (mobile) or {scaleX, scaleY} (desktop).
          const t = transforms[index] || 1;

          let scaleStyles;
          if (isDesktop && typeof t === "object") {
            scaleStyles = { scaleX: t.scaleX, scaleY: t.scaleY };
          } else {
            // Mobile
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
              onMouseEnter={() => handleColumnHover(index)}
            >
              <ProjectColumn
                project={project}
                zIndexValue={buttonZIndex}
                centerIndex={highlightedIndex}
                index={index}
                isHighlighted={highlightedIndex === index}
                scale={1} // motion.div handles the actual scaling
                onClick={() => {
                  // On mobile, center on this column
                  if (!isDesktop && !project.id.startsWith("blank")) {
                    scrollToProjectIndex(index);
                  }
                  // Then open the modal
                  if (!project.id.startsWith("blank")) {
                    setTimeout(() => setSelectedProjectIndex(index - 2), 300);
                  }
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProjectIndex !== null && (
          <ProjectsModal
            project={projectsData[selectedProjectIndex]}
            currentIndex={selectedProjectIndex}
            onClose={() => setSelectedProjectIndex(null)}
            onNext={() => {
              setSelectedProjectIndex((prevIndex) => {
                const newIndex = Math.min(prevIndex + 1, projectsData.length - 1);
                if (!isDesktop) {
                  scrollToProjectIndex(newIndex + 2);
                }
                return newIndex;
              });
            }}
            onPrevious={() => {
              setSelectedProjectIndex((prevIndex) => {
                const newIndex = Math.max(prevIndex - 1, 0);
                if (!isDesktop) {
                  scrollToProjectIndex(newIndex + 2);
                }
                return newIndex;
              });
            }}
            projectsData={projectsData}
          />
        )}
      </AnimatePresence>

      {/* Footer (landscape or portrait) */}
      {shouldUseLandscapeFooter ? (
        <ProjectsDatesFooterLandscape
          projectsData={combinedData}
          buttonPositions={buttonPositions}
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
