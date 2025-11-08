const screenWith = 640;
const screenHeight = 480;
const clearColor = "black";

const minAmplitude = 0;
const maxAmplitude = 100;
const minFrequency = 0;
const maxFrequency = 100;

const earthX = screenWith / 2;
const earthY = screenHeight / 2;
const earthRadius = 48;

const initialAmplitude = 10;
const initialFrequency = 0;

const playerRadius = 80;

let time = 0;
let inputCooldown = 0;
let lastKeyStates = {};
let score = 0;

let targetWave = {
  baseRadius: 380,
  amplitude: 20,
  frequency: 0,
  phase: 0,
  animationSpeed: 0.05,
  color: [255, 255, 255, 200],
};

let playerWave = {
  baseRadius: playerRadius,
  amplitude: initialAmplitude,
  frequency: initialFrequency,
  phase: 0,
  animationSpeed: 0.05,
  color: [100, 150, 255, 200],
};

let spritedata;
let spritesheet;
let animation = [];
let earth;

function preload() {
  spritedata = loadJSON("animations/earth.json");
  spritesheet = loadImage("sprites/earth.png");
}

function setup() {
  createCanvas(screenWith, screenHeight);
  let frames = spritedata.frames;

  targetWave.frequency = getRandomInt(10, 30);
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  // Scale sprite to match earthRadius * 2 (target diameter = 96px, source sprite = 48px)
  let spriteScale = (earthRadius * 2) / 48;
  earth = new Sprite(animation, earthX, earthY, random(0.1, 0.4), spriteScale);
}

function draw() {
  background(clearColor);
  time += 0.02;

  // Continuous controls with keyIsDown
  handleContinuousInput();

  // Make target wave circle gradually smaller
  if (targetWave.baseRadius > playerRadius) {
    targetWave.baseRadius -= 0.5; // Reduce base radius by 0.5 each frame
    targetWave.baseRadius = max(playerRadius, targetWave.baseRadius); // Don't go below playerRadius
  }

  drawWave(targetWave, time);
  drawWave(playerWave, time);
  earth.show();
  earth.animate();
  let sync = calculateSync();
  displayUI(sync);

  if (targetWave.baseRadius === playerRadius) {
    if (sync > 0.8) {
      score++;
    }
    targetWave.frequency = getRandomInt(10, 30);
    targetWave.baseRadius = 380;
  }
}

function drawWave(wave, currentTime) {
  stroke(wave.color[0], wave.color[1], wave.color[2], wave.color[3]);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.05) {
    let phaseRadians = radians(wave.phase);

    // Base wave calculation (for sync)
    let baseRadius =
      wave.baseRadius +
      wave.amplitude *
        sin(
          wave.frequency * angle +
            phaseRadians +
            currentTime * wave.animationSpeed * 50
        );

    // Add subtle disturbance for visual effect only
    let disturbance =
      3 *
        sin(angle * 15 + currentTime * 0.8) *
        cos(angle * 8 + currentTime * 0.6) +
      2 *
        sin(angle * 23 + currentTime * 1.2) *
        cos(angle * 12 + currentTime * 0.9);

    let radius = baseRadius + disturbance;
    let x = earthX + radius * cos(angle);
    let y = earthY + radius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  stroke("black");
}

function handleContinuousInput() {
  inputCooldown++;

  // Define key mappings
  const keys = {
    w: {
      pressed: keyIsDown(87) || keyIsDown(119),
      action: () =>
        (playerWave.amplitude = min(maxAmplitude, playerWave.amplitude + 1)),
    },
    s: {
      pressed: keyIsDown(83) || keyIsDown(115),
      action: () =>
        (playerWave.amplitude = max(minAmplitude, playerWave.amplitude - 1)),
    },
    a: {
      pressed: keyIsDown(65) || keyIsDown(97),
      action: () =>
        (playerWave.frequency = max(minFrequency, playerWave.frequency - 1)),
    },
    d: {
      pressed: keyIsDown(68) || keyIsDown(100),
      action: () =>
        (playerWave.frequency = min(maxFrequency, playerWave.frequency + 1)),
    },
  };

  let anyJustPressed = false;

  // Handle instant presses and continuous controls
  for (let key in keys) {
    const keyData = keys[key];
    const justPressed = keyData.pressed && !lastKeyStates[key];

    // Instant press (always works)
    if (justPressed) {
      keyData.action();
      anyJustPressed = true;
    }
    // Continuous press (only if timer expired and no instant press)
    else if (inputCooldown >= 10 && keyData.pressed && !anyJustPressed) {
      keyData.action();
    }

    // Save current state
    lastKeyStates[key] = keyData.pressed;
  }

  // Reset timer if any action was performed
  if (anyJustPressed || inputCooldown >= 10) {
    inputCooldown = 0;
  }
}

function keyPressed() {
  if (key === " ") {
    playerWave.amplitude = initialAmplitude;
    playerWave.frequency = initialFrequency;
    playerWave.phase = 0;
  }
}

function displayUI(sync) {
  fill(255);
  textSize(14);
  text("Controls:", 10, 20);
  text("W/S: Amplitude (" + playerWave.amplitude + ")", 10, 40);
  text("A/D: Frequency (" + playerWave.frequency + ")", 10, 60);
  text("SPACE: Reset", 10, 80);
  fill(sync > 0.8 ? color(0, 255, 0) : color(255, 0, 0));
  text("Sync: " + Math.round(sync * 100) + "%", 10, 110);
  fill("white");
  text("Score: " + score, 10, 130);
}

function calculateSync() {
  let samples = 36;
  let totalNormDiff = 0;
  for (let i = 0; i < samples; i++) {
    let angle = (TWO_PI / samples) * i;
    // normalized oscillation (range -1..1), so amplitude doesn't affect this
    let targetNorm = sin(
      targetWave.frequency * angle +
        radians(targetWave.phase) +
        time * targetWave.animationSpeed * 50
    );
    let playerNorm = sin(
      playerWave.frequency * angle +
        radians(playerWave.phase) +
        time * playerWave.animationSpeed * 50
    );
    // difference between normalized waves (0..2), divide by 2 to get 0..1
    let normDiff = abs(targetNorm - playerNorm) / 2;
    totalNormDiff += normDiff;
  }
  let avgNormDiff = totalNormDiff / samples;
  let freqScore = max(0, 1 - avgNormDiff);

  // amplitude similarity: compare amplitudes (0..maxAmplitude)
  let maxAmpRange = maxAmplitude - minAmplitude;
  // avoid division by zero
  if (maxAmpRange <= 0) maxAmpRange = maxAmplitude || 1;
  let ampDiff = abs(targetWave.amplitude - playerWave.amplitude) / maxAmpRange;
  ampDiff = max(0, min(1, ampDiff));
  let ampScore = 1 - ampDiff;

  // combine scores with weights: frequency 80%, amplitude 20%
  let combined = freqScore * 0.8 + ampScore * 0.2;
  return max(0, min(1, combined));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
