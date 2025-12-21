// src/components/LightningHeader.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, stagger } from "framer-motion";
import useTheme from "../hooks/useTheme";
import classNames from "classnames";

export default function LightningHeader({ navigateTo }) {
  // Recevoir navigateTo en prop
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const burgerButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Effet pour gérer les clics en dehors du menu déroulant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !burgerButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Variants pour les animations de Framer Motion
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {},
  };

  return (
    <div className="lightning-header">
      {/* Navigation */}
      <nav className="nav_header">
        <button
          className={classNames("btn_burger-header", {
            "dark-mode": isDarkMode,
            "light-mode": !isDarkMode,
          })}
          onClick={() => setOpen(!open)}
          ref={burgerButtonRef} // Attacher la référence au bouton burger
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {/* Utiliser un SVG ou une image comme icône de burger */}
          <img
            src={
              isDarkMode
                ? "/images/menu_burgerDarkMode.svg"
                : "/images/menu_burger.svg"
            }
            alt="Menu"
            className="burger-icon"
          />
        </button>
      </nav>

      {/* Menu déroulant */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="dropdown-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            ref={dropdownRef}
          >
            {/* Liste des items avec stagger */}
            <motion.div
              className="dropdown-list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Bouton Accueil */}
              <motion.button
                className="dropdown-item dropdown-item-accueil"
                variants={itemVariants}
                onClick={() => {
                  navigateTo(null, "dropdown");
                  setOpen(false);
                }}
              >
                <span className="dropdown-item-text">Accueil</span>
              </motion.button>

              {/* Lien vers CV */}
              <motion.button
                className="dropdown-item dropdown-item-cv"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("CV", "dropdown");
                  setOpen(false);
                }}
              >
                <span className="dropdown-item-text">CV</span>
              </motion.button>

              {/* Lien vers Projets */}
              <motion.button
                className="dropdown-item dropdown-item-projets"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("Projets", "dropdown");
                  setOpen(false);
                }}
              >
                <span className="dropdown-item-text">Projets</span>
              </motion.button>

              {/* Lien vers Idées */}
              <motion.button
                className="dropdown-item dropdown-item-idees"
                variants={itemVariants}
                onClick={() => {
                  navigateTo("Idées", "dropdown");
                  setOpen(false);
                }}
              >
                <span className="dropdown-item-text">Idées</span>
              </motion.button>

              {/* Toggle Mode Sombre */}
              <motion.div
                className="dropdown-item dropdown-item-darkmode"
                variants={itemVariants}
              >
                <span 
                  className="dropdown-item-text"
                  onClick={toggleDarkMode}
                >
                  Mode Sombre
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    aria-label="Dark Mode Toggle"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <span className="slider round"></span>
                </label>
              </motion.div>

              {/* Bouton Contact */}
              <motion.button
                className="dropdown-item dropdown-item-contact"
                variants={itemVariants}
                onClick={() => {
                  setContactModalOpen(true);
                  setOpen(false);
                }}
              >
                <span className="dropdown-item-text">Contact</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Contact */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            className="contact-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              className="contact-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <button
                className="close-modal-btn"
                onClick={() => setContactModalOpen(false)}
              >
                ✖
              </button>
              <h2>Contact</h2>
              <div className="contact-links">
                <a
                  href="https://www.linkedin.com/in/gabriel-taca-7a65961a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <span className={classNames("svg-icon home-linkedin", {
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}></span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:gabrieltaca117@gmail.com"
                  className="contact-link"
                >
                  <span className={classNames("svg-icon home-mail", {
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}></span>
                  <span>gabriel.taca@example.com</span>
                </a>
                <a
                  href="tel:+14189303703"
                  className="contact-link"
                >
                  <span className={classNames("svg-icon home-call", {
                    "dark-mode": isDarkMode,
                    "light-mode": !isDarkMode,
                  })}></span>
                  <span>+1 (418) 930-3703</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
