import { createNoise2D } from "simplex-noise";

// Fonction pour initialiser l'effet de coulisse
export function initDripEffect() {
  if (typeof window !== "undefined") {
    window.requestFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60); // 60 FPS fallback
        }
      );
    })();

    const noise2D = createNoise2D(); // Fonction de bruit pour créer des drips naturels
    const canvas = document.getElementById("dripCanvas");

    if (!canvas) {
      console.error("Canvas 'dripCanvas' not found!");
      return; // Stop si le canvas n'existe pas
    }

    canvas.setAttribute("width", window.innerWidth);
    canvas.setAttribute("height", window.innerHeight);

    const context = canvas.getContext("2d"); 
    const startTime = new Date().getTime(); 
    const dripDist = 75; 
    const minSpeed = 0.1; 
    let currentTime = 0;

    const colors = [
      '#AFDDD5', '#FFA700', '#FFCCCD', '#F56093', '#64864A',
      '#DFE6E6', '#EFDECO', '#FF7E5A', '#FFBD00', '#7DB954',
      '#FEDDCB', '#FFC700', '#CEE8E5', '#C6B598', '#FEE100',
      '#FAC4C4', '#E9E7AD', '#FDBB9F', '#211ee3', '#EADCC3',
      '#EEF3B4', '#FFB27B', '#FF284B', '#7ABAA1', '#CFEAE4'
    ];
    const spotColors = [
      "#EE7EA0", "#FFA9BA", "#FFD7D6", "#EA7D70", "#F69F95", 
      "#FFAF6E", "#FFCC80", "#FFE2A6", "#BCC07B", "#D8E098", 
      "#7D8BE0", "#B5BEF5", "#ABCDDE", "#D5EDF8", "#D5E2D3", 
      "#9A81B0", "#CDBDEB", "#8E715B", "#C9A98D", "#E5DACA", 
      "#000000", "#4F3F3E", "#B19F9A", "#E1CFCA", "#F1ECEA"
    ];
    let waves = [];
    let currentWave = undefined;

    // Initialisation des premières vagues
    if (colors.length > 0) {
      currentWave = createWave(0, colors[0]);
      waves.push(currentWave);
      waves.push(createWave(1, colors[1]));
      waves.push(createWave(2, colors[2]));
    }

    function resizeCanvas() {
      canvas.setAttribute("width", window.innerWidth);
      canvas.setAttribute("height", window.innerHeight);
    }

    // Fonction pour créer une vague avec des gouttes
    function createWave(colorIndex, color) {
      let drips = [];
      const dripCount = Math.floor(canvas.width / dripDist) + 2;

      // Initialisation des gouttes à 0
      for (let i = 0; i < dripCount; i++) {
        drips.push(0);
      }

      return {
        drips: drips,
        color: color,
        colorIndex: colorIndex,
        spots: createPaintClusters(dripCount), 
        isDone: false
      };
    }

    // Fonction pour créer des clusters de peinture (un gros spot + plusieurs petits)
    function createPaintClusters(dripCount) {
      const clusters = [];
      const numberOfClusters = Math.floor(Math.random() * 6) + 4; 

      for (let i = 0; i < numberOfClusters; i++) {
        const randomOffsetX = Math.random() * 50 - 25; // Augmenter la variation aléatoire en X
        const parentX = Math.floor(Math.random() * dripCount) * dripDist + randomOffsetX; // Position aléatoire
        const parentSize = Math.random() * 20 + 5; 

        const cluster = {
          parent: {
            x: parentX,
            y: 0, 
            speed: Math.random() * 0.5 + 0.5,
            radius: parentSize, 
            color: spotColors[Math.floor(Math.random() * spotColors.length)], 
          },
          children: []
        };

        const numberOfChildren = Math.floor(Math.random() * 4) + 2; 
        for (let j = 0; j < numberOfChildren; j++) {
          const childOffsetX = Math.random() * 50 - 25; // Plus de variabilité horizontale pour les enfants
          const childOffsetY = Math.random() * 20 + 10;
          const childSize = parentSize * 0.3 * (Math.random() + 0.6); 

          cluster.children.push({
            x: parentX + childOffsetX,
            y: childOffsetY,
            speed: cluster.parent.speed + (Math.random() * 0.2 - 0.1),
            radius: childSize,
            color: cluster.parent.color,
          });
        }

        clusters.push(cluster);
      }

      return clusters;
    }

    // Fonction principale de rendu de l'animation
    function render() {
      let now = new Date().getTime();
      currentTime = (now - startTime) / 20000;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Pour chaque vague active, dessiner les gouttes
      for (let i = 0; i < waves.length; i++) {
        let linePoints = [];
        for (let j = 0; j < waves[i].drips.length; j++) {
          waves[i].drips[j] += minSpeed + (noise2D(j * 2, currentTime) + 1);

          let linePoint = {
            x: dripDist * j,
            y: waves[i].drips[j]
          };

          linePoints.push(linePoint);

          if (linePoint.y > canvas.height && !waves[i].isDone) {
            waves[i].isDone = true;
          }
        }

        if (linePoints.length > 0) {
          context.beginPath();
          context.strokeStyle = waves[i].color;
          context.fillStyle = waves[i].color;
          context.moveTo(0, 0);
          context.lineTo(linePoints[0].x, linePoints[0].y);

          let p = 0;
          for (p = 1; p < linePoints.length - 2; p++) {
            let xc = (linePoints[p].x + linePoints[p + 1].x) / 2;
            let yc = (linePoints[p].y + linePoints[p + 1].y) / 2;
            context.quadraticCurveTo(linePoints[p].x, linePoints[p].y, xc, yc);
          }
          context.quadraticCurveTo(linePoints[p].x, linePoints[p].y, linePoints[p + 1].x, linePoints[p + 1].y);
          context.lineTo(canvas.width, 0);
          context.stroke();
          context.fill();

          // Dessiner les clusters de peinture
          for (let cluster of waves[i].spots) {
            drawPaintCluster(cluster);
          }
        }
      }

      if (currentWave && currentWave.isDone) {
        let nextColorIndex = currentWave.colorIndex + 1;
        if (nextColorIndex >= colors.length) nextColorIndex = 0;
        currentWave = createWave(nextColorIndex, colors[nextColorIndex]);
        waves.push(currentWave);

        if (waves.length == 3) {
          waves.shift();
        }
      }

      requestFrame(render);
    }

    // Fonction pour dessiner un cluster de spots de peinture
    function drawPaintCluster(cluster) {
      cluster.parent.y += cluster.parent.speed; 
      drawPaintSpot(cluster.parent);

      for (let child of cluster.children) {
        child.y += child.speed;
        drawPaintSpot(child);
      }
    }

    // Fonction pour dessiner les spots de peinture
    function drawPaintSpot(spot) {
      context.beginPath();
      context.fillStyle = spot.color;

      const stretchFactor = 1 + (spot.y / canvas.height) * 7.2; 
      const squishFactor = 1 / stretchFactor;

      context.ellipse(spot.x, spot.y, spot.radius * squishFactor, spot.radius * stretchFactor, 0, 0, Math.PI * 2);
      context.fill();
    }

    window.addEventListener("resize", resizeCanvas);

    render();
  }
}
/*
        <canvas
          id="dripCanvas"
          className="absolute inset-0 w-full h-full overflow-hidden"
        ></canvas>
*/