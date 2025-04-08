import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ideesData from "../jsonFiles/ideesData.json";
import useTheme from "../hooks/useTheme";


const IdeesDesktop = () => {
  const { isDarkMode } = useTheme();
  const categories = Object.keys(ideesData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleButtonClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setDropdownOpen(false);
  };

  let boutonImage = "/images/btn_idees_desktop-neutre.svg";
  if (dropdownOpen || activeCategory) {
    boutonImage = "/images/btn_idees_desktop-active.svg";
  } else if (hovered) {
    boutonImage = "/images/btn_idees_desktop-hover.svg";
  }

  return (
    <div className="idees-desktop-container">
      <div className="idees-desktop-button-container">
        <motion.button
          className="idees-desktop-button"
          onClick={handleButtonClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src={boutonImage} alt="Bouton catégories d'idées" />
        </motion.button>
        <AnimatePresence>
          {hovered && !dropdownOpen && (
            <motion.div
              className="idees-desktop-ribbon"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              Catégories d'idées
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="idees-desktop-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                className="idees-desktop-dropdown-item"
                onClick={() => handleCategoryClick(cat)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {activeCategory && (
        <div className="post-it-container">
          {ideesData[activeCategory].map((idea) => {
            const postItColor = getRandomPostItColor();
            const randomRotation = getRandomRotation();
            return (
              <div
                key={idea.id}
                className={`post-it /* éventuellement ajouter getRandomFoldClass() ici */`}
                style={{
                  backgroundColor: postItColor,
                  "--post-it-color": postItColor,
                  transform: `rotate(${randomRotation}deg)`,
                }}
              >
                <div className="post-it-content">
                  <h3>{idea.title}</h3>
                  <div className="post-it_descCTRL">
                    <p>
                      <span className="postit_description">Description</span>
                      {idea.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IdeesDesktop;
