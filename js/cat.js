// Inspired by oneko.js: https://github.com/adryd325/oneko.js

// const INITIAL_X_POSITION = window.innerWidth / 2;
// const INITIAL_Y_POSITION = window.innerHeight / 2;

const availableSprites = ["brown", "black", "gray"]

const catEl = document.createElement("div");
let catPosX = 0;
let catPosY = 0;

let mousePosX = 0;
let mousePosY = 0;

let frameCount = 0;

const STATES = {
  WAKING_UP: 0,
  IDLING: 1,
  WALKING: 2,
  RUNNING: 3
}

let currentState = STATES.IDLING;

const STATE_CAT_SPEED = {
  [STATES.WAKING_UP]: 0,
  [STATES.IDLING]: 0,
  [STATES.WALKING]: 5,
  [STATES.RUNNING]: 10,
}

let wakingUpFrame = 0;
let isWakingUp = true;

const spriteSets = {
  // Actions can have multiple frames. Each frame is the position (X and Y) of the action inside the sprite, excluding the heading.
  idle: {
    NW: [[7, 7]],
    NE: [[7, 11]],
    SW: [[7, 3]],
    SE: [[7, 15]],
    W: [[7, 5]],
    E: [[7, 13]],
    S: [[7, 1]],
    N: [[7, 9]],  
  },
  walking: {
    NW: [[13, 7], [14, 7], [15, 7], [16, 7]],
    NE: [[13, 11], [14, 11], [15, 11], [16, 11]],
    SW: [[13, 3], [14, 3], [15, 3], [16, 3]],
    SE: [[13, 15], [14, 15], [15, 15], [16, 15]],
    W: [[13, 5], [14, 5], [15, 5], [16, 5]],
    E: [[13, 13], [14, 13], [13, 13], [16, 13]],
    S: [[13, 1], [14, 1], [15, 1], [16, 1]],
    N: [[13, 9], [14, 9], [15, 9], [16, 9]],
  },
  running: {
    NW: [[17, 7], [18, 7], [19, 7], [20, 7]],
    NE: [[17, 11], [18, 11], [19, 11], [20, 11]],
    SW: [[17, 3], [18, 3], [19, 3], [20, 3]],
    SE: [[17, 15], [18, 15], [19, 15], [20, 15]],
    W: [[17, 5], [18, 5], [19, 5], [20, 5]],
    E: [[17, 13], [18, 13], [19, 13], [20, 13]],    
    S: [[17, 1], [18, 1], [19, 1], [20, 1]],
    N: [[17, 9], [18, 9], [19, 9], [20, 9]],
  },
  wakingUp: [[8, 15], [7, 15], [5, 16]]
}

const setSprite = (name, frame, direction) => {
  let sprite = spriteSets[name];
  if (direction) {
    sprite = sprite[direction]
  }

  sprite = sprite[frame % sprite.length];

  let framePositionX = sprite[0] * 32 - 32;
  // We must add 32 to the Y position so we skip the header of the sprite.
  let framePositionY = sprite[1] * 32;
  
  catEl.style.backgroundPosition = `-${framePositionX}px -${framePositionY}px`;
}

const frame = () => {
  frameCount++;

  if (currentState == STATES.WAKING_UP) {
    setSprite("wakingUp", wakingUpFrame);
    return; 
  }
    
  const diffX = catPosX - mousePosX;
  const diffY = catPosY - mousePosY;
  const distance = Math.sqrt(diffX ** 2 + diffY ** 2);  

  direction = diffY / distance > 0.5 ? "N" : "";
  direction += diffY / distance < -0.5 ? "S" : "";
  direction += diffX / distance > 0.5 ? "W" : "";
  direction += diffX / distance < -0.5 ? "E" : "";

  if (distance < 48) {
    currentState = STATES.IDLING;
    setSprite("idle", 0, direction || "S");
    return;
  }

  currentState = STATES.WALKING;
  catSprite = "walking";

  if (distance > 100) {
    currentState = STATES.RUNNING;
    catSprite = "running";
  }

  catSpeed = STATE_CAT_SPEED[currentState];

  setSprite(catSprite, frameCount, direction);

  catPosX -= (diffX / distance) * catSpeed;
  catPosY -= (diffY / distance) * catSpeed;

  catPosX = Math.min(Math.max(16, catPosX), window.innerWidth - 16);
  catPosY = Math.min(Math.max(16, catPosY), window.innerHeight - 16);

  catEl.style.left = `${catPosX - 16}px`;
  catEl.style.top = `${catPosY - 16}px`;
}

const getRandomSpriteFile = () => {
  const randomSprite = availableSprites[Math.floor(Math.random() * availableSprites.length)];

  return `./cats/${randomSprite}.png`;
}

const initializeCat = () => {
  catEl.id = "cat-sprite";
  catEl.style.width = "32px";
  catEl.style.height = "32px";
  catEl.style.position = "fixed";
  catEl.style.pointerEvents = "none";
  catEl.style.backgroundImage = `url('${getRandomSpriteFile()}')`;
  catEl.style.imageRendering = "pixelated";
  catEl.style.left = `${catPosX}px`;  
  catEl.style.top = `${catPosY}px`;
  catEl.style.zIndex = "999";
  catEl.style.transform = "scale(2)"; 

  document.getElementById("content").appendChild(catEl);

  document.addEventListener("mousemove", (event) => {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
  });

  window.catInterval = setInterval(frame, 100);
}

window.addEventListener("load", () => {
  initializeCat();
});