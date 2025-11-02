const screenWith = 640;
const screenHeight = 480;
const clearColor = "black";

const minAmplitude = 0;
const maxAmplitude = 100;
const minFrequency = 0;
const maxFrequency = 100;

const earthX = screenWith / 2;
const earthY = screenHeight / 2;
const earthRadius = 30;

const initialAmplitude = 10;
const initialFrequency = 0;

let time = 0;
let inputCooldown = 0;
let lastKeyStates = {};
let score = 0;

let targetWave = {
  baseRadius: 380,
  amplitude: 15,
  frequency: 10,
  phase: 0,
  animationSpeed: 0.05,
  color: [255, 255, 255, 200],
};

let playerWave = {
  baseRadius: 50,
  amplitude: initialAmplitude,
  frequency: initialFrequency,
  phase: 0,
  animationSpeed: 0.05,
  color: [100, 150, 255, 200],
};

function setup() {
  createCanvas(screenWith, screenHeight);
}

function draw() {
  background(clearColor);
  time += 0.02;

  // Continuous controls with keyIsDown
  handleContinuousInput();

  // Make target wave circle gradually smaller
  if (targetWave.baseRadius > 50) {
    targetWave.baseRadius -= 0.5; // Reduce base radius by 0.5 each frame
    targetWave.baseRadius = max(50, targetWave.baseRadius); // Don't go below 50
  }

  drawWave(targetWave, time);
  drawWave(playerWave, time);
  drawEarth();
  let sync = calculateSync();
  displayUI(sync);

  if (targetWave.baseRadius === playerWave.baseRadius) {
    if (sync > 0.8) {
      score++;
    }
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
}

function drawEarth() {
  fill(0, 0, 0, 100);
  noStroke();
  circle(earthX + 3, earthY + 3, earthRadius * 2);
  fill("#004488");
  stroke("#0066BB");
  strokeWeight(2);
  circle(earthX, earthY, earthRadius * 2);
  fill("#006600");
  noStroke();
  ellipse(earthX - 8, earthY - 3, 12, 8);
  ellipse(earthX + 6, earthY + 6, 8, 6);
  ellipse(earthX - 2, earthY + 8, 6, 4);
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
  let totalDiff = 0;
  let samples = 36;
  for (let i = 0; i < samples; i++) {
    let angle = (TWO_PI / samples) * i;
    let targetOsc =
      targetWave.amplitude *
      sin(
        targetWave.frequency * angle +
          radians(targetWave.phase) +
          time * targetWave.animationSpeed * 50
      );
    let playerOsc =
      playerWave.amplitude *
      sin(
        playerWave.frequency * angle +
          radians(playerWave.phase) +
          time * playerWave.animationSpeed * 50
      );
    let maxDiff = targetWave.amplitude + playerWave.amplitude;
    let diff = abs(targetOsc - playerOsc) / maxDiff;
    totalDiff += diff;
  }
  let avgDiff = totalDiff / samples;
  return max(0, 1 - avgDiff);
}
