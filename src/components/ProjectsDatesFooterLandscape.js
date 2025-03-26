import React, { useMemo, useEffect, useState } from "react";

export default function ProjectsDatesFooterLandscape({ projectsData, buttonPositions }) {
  const [positionsReady, setPositionsReady] = useState(false);

  // Vérifie si les positions des boutons sont prêtes avant de rendre le composant pour s'assurer que le footer ait les informations
  useEffect(() => {
    if (Object.keys(buttonPositions).length > 0) {
      setPositionsReady(true); // Active le rendu quand les positions disponibles
    }
  }, [buttonPositions]);

  // Groupe les boutons par leurs dates
  const groupedDates = useMemo(() => {
    const groups = {};
    projectsData.forEach((project, index) => {
      if (project.id.startsWith("blank")) return; // Ignore les boutons esthétiques bookends
      if (!groups[project.date]) groups[project.date] = []; // Crée un tableau pour chaque date
      groups[project.date].push(index); // Ajoute l'index du bouton dans le tableau 
    });
    return groups;
  }, [projectsData]);

  // Retourne rien tant que les positions des boutons ne sont pas prêtes
  if (!positionsReady) {
    return null;
  }

  return (
    <div
      className="projects-dates-footer-landscape"
      style={{
        position: "relative",
        width: "100%",
        height: "80px", 
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {Object.entries(groupedDates).map(([date, buttonIndices], groupIndex) => {
        if (!buttonIndices.length) return null; // Ignore les bookends

        // Récupère la position du premier et du dernier bouton dans le groupe
        const firstButton = buttonPositions[buttonIndices[0]];
        const lastButton = buttonPositions[buttonIndices[buttonIndices.length - 1]];

        if (!firstButton || !lastButton) return null; // S'assure que les boutons existent

        // Ajuste la position à gauche et la largeur du groupe de boites
        const leftPosition = (firstButton.x || 0) - (firstButton.width / 2 || 70); // Début du coté gauche du premier bouton
        const totalWidth =
          (lastButton.x || 0) +
          (lastButton.width / 2 || 70) -
          leftPosition; // Termine du coté droit du dernier bouton

        return (
          <React.Fragment key={groupIndex}>
            {/* Conteneur pour le groupe de date */}
            <div
              className="date-group"
              style={{
                position: "absolute",
                top: "15px", // Contrôle vertical pour placer le footer
                left: `${leftPosition}px`, // Position horizontale basée sur le premier bouton
                width: `${totalWidth}px`, // Largeur calculée pour couvrir tous les boutons du groupe
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Ligne avec des bordures spécifiques */}
              <div
                style={{
                  width: "100%",
                  height: "15px",
                  backgroundColor: "transparent",
                  borderBottom: "1.5px dashed var(--h2Color)",
                  borderLeft: groupIndex === 0 ? "1.5px dashed var(--h2Color)" : "none", // Bordure à gauche seulement pour le premier groupe avec la même date
                  borderRight: "1.5px dashed var(--h2Color)", // Bordure à droite pour tous les groupes générés apres le premier
                }}
              ></div>
              {/* date */}
              <p
                style={{
                  marginTop: "5px",
                  fontFamily: "Jockey One",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "var(--datesColor)",
                  textAlign: "center",
                }}
              >
                {date}
              </p>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
