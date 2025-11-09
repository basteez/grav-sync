class Game {
  constructor() {
    this.time = 0;
    this.score = 0;
    this.sync = 0;
    this.targetWave = new Wave(
      CONFIG.targetWave.baseRadius,
      CONFIG.targetWave.amplitude,
      this.getRandomInt(
        CONFIG.targetWave.frequency.min,
        CONFIG.targetWave.frequency.max
      ),
      CONFIG.targetWave.phase,
      CONFIG.targetWave.animationSpeed,
      CONFIG.targetWave.color
    );
    this.player = new Player();
    this.inputHandler = new InputHandler(this.player);
  }

  update() {
    this.time += CONFIG.timeIncrement;

    // Handle input
    this.inputHandler.handleContinuousInput();

    // Calculate sync once per frame
    this.sync = this.targetWave.calculateSync(this.player, this.time);

    // Make target wave circle gradually smaller
    if (this.targetWave.baseRadius > CONFIG.playerRadius) {
      this.targetWave.baseRadius -= CONFIG.targetRadiusDecrement;
      this.targetWave.baseRadius = max(
        CONFIG.playerRadius,
        this.targetWave.baseRadius
      );
    }

    // Check for level completion
    if (this.targetWave.baseRadius === CONFIG.playerRadius) {
      if (this.sync > CONFIG.syncThreshold) {
        this.score++;
      }
      // Reset target wave
      this.targetWave.frequency = this.getRandomInt(
        CONFIG.targetWave.frequency.min,
        CONFIG.targetWave.frequency.max
      );
      this.targetWave.baseRadius = CONFIG.targetWave.baseRadius;
    }
  }

  draw() {
    background(CONFIG.clearColor);

    this.targetWave.draw(this.time);
    this.player.draw(this.time);

    earth.show();
    earth.animate();

    UI.display(this.sync, this.score, this.player);
  }

  handleKeyPressed() {
    this.inputHandler.handleKeyPressed();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
