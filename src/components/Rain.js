export function makeItRain() {
  const rainElements = document.querySelectorAll('.rain');

  // Clear the existing content in the .rain elements
  rainElements.forEach(el => el.innerHTML = '');

  let drops = "";
  let backDrops = "";

  const totalDrops = 200;  // Total number of raindrops
  let currentDrops = 0;    // Counter to track how many drops have been added

  // Function to add a raindrop gradually
  function addRaindrop() {
    if (currentDrops >= totalDrops) return; // Stop when reaching the total count

    const randomPosition = Math.floor(Math.random() * 98) + 1;  // Random position
    const randomHue = Math.floor(Math.random() * 360);          // Random hue for vibrant color
    const delay = Math.random() * 0.5;                          // Staggered delay
    const frontDuration = Math.random() * 1 + 1.5;              // Random speed for front (1.5 to 2.3s)
    const backDuration = frontDuration * 1.3;                   // Back row slower
    const dropSize = Math.random() * 3 + 1;                     // Varying size for head
    const tailLength = Math.random() * 40 + 20;                 // Slim, long tail

    // Front row raindrop: head and tail
    const frontDrop = `
      <div class="drop" style="left: ${randomPosition}%; animation-delay: ${delay}s; animation-duration: ${frontDuration}s;">
        <div class="head" style="width: ${dropSize}px; height: ${dropSize}px; background-color: hsl(${randomHue}, 100%, 50%);"></div>
        <div class="tail" style="width: 1px; height: ${tailLength}px; background-color: hsl(${randomHue}, 100%, 50%);"></div>
      </div>`;
    
    // Backdrop drop: head and tail, slower and larger
    const backDrop = `
      <div class="drop back-drop" style="left: ${randomPosition}%; animation-delay: ${delay}s; animation-duration: ${backDuration}s;">
        <div class="head" style="width: ${dropSize * 1.2}px; height: ${dropSize * 1.2}px; background-color: hsl(${randomHue}, 100%, 40%);"></div>
        <div class="tail" style="width: 1px; height: ${tailLength * 1.2}px; background-color: hsl(${randomHue}, 100%, 40%);"></div>
      </div>`;

    // Add the new drops to the existing drops string
    drops += frontDrop;
    backDrops += backDrop;

    // Temporarily append them to the DOM to force reflow
    document.querySelector('.front-row').innerHTML = drops;
    document.querySelector('.back-row').innerHTML = backDrops;

    // Force reflow (this ensures the animations restart correctly)
    const frontRowElement = document.querySelector('.front-row');
    frontRowElement.offsetHeight; // Trigger reflow

    currentDrops++;  // Increment the counter

    // Gradually add more raindrops over time (e.g., every 100ms)
    setTimeout(addRaindrop, 100); // Add another raindrop every 100ms
  }

  // Start adding raindrops
  addRaindrop();
}

