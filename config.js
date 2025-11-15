// Game configuration constants and derived values
const CONFIG = (() => {
  const config = {
    // Screen settings
    screenWidth: 640,
    screenHeight: 480,
    clearColor: "black",

    // Wave limits
    minAmplitude: 0,
    maxAmplitude: 100,
    minFrequency: 0,
    maxFrequency: 100,

    // Earth settings
    earthRadius: 48,

    // Player settings
    initialAmplitude: 10,
    initialFrequency: 0,
    playerRadius: 80,

    // Target wave settings
    targetWave: {
      baseRadius: 380,
      amplitude: 20,
      frequency: { min: 10, max: 30 },
      phase: 0,
      animationSpeed: 0.05,
      color: [255, 255, 255, 200],
    },

    // Player wave settings
    playerWave: {
      phase: 0,
      animationSpeed: 0.05,
      color: [255, 150, 255, 200],
    },

    // Game settings
    timeIncrement: 0.02,
    targetRadiusDecrement: 0.5,
    syncThreshold: 0.8,
    inputCooldownMax: 10,
    syncSamples: 36,
    syncWeights: { frequency: 0.8, amplitude: 0.2 },
  };

  // Derived values
  config.earthX = config.screenWidth / 2;
  config.earthY = config.screenHeight / 2 - 80;

  return config;
})();
