import React, { useState, useEffect } from "react";

export default function ProjectsModalDesktop({
  project,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
  projectsData,
  isDarkMode = false, // dark mode status passed in
}) {
  if (!project || project.type === "blank") return null;

  // Filter out any projects with invalid id values
  const validProjects = projectsData.filter((proj) => !isNaN(proj.id));
  const validIndex = validProjects.findIndex((p) => p.id === project.id);

  // State to control iframe mode: "desktop" or "mobile"
  const [iframeMode, setIframeMode] = useState("iframe_desktop");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showTap, setShowTap] = useState(false);

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  // Handlers to switch iframe mode
  const handleIframeModeChange = (mode) => {
    setIframeMode(mode);
  };

  // Handler pour suivre le curseur en mode mobile
  const handleMouseMove = (e) => {
    if (iframeMode === "iframe_mobile") {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseEnter = () => {
    if (iframeMode === "iframe_mobile") {
      setShowCursor(true);
    }
  };

  const handleMouseLeave = () => {
    setShowCursor(false);
  };

  // Handler pour l'effet tap
  const handleTap = (e) => {
    if (iframeMode === "iframe_mobile") {
      const rect = e.currentTarget.getBoundingClientRect();
      setTapPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowTap(true);
      setTimeout(() => setShowTap(false), 300);
    }
  };

  // Determine icon sources based on dark mode
  const mobileIcon = isDarkMode
    ? "/images/BtnmodalMobileDarkmode.svg"
    : "/images/BtnmodalMobile.svg";
  const desktopIcon = isDarkMode
    ? "/images/btnmodalDesktopDarkmode.svg"
    : "/images/btnmodalDesktop.svg";

  // Use the first available link (github, figma, etc.)
  const linkUrl = project.lien ? Object.values(project.lien)[0] : null;
  const linkType = project.lien ? Object.keys(project.lien)[0] : null;
  
  // Détection intelligente du type de contenu
  const getIframeConfig = () => {
    // Si figmaEmbed existe, c'est un projet Figma
    if (project.figmaEmbed) {
      return {
        src: project.figmaEmbed,
        canDisplay: true,
        type: 'figma'
      };
    }
    
    // Si c'est un lien Figma mais pas d'embed, ne pas afficher d'iframe
    if (linkType === 'figma' || linkUrl?.includes('figma.com')) {
      return {
        src: null,
        canDisplay: false,
        type: 'figma-link'
      };
    }
    
    // Si c'est un repo GitHub (pas un GitHub Pages), ne pas afficher d'iframe
    if (linkUrl?.includes('github.com') && !linkUrl?.includes('.github.io') && !linkUrl?.includes('vercel.app')) {
      return {
        src: null,
        canDisplay: false,
        type: 'repo'
      };
    }
    
    // Sinon, c'est probablement un site web hébergé → afficher iframe
    return {
      src: linkUrl,
      canDisplay: true,
      type: 'website'
    };
  };
  
  const iframeConfig = getIframeConfig();
  const iframeSrc = iframeConfig.src;

  const iframeClass = `modal_iframe ${iframeMode}`;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-wrapper desktop">
        <div className="modal desktop" onClick={(e) => e.stopPropagation()}>
          <button className="close_btn" onClick={onClose} aria-label="Close modal" />
          <div className="date_modal">
            <p>{project.date}</p>
          </div>
          <div className="modal_content-desktop">
            {/* Left: Iframe displaying the project website */}
            <div className="modal_ctrl-infos">
              {iframeConfig.canDisplay ? (
                <div className="modal_iframe-container">
                  <iframe
                    className={iframeClass}
                    src={iframeSrc}
                    title={project.name}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                    // Remove inline width/height: CSS should now control the ratio.
                  ></iframe>
                  {iframeMode === "iframe_mobile" && (
                    <div 
                      className="iframe-touch-layer"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={handleTap}
                    >
                    {showCursor && (
                      <div 
                        className="custom-touch-cursor"
                        style={{
                          left: `${cursorPosition.x}px`,
                          top: `${cursorPosition.y}px`
                        }}
                      />
                    )}
                    {showTap && (
                      <div 
                        className="touch-ripple"
                        style={{
                          left: `${tapPosition.x}px`,
                          top: `${tapPosition.y}px`
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
              ) : (
                <div className="modal_no-iframe">
                  <img 
                    src={project.img} 
                    alt={project.imgAlt}
                    className="modal_preview-image"
                  />
                  <p className="modal_no-iframe-text">
                    {iframeConfig.type === 'repo' 
                      ? 'Code repository - Cliquez sur "Voir le projet" pour accéder au code'
                      : 'Aperçu non disponible - Cliquez sur "Voir le projet"'}
                  </p>
                </div>
              )}

              {/* Right: Project information */}
              <div className="modal_text-informations-desktop">
                <h2 className="modal_project-name-desktop">{project.name}</h2>
                <h3 className="modal_project-type-desktop">{project.type}</h3>
                <p className="modal_description-desktop">{project.description}</p>
                <ul className="modal_tech-stack-desktop">
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
                    onClose();
                    window.open(linkUrl, "_blank");
                  }}
                >
                  Voir le projet
                </a>
              </div>
            </div>
            {/* Footer with navigation arrows and iframe mode switch buttons */}
            <div className="modal_footer-desktop">
            <div className="iframe_mode_buttons">
                  <button onClick={() => handleIframeModeChange("iframe_mobile")}>
                    <img src={mobileIcon} alt="Switch to mobile view" />
                  </button>
                  <button onClick={() => handleIframeModeChange("iframe_desktop")}>
                    <img src={desktopIcon} alt="Switch to desktop view" />
                  </button>
                </div>
              <div className="modal_scrollIndex">
                <img
                  className="arrow-icon desktop"
                  src="/images/arrow_left_modal.svg"
                  alt="Arrow Left"
                  onClick={() => onPrevious()}
                />
                <div className="modal_scrollIndex-cells">
                  {validProjects.map((_, index) => (
                    <div key={index} className={`scrollIndex_cell ${index === validIndex ? "active" : ""}`}></div>
                  ))}
                </div>
                <img
                  className="arrow-icon desktop"
                  src="/images/arrow_right_modal.svg"
                  alt="Arrow Right"
                  onClick={() => onNext()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
