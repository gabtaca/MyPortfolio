// src/hooks/useIdeesAnimation.js

import { useEffect } from "react";

const useIdeesAnimation = (svgRefs, duration = 400) => {
  useEffect(() => {
    if (!svgRefs.current || svgRefs.current.length === 0) return;

    // Fonction d'easing pour une animation plus fluide
    const easeInOut = (progress) =>
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    // Fonction d'interpolation entre deux valeurs
    const interpolate = (start, end, progress) => start + (end - start) * progress;

    // Fonction pour générer le chemin interpolé
    const getInterpolatedPath = (progress, initialPath, finalPath) => {
      const Mx = interpolate(initialPath.M.x, finalPath.M.x, progress);
      const My = interpolate(initialPath.M.y, finalPath.M.y, progress);

      const L1x = interpolate(initialPath.L1.x, finalPath.L1.x, progress);
      const L1y = interpolate(initialPath.L1.y, finalPath.L1.y, progress);

      const L2x = interpolate(initialPath.L2.x, finalPath.L2.x, progress);
      const L2y = interpolate(initialPath.L2.y, finalPath.L2.y, progress);

      return `M${Mx},${My} L${L1x},${L1y} L${L2x},${L2y}`;
    };

    // Fonction pour calculer les chemins initiaux et finaux basés sur la longueur du texte
    const calculatePaths = (textElement, margin = 10, initialLegY = 20, finalLegY = 80) => {
      // Mesurer la longueur réelle du texte
      const textLength = textElement.getComputedTextLength();

      // Définir la forme initiale en V
      const initialPath = {
        M: { x: margin, y: initialLegY },                      // Début de la jambe gauche
        L1: { x: (textLength + margin * 2) / 2, y: finalLegY }, // Pli au centre bas
        L2: { x: textLength + margin * 2, y: initialLegY },     // Début de la jambe droite
      };

      // Définir la forme finale en ligne horizontale
      const finalPath = {
        M: { x: margin, y: finalLegY },                      // Point gauche
        L1: { x: (textLength + margin * 2) / 2, y: finalLegY }, // Point central
        L2: { x: textLength + margin * 2, y: finalLegY },     // Point droit
      };

      const totalWidth = textLength + margin * 2;

      return { initialPath, finalPath, totalWidth };
    };

    // Fonction d'animation pour un seul SVG
    const animateSVG = (svg, path, textPath, textElement) => {
      let startTime = null;

      // Calculer les chemins basés sur la longueur du texte
      const { initialPath, finalPath, totalWidth } = calculatePaths(textElement);

      // Ajuster le viewBox du SVG pour accommoder la largeur du chemin
      const currentViewBox = svg.getAttribute("viewBox").split(" ").map(Number);
      const newViewBoxWidth = Math.max(currentViewBox[2], totalWidth + 40); // Ajouter du margin
      svg.setAttribute("viewBox", `0 0 ${newViewBoxWidth} 100`);

      // Initialiser le chemin avec initialPath
      path.setAttribute(
        "d",
        `M${initialPath.M.x},${initialPath.M.y} L${initialPath.L1.x},${initialPath.L1.y} L${initialPath.L2.x},${initialPath.L2.y}`
      );

      // Centrer le texte sur le chemin
      textElement.setAttribute("x", newViewBoxWidth / 2);
      textElement.setAttribute("y", finalPath.M.y);

      // Boucle d'animation
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        let progress = elapsed / duration;
        progress = Math.min(progress, 1); // Limiter progress à [0,1]

        // Appliquer l'easing
        const easedProgress = easeInOut(progress);

        // Mettre à jour l'attribut 'd' du chemin
        const currentPath = getInterpolatedPath(easedProgress, initialPath, finalPath);
        path.setAttribute("d", currentPath);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      // Démarrer l'animation
      requestAnimationFrame(animate);
    };

    // Initialiser les animations pour tous les SVGs
    svgRefs.current.forEach((svg) => {
      if (!svg) return; // Vérifier que svg existe

      const path = svg.querySelector(".animatedPath");
      const textPath = svg.querySelector(".textPathRef");
      const textElement = svg.querySelector(".animatedText");

      // Valider les éléments
      if (!path || !textPath || !textElement) {
        console.error("Éléments SVG manquants :", { path, textPath, textElement });
        return;
      }

      // Assurer que textPath référence le chemin correct
      const pathId = path.id;
      if (textPath.getAttribute("href") !== `#${pathId}`) {
        textPath.setAttribute("href", `#${pathId}`);
      }

      // Initialiser le chemin avec une forme en V
      path.setAttribute("d", `M20,80 L100,100 L180,80`);

      // Laisser le navigateur rendre l'état initial
      setTimeout(() => {
        // Vérifier que la longueur du texte est valide
        const textLength = textElement.getComputedTextLength();
        if (isNaN(textLength) || textLength === 0) {
          console.error("Longueur de texte invalide pour le SVG :", svg);
          return;
        }

        // Animer le SVG
        animateSVG(svg, path, textPath, textElement);
      }, 0);
    });
  }, [svgRefs, duration]);
};

export default useIdeesAnimation;
