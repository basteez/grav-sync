class Player extends Wave {
  constructor() {
    super(
      CONFIG.playerWave.baseRadius,
      CONFIG.initialAmplitude,
      CONFIG.initialFrequency,
      CONFIG.playerWave.phase,
      CONFIG.playerWave.animationSpeed,
      CONFIG.playerWave.color
    );
  }

  reset() {
    this.amplitude = CONFIG.initialAmplitude;
    this.frequency = CONFIG.initialFrequency;
    this.phase = 0;
  }

  increaseAmplitude() {
    this.amplitude = min(CONFIG.maxAmplitude, this.amplitude + 1);
  }

  decreaseAmplitude() {
    this.amplitude = max(CONFIG.minAmplitude, this.amplitude - 1);
  }

  increaseFrequency() {
    this.frequency = min(CONFIG.maxFrequency, this.frequency + 1);
  }

  decreaseFrequency() {
    this.frequency = max(CONFIG.minFrequency, this.frequency - 1);
  }
}
