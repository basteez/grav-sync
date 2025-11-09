// Player class extending Wave with controllable parameters
class Player extends Wave {
  constructor() {
    super(
      CONFIG.playerRadius,
      CONFIG.initialAmplitude,
      CONFIG.initialFrequency,
      CONFIG.playerWave.phase,
      CONFIG.playerWave.animationSpeed,
      CONFIG.playerWave.color
    );
  }

  // Reset player wave to initial state
  reset() {
    this.amplitude = CONFIG.initialAmplitude;
    this.frequency = CONFIG.initialFrequency;
    this.phase = 0;
  }

  // Increase wave amplitude (with bounds checking)
  increaseAmplitude() {
    this.amplitude = Math.min(CONFIG.maxAmplitude, this.amplitude + 1);
  }

  // Decrease wave amplitude (with bounds checking)
  decreaseAmplitude() {
    this.amplitude = Math.max(CONFIG.minAmplitude, this.amplitude - 1);
  }

  // Increase wave frequency (with bounds checking)
  increaseFrequency() {
    this.frequency = Math.min(CONFIG.maxFrequency, this.frequency + 1);
  }

  // Decrease wave frequency (with bounds checking)
  decreaseFrequency() {
    this.frequency = Math.max(CONFIG.minFrequency, this.frequency - 1);
  }
}
