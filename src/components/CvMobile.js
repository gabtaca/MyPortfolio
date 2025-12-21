import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import useTheme from "../hooks/useTheme";
import cvInfos from "../jsonFiles/cvInfos.json";

export default function CvMobile() {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState(null); // Section actuellement ouverte

  // Gère l'ouverture et la fermeture des sections
  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section)); // Ouvre une section ou la ferme si elle est déjà ouverte
  };

  return (
    <div className={`cv_container ${activeSection ? 'section-active' : ''}`}>
      {["Formations", "Emplois", "Hard Skills", "Soft Skills"].map(
        (section) => (
          <div key={section} className="cv_section">
            {/* En-tête de la section */}
            <div className="cv_section-header">
              <button
                className="cv_sections-button"
                onClick={() => toggleSection(section)}
              >
                {section}
              </button>
            </div>

            {/* Contenu de la section */}
            <AnimatePresence>
              {activeSection === section && (
                <motion.div
                  className="cv_section-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section === "Formations" &&
                  cvInfos.formations.map((item) => (
                    <div key={item.id} className="cv_section-item">
                      <h3 className="cv_item-title">{item.programName}</h3>
                      <p className="cv_item-meta">
                        <span className="cv_item-school">{item.school}</span>
                        <span className="cv_item-redDot">{item.redDot}</span>
                        <span className="cv_item-period">{item.period}</span>
                      </p>
                      <p className="cv_item-description">{item.description}</p>
                    </div>
                  ))}

                {section === "Emplois" &&
                  cvInfos.emplois.map((item) => (
                    <div key={item.id} className="cv_section-item">
                      <h3 className="cv_item-title">{item.jobTitle}</h3>
                      <p className="cv_item-meta">
                        <span className="cv_item-company">{item.company}</span>
                        <span className="cv_item-redDot">{item.redDot}</span>
                        <span className="cv_item-period">{item.period}</span>
                      </p>
                      <p className="cv_item-description">{item.description}</p>
                    </div>
                  ))}

                {section === "Hard Skills" &&
                  cvInfos.hard_skills.map((skill, index) => (
                    <p key={index} className="cv_item-skill">
                      {skill}
                    </p>
                  ))}

                {section === "Soft Skills" &&
                  cvInfos.soft_skills.map((skill, index) => (
                    <p key={index} className="cv_item-skill">
                      {skill}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      )}
    </div>
  );
}
