import React, { useMemo } from "react";

export default function ProjectsDatesFooterLandscape({ projectsData, buttonPositions }) {
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
  if (Object.keys(buttonPositions).length === 0) {
    return null;
  }

  // Calculer les positions min et max pour créer une ligne continue
  const allIndices = Object.values(groupedDates).flat();
  if (allIndices.length === 0) return null;

  const minIndex = Math.min(...allIndices);
  const maxIndex = Math.max(...allIndices);
  const firstButton = buttonPositions[minIndex];
  const lastButton = buttonPositions[maxIndex];

  if (!firstButton || !lastButton) return null;

  const lineStartX = firstButton.x - 30;
  const lineEndX = lastButton.x + 30;
  const lineWidth = lineEndX - lineStartX;

  return (
    <div
      className="projects-dates-footer-landscape"
      style={{
        position: "relative",
        width: "100%",
        height: "80px", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      {/* Ligne continue de pointillés pour tous les projets */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: `${lineStartX}px`,
          width: `${lineWidth}px`,
          height: "15px",
          borderBottom: "2px dotted var(--h2Color)",
          borderLeft: "2px dotted var(--h2Color)",
          borderRight: "2px dotted var(--h2Color)",
          pointerEvents: "none",
        }}
      />

      {/* Les dates individuelles */}
      {Object.entries(groupedDates).map(([date, buttonIndices], groupIndex) => {
        if (!buttonIndices.length) return null;

        const firstButton = buttonPositions[buttonIndices[0]];
        const lastButton = buttonPositions[buttonIndices[buttonIndices.length - 1]];

        if (!firstButton || !lastButton) return null;

        const leftPosition = firstButton.x - 30;
        const rightPosition = lastButton.x + 30;
        const totalWidth = rightPosition - leftPosition;

        return (
          <React.Fragment key={groupIndex}>
            <div
              className="date-group"
              style={{
                position: "absolute",
                top: "15px",
                left: `${leftPosition}px`,
                width: `${totalWidth}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
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
