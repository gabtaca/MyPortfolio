// src/hooks/useWindowWidth.js

import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    // Fonction pour mettre à jour la largeur
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Définir la largeur initiale
    handleResize();

    // Ajouter l'écouteur d'événement
    window.addEventListener("resize", handleResize);

    // Nettoyage lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export default useWindowWidth;
