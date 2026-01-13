// src/components/ProjectsModalV2.jsx

import React, { useState, useEffect, useRef } from "react";

export default function ProjectsModalV2({
  project,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  projectsData,
}) {
  if (!project || project.type === "blank") return null;

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [animationClass, setAnimationClass] = useState("modal-initial-open");
  const [borderSide, setBorderSide] = useState("");

  // Use the first available link (github, figma, etc.)
  const linkUrl = project.lien ? Object.values(project.lien)[0] : null;
  const linkType = project.lien ? Object.keys(project.lien)[0] : null;
  const modalRef = useRef(null);
  const swipeThreshold = 40;
  const dragLimits = { x: 200, y: 200 };

  const validProjects = projectsData.filter((project) => !isNaN(project.id));
  const validIndex = validProjects.findIndex((p) => p.id === project.id);

  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    if (isModalOpen) {
      console.log("Modal is opening with 'modal-initial-open' animation.");
      setAnimationClass("modal-initial-open");
      setIsModalOpen(false); // Prevent re-triggering
    }
  }, [isModalOpen]);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const startDrag = (e) => {
    setIsDragging(true);
    const startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    modalRef.current.startX = startX;
    modalRef.current.startY = startY;
    setAnimationClass("");
    console.log("Drag started:", { startX, startY });
  };

  const onDrag = (e) => {
    if (!isDragging) return;

    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = currentX - modalRef.current.startX;
    const deltaY = currentY - modalRef.current.startY;

    const newX = Math.max(-dragLimits.x, Math.min(deltaX, dragLimits.x));
    const newY = Math.max(-dragLimits.y, Math.min(deltaY, dragLimits.y));

    setPosition({
      x: newX,
      y: newY,
    });

    console.log("Dragging:", { currentX, currentY, deltaX, deltaY, newX, newY });
  };

  const endDrag = () => {
    setIsDragging(false);

    const { x, y } = position;

    console.log("Drag ended with position:", { x, y });

    if (Math.abs(x) > Math.abs(y)) {
      if (Math.abs(x) > swipeThreshold) {
        if (x > 0) {
          // Swipe Right
          if (validIndex > 0) {
            console.log("Swipe right: Start swipe-out-right animation");
            setAnimationClass("modal-swipe-out-right");
            setTimeout(() => {
              console.log(
                "Swipe right: Trigger onPrevious and start swipe-in-left animation"
              );
              onPrevious();
              setAnimationClass("modal-swipe-in-left");
            }, 500);
          } else {
            console.log(
              "Swipe right: No more projects, triggering shake animation"
            );
            handleShake("left");
          }
        } else {
          // Swipe Left
          if (validIndex < validProjects.length - 1) {
            console.log("Swipe left: Start swipe-out-left animation");
            setAnimationClass("modal-swipe-out-left");
            setTimeout(() => {
              console.log(
                "Swipe left: Trigger onNext and start swipe-in-right animation"
              );
              onNext();
              setAnimationClass("modal-swipe-in-right");
            }, 500);
          } else {
            console.log(
              "Swipe left: No more projects, triggering shake animation"
            );
            handleShake("right");
          }
        }
      }
    } else if (Math.abs(y) > swipeThreshold) {
      if (y > 0) {
        console.log("Swipe down: Closing modal with animation");
        closeModalWithAnimation();
      }
    }

    setPosition({ x: 0, y: 0 });
  };

  const handleShake = (direction) => {
    console.log(`Shake animation triggered for direction: ${direction}`);
    setBorderSide(direction === "left" ? "left" : "right");
    setAnimationClass("modal-shake");
    setTimeout(() => {
      console.log("Shake animation ended");
      setBorderSide("");
      setAnimationClass("");
    }, 300);
  };

  const closeModalWithAnimation = () => {
    console.log("Close modal: Starting close animation");
    setAnimationClass("modal-close");
    setTimeout(() => {
      console.log("Close modal: Animation ended, executing onClose");
      onClose();
    }, 500);
  };

  // Fonction pour loguer les transformations actuelles
  const logTransformations = () => {
    if (modalRef.current) {
      const computedStyle = window.getComputedStyle(modalRef.current);
      const transform = computedStyle.getPropertyValue("transform");
      console.log("Current Transform:", transform);
    }
  };

  // Appeler logTransformations après chaque mise à jour de position ou d'animationClass
  useEffect(() => {
    logTransformations();
  }, [position, animationClass]);

  // Écouteur pour réinitialiser l'état après l'animation et ajouter des logs
  useEffect(() => {
    const modalElement = modalRef.current;

    const handleAnimationStart = (e) => {
      console.log(`Animation started: ${e.animationName}`);
    };

    const handleAnimationIteration = (e) => {
      console.log(`Animation iteration: ${e.animationName}`);
    };

    const handleAnimationEnd = (e) => {
      console.log(`Animation ended: ${e.animationName}`);
      // Vérifiez quelle animation s'est terminée
      if (
        e.animationName === "modalOpenAndSpring" ||
        e.animationName === "swipeInLeft" ||
        e.animationName === "swipeInRight"
      ) {
        // Réinitialiser la classe d'animation si nécessaire
        setAnimationClass("");
        setPosition({ x: 0, y: 0 });
        console.log("Reset animation class and position after animation end.");
      }
    };

    if (modalElement) {
      modalElement.addEventListener("animationstart", handleAnimationStart);
      modalElement.addEventListener("animationiteration", handleAnimationIteration);
      modalElement.addEventListener("animationend", handleAnimationEnd);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("animationstart", handleAnimationStart);
        modalElement.removeEventListener("animationiteration", handleAnimationIteration);
        modalElement.removeEventListener("animationend", handleAnimationEnd);
      }
    };
  }, []);

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      if (validIndex > 0) {
        onPrevious();
      } else {
        handleShake("left");
      }
    } else if (direction === "right") {
      if (validIndex < validProjects.length - 1) {
        onNext();
      } else {
        handleShake("right");
      }
    }
  };

  return (
    <div className="overlay" onClick={closeModalWithAnimation}>
      {/* Wrapper pour gérer les transformations de dragging */}
      <div
        className="modal-wrapper"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onMouseMove={onDrag}
        onTouchMove={onDrag}
        onMouseUp={endDrag}
        onTouchEnd={endDrag}
      >
        {/* Modal avec les animations */}
        <div
          ref={modalRef}
          className={`modal ${animationClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close_btn"
            onClick={closeModalWithAnimation}
            aria-label="Bouton fermer le modal"
          />
          <div className="date_modal">
            <p>{project.date}</p>
          </div>
          <div className="modal_content">
            <div className="modal_image-informations">
              <div className="modal_image-container">
                <img src={project.img} alt={project.imgAlt || "Project Image"} />
              </div>
              <div className="modal_text-informations">
                <h2 className="modal_project-name">{project.name}</h2>
                <h3 className="modal_project-type">{project.type}</h3>
                <p className="modal_description">{project.description}</p>
                <ul className="modal_tech-stack">
                  {project.stack.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => {
                    e.preventDefault();
                    closeModalWithAnimation();
                    window.open(linkUrl, "_blank");
                  }}
                >
                  Voir le projet
                </a>
              </div>
            </div>
            <div className="modal_footer">
              <div className="modal_scrollIndex">
                <img
                  src="/images/arrow_left_modal.svg"
                  alt="Arrow Left"
                  onClick={() => handleArrowClick("left")}
                />
                <div className="modal_scrollIndex-cells">
                  {validProjects.map((_, index) => (
                    <div
                      key={index}
                      className={`scrollIndex_cell ${
                        index === validIndex ? "active" : ""
                      }`}
                    ></div>
                  ))}
                </div>
                <img
                  src="/images/arrow_right_modal.svg"
                  alt="Arrow Right"
                  onClick={() => handleArrowClick("right")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
