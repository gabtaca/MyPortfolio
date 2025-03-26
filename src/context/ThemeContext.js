import React, { createContext, useState, useEffect } from 'react';

// Créer le contexte
export const ThemeContext = createContext();

// Fournisseur de contexte
export const ThemeProvider = ({ children }) => {
  // État pour gérer le mode sombre
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Charger le thème sauvegardé depuis localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedAnimationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    setIsDarkMode(savedDarkMode);
    setAnimationsEnabled(savedAnimationsEnabled);

    // Appliquer la classe 'dark-mode' au body si nécessaire
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Fonction pour basculer les animations
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const toggleAnimations = () => {
    const newAnimationsEnabled = !animationsEnabled;
    setAnimationsEnabled(newAnimationsEnabled);
    localStorage.setItem('animationsEnabled', newAnimationsEnabled);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, animationsEnabled, toggleAnimations }}>
      {children}
    </ThemeContext.Provider>
  );
};