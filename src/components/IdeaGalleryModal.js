import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdeaGalleryModal({ idea, onClose }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  if (!idea) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="idea-gallery-modal-overlay"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="idea-gallery-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="idea-gallery-close-btn" onClick={onClose} aria-label="Close gallery">
            ×
          </button>

          <div className="idea-gallery-header">
            <h2 className="idea-gallery-title">{idea.title}</h2>
            <p className="idea-gallery-description">{idea.description}</p>
          </div>

          <div className="idea-gallery-grid">
            {idea.images && idea.images.length > 0 ? (
              idea.images.map((imagePath, index) => (
                <div 
                  key={index} 
                  className="idea-gallery-item"
                  onClick={() => setFullscreenImage(imagePath)}
                >
                  <img
                    src={imagePath}
                    alt={`${idea.title} - Image ${index + 1}`}
                    className="idea-gallery-image"
                  />
                </div>
              ))
            ) : (
              <p className="idea-gallery-no-images">Aucune image disponible</p>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Fullscreen image overlay */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            className="idea-gallery-fullscreen-overlay"
            onClick={() => setFullscreenImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button 
              className="idea-gallery-fullscreen-close" 
              onClick={() => setFullscreenImage(null)}
              aria-label="Close fullscreen"
            >
              ×
            </button>
            <motion.img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="idea-gallery-fullscreen-image"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
