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

  // Calculer les positions des séparateurs entre les groupes
  const separators = [];
  const groupEntries = Object.entries(groupedDates);
  for (let i = 0; i < groupEntries.length - 1; i++) {
    const currentGroup = groupEntries[i][1];
    const nextGroup = groupEntries[i + 1][1];
    
    const lastOfCurrent = buttonPositions[currentGroup[currentGroup.length - 1]];
    const firstOfNext = buttonPositions[nextGroup[0]];
    
    if (lastOfCurrent && firstOfNext) {
      // Position du séparateur au milieu entre les deux groupes
      const separatorX = (lastOfCurrent.x + 30 + firstOfNext.x - 30) / 2;
      separators.push(separatorX);
    }
  }

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
      {/* Ligne horizontale continue de pointillés */}
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

      {/* Séparateurs verticaux entre les groupes */}
      {separators.map((x, index) => (
        <div
          key={`separator-${index}`}
          style={{
            position: "absolute",
            top: "15px",
            left: `${x}px`,
            width: "0px",
            height: "15px",
            borderLeft: "2px dotted var(--h2Color)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Les dates individuelles */}
      {Object.entries(groupedDates).map(([date, buttonIndices]) => {
        if (!buttonIndices.length) return null;

        const firstButton = buttonPositions[buttonIndices[0]];
        const lastButton = buttonPositions[buttonIndices[buttonIndices.length - 1]];

        if (!firstButton || !lastButton) return null;

        const leftPosition = firstButton.x - 30;
        const rightPosition = lastButton.x + 30;
        const centerPosition = (leftPosition + rightPosition) / 2;

        return (
          <div
            key={date}
            style={{
              position: "absolute",
              top: "30px",
              left: `${centerPosition}px`,
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "Jockey One",
                fontSize: "20px",
                fontWeight: "bold",
                color: "var(--datesColor)",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {date}
            </p>
          </div>
        );
      })}
    </div>
  );
}
