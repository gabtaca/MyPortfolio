import React, { useMemo } from "react";

export default function ProjectsDatesFooterLandscape({ 
  projectsData, 
  buttonPositions, 
  scrollLeft = 0,
  isLandscape = false,
  isDesktop = false,
  indexOffset = 0
}) {
  // Groupe les boutons par leurs dates et garde les VRAIS indices (pas les indices filtrés)
  const groupedDates = useMemo(() => {
    const groups = {};
    projectsData.forEach((project, index) => {
      if (project.id.startsWith("blank")) return; // Ignore les boutons esthétiques bookends
      if (!groups[project.date]) groups[project.date] = []; // Crée un tableau pour chaque date
      // En desktop, ajouter l'offset pour mapper aux bons indices de buttonPositions
      groups[project.date].push(index + indexOffset);
    });
    return groups;
  }, [projectsData, indexOffset]);

  // Retourne rien tant que les positions des boutons ne sont pas prêtes
  if (Object.keys(buttonPositions).length === 0) {
    return null;
  }

  // Calculer d'ABORD toutes les valeurs nécessaires
  const allIndices = Object.values(groupedDates).flat();
  if (allIndices.length === 0) return null;

  const minIndex = Math.min(...allIndices);
  const maxIndex = Math.max(...allIndices);
  const firstButton = buttonPositions[minIndex];
  const lastButton = buttonPositions[maxIndex];

  if (!firstButton || !lastButton) return null;

  // Utiliser le nombre de colonnes pour calculer des positions relatives
  const totalColumns = maxIndex - minIndex + 1;
  const columnGap = 100 / totalColumns; // Pourcentage par colonne

  const buttonWidth = firstButton.width || 60;
  // Utilise les positions absolues des colonnes (comme en mobile)
  const lineStartX = firstButton.x - buttonWidth / 2;
  const lineEndX = lastButton.x + buttonWidth / 2;
  const lineWidth = lineEndX - lineStartX;

  // ENSUITE définir les styles qui utilisent ces valeurs
  // En landscape mobile : utilise transform pour suivre le scroll
  // En desktop : wrapper de largeur fixe centré
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: isDesktop ? "visible" : "hidden",
    pointerEvents: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
  };

  // En desktop : wrapper de largeur fixe (même largeur que le slider)
  // En landscape : transform suivant le scroll
  const contentStyle = isDesktop ? {
    position: "relative",
    width: `${lineWidth}px`, // Largeur exacte du slider
    flexShrink: 0, // Empêche le wrapper de rétrécir
  } : (isLandscape ? {
    position: "relative",
    width: "100%",
    height: "100%",
    transform: `translateX(-${scrollLeft}px)`,
    willChange: "transform",
  } : {});

  // Calcule les positions des séparateurs entre les groupes de dates
  const separators = [];
  const groupEntries = Object.entries(groupedDates);
  for (let i = 0; i < groupEntries.length - 1; i++) {
    const currentGroup = groupEntries[i][1];
    const nextGroup = groupEntries[i + 1][1];
    
    const lastOfCurrent = buttonPositions[currentGroup[currentGroup.length - 1]];
    const firstOfNext = buttonPositions[nextGroup[0]];
    
    if (lastOfCurrent && firstOfNext) {
      // Position du séparateur au milieu entre les deux groupes
      const btnWidth = lastOfCurrent.width || 60;
      const separatorX = (lastOfCurrent.x + btnWidth / 2 + firstOfNext.x - btnWidth / 2) / 2;
      // En desktop : position relative au wrapper centré
      // En mobile : position absolue
      separators.push(isDesktop ? (separatorX - lineStartX) : separatorX);
    }
  }

  return (
    <div className="projects-dates-footer-landscape" style={containerStyle}>
      <div className="footer-content-wrapper" style={contentStyle}>
        {/* Ligne horizontale continue de pointillés */}
        <div
        className="footer-horizontal-line"
        style={{
          position: "absolute",
          top: "15px",
          left: isDesktop ? "0px" : `${lineStartX}px`,
          width: isDesktop ? "100%" : `${lineWidth}px`,
          height: "15px",
          borderBottom: "2px dotted var(--h2Color)",
          borderLeft: "2px dotted var(--h2Color)",
          borderRight: "2px dotted var(--h2Color)",
          pointerEvents: "none",
        }}
      />

      {/* Séparateurs verticaux entre les groupes */}
      {separators.map((x, index) => {
        // En desktop : position relative au wrapper (soustraire lineStartX déjà fait)
        const separatorPos = isDesktop ? `${x}px` : `${x}px`;
        
        return (
          <div
            key={`separator-${index}`}
            className="footer-date-separator"
            style={{
              position: "absolute",
              top: "15px",
              left: separatorPos,
              width: "0px",
              height: "15px",
              borderLeft: "2px dotted var(--h2Color)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Les dates individuelles */}
      {Object.entries(groupedDates).map(([date, buttonIndices]) => {
        if (!buttonIndices.length) return null;

        const firstButton = buttonPositions[buttonIndices[0]];
        const lastButton = buttonPositions[buttonIndices[buttonIndices.length - 1]];

        if (!firstButton || !lastButton) return null;

        const btnWidth = firstButton.width || 60;
        const leftPosition = buttonPositions[buttonIndices[0]].x - btnWidth / 2;
        const rightPosition = buttonPositions[buttonIndices[buttonIndices.length - 1]].x + btnWidth / 2;
        const centerPosition = (leftPosition + rightPosition) / 2;
        // En desktop : position relative au wrapper (soustraire lineStartX déjà fait)
        // En mobile : position absolue
        const finalCenterPosition = isDesktop 
          ? `${centerPosition - lineStartX}px`
          : `${centerPosition}px`;

        return (
          <div
            key={date}
            className="footer-date-container"
            style={{
              position: "absolute",
              top: "30px",
              left: finalCenterPosition,
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <p
              className="footer-date-text"
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
    </div>
  );
}
