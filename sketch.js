// Global variables
let spritedata;
let spritesheet;
let backgroundImg;
let distortionShader;
let animation = [];
let earth;
let game;

// Shader sources for background distortion effect
const distortionVert = `
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;
  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  }
`;

const distortionFrag = `
  precision mediump float;
  varying vec2 vTexCoord;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_waveCenter;
  uniform float u_waveRadius;
  uniform float u_waveAmplitude;
  uniform float u_waveFrequency;
  uniform float u_distortionStrength;

  void main() {
    vec2 uv = vTexCoord;

    // Calculate distance from wave center
    vec2 center = u_waveCenter / u_resolution;
    vec2 pos = uv - center;
    float dist = length(pos);

    // Convert to polar coordinates
    float angle = atan(pos.y, pos.x);
    float radius = dist * min(u_resolution.x, u_resolution.y);

    // Calculate distance from wave radius
    float distanceFromWave = abs(radius - u_waveRadius);

    // Apply distortion ONLY near the wave radius (not a circular bubble)
    float waveWidth = 50.0; // Width of distortion wave
    if (distanceFromWave < waveWidth) {
      // Sinusoidal wave effect along contour
      float waveEffect = sin(angle * u_waveFrequency + u_time * 2.0) * u_waveAmplitude;

      // Intensity based on proximity to wave radius
      float intensity = 1.0 - (distanceFromWave / waveWidth);
      intensity = pow(intensity, 2.0); // Sharper effect

      // Radial distortion (inward/outward)
      float radialDistortion = waveEffect * intensity * u_distortionStrength * 0.005;
      uv += normalize(pos) * radialDistortion;

      // Tangential distortion (along contour)
      vec2 tangent = vec2(-pos.y, pos.x); // Tangent vector
      float tangentialDistortion = waveEffect * intensity * u_distortionStrength * 0.002;
      uv += normalize(tangent) * tangentialDistortion;
    }

    // Clamp UV coordinates to [0,1] to avoid artifacts
    uv = clamp(uv, vec2(0.0), vec2(1.0));

    // Sample texture with (possibly) distorted coordinates
    vec4 color = texture2D(u_texture, uv);

    gl_FragColor = color;
  }
`;

// Preload assets
function preload() {
  spritedata = loadJSON("animations/earth.json");
  spritesheet = loadImage("sprites/earth.png");
  backgroundImg = loadImage("sprites/background.png");
}

// WebGL buffer for shader effects
let distortionBuffer;

// Setup canvas and initialize game
function setup() {
  createCanvas(CONFIG.screenWidth, CONFIG.screenHeight); // 2D mode
  distortionBuffer = createGraphics(width, height, WEBGL); // Separate buffer for shader

  try {
    distortionShader = distortionBuffer.createShader(
      distortionVert,
      distortionFrag
    );
    console.log("Shader created successfully");
  } catch (e) {
    console.error("Failed to create shader:", e);
  }

  // Load sprite animation frames
  const frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    const pos = frames[i].position;
    const img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  // Scale sprite to match earth radius (target diameter = 96px, source sprite = 48px)
  const spriteScale = (CONFIG.earthRadius * 2) / 48;
  earth = new Sprite(
    animation,
    CONFIG.earthX,
    CONFIG.earthY,
    random(0.1, 0.4),
    spriteScale
  );

  game = new Game();
}

// Main draw loop
function draw() {
  game.update();
  game.draw();
}

// Handle key press events
function keyPressed() {
  game.handleKeyPressed();
}
