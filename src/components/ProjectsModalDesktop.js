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

  // Determine icon sources based on dark mode
  const mobileIcon = isDarkMode
    ? "/images/BtnmodalMobileDarkmode.svg"
    : "/images/BtnmodalMobile.svg";
  const desktopIcon = isDarkMode
    ? "/images/btnmodalDesktopDarkmode.svg"
    : "/images/btnmodalDesktop.svg";

  // Use the project.lien.github property as the website URL
  const iframeSrc = project.lien?.github;

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
              <div className="modal_iframe-container">
                <iframe
                  className={iframeClass}
                  src={iframeSrc}
                  title={project.name}
                  // Remove inline width/height: CSS should now control the ratio.
                ></iframe>
              </div>

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
                  href={project.lien?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    window.open(project.lien?.github, "_blank");
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
