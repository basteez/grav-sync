// Main game class managing game state and logic
class Game {
  constructor() {
    this.time = 0;
    this.score = 0;
    this.sync = 0;
    this.effects = [];

    // Initialize target wave with random frequency
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

  // Update game state each frame
  update() {
    this.time += CONFIG.timeIncrement;

    // Handle player input
    this.inputHandler.handleContinuousInput();

    // Calculate synchronization score
    this.sync = this.targetWave.calculateSync(this.player, this.time);

    // Gradually shrink target wave radius
    if (this.targetWave.baseRadius > CONFIG.playerRadius) {
      this.targetWave.baseRadius -= CONFIG.targetRadiusDecrement;
      this.targetWave.baseRadius = Math.max(
        CONFIG.playerRadius,
        this.targetWave.baseRadius
      );
    }

    // Check for level completion
    if (this.targetWave.baseRadius === CONFIG.playerRadius) {
      const success = this.sync > CONFIG.syncThreshold;
      if (success) {
        this.score++;
      }

      // Create expanding wave visual effect
      this.effects.push(
        new ExpandingWaveEffect(this.targetWave, this.time, success)
      );

      // Reset target wave for next level
      this.targetWave.frequency = this.getRandomInt(
        CONFIG.targetWave.frequency.min,
        CONFIG.targetWave.frequency.max
      );
      this.targetWave.baseRadius = CONFIG.targetWave.baseRadius;
    }

    // Update and remove finished effects
    this.effects = this.effects.filter(
      (effect) => !effect.isFinished(this.time)
    );
  }

  // Render game elements
  draw() {
    // Draw background
    if (backgroundImg) {
      image(backgroundImg, 0, 0, width, height);
    } else {
      background(CONFIG.clearColor);
    }

    // Apply target wave distortion if no expanding effects are active
    const hasActiveExpandingEffect = this.effects.some(
      (effect) => effect.hasShader && !effect.isFinished(this.time)
    );

    if (!hasActiveExpandingEffect) {
      this.applyTargetWaveDistortion();
    }

    // Apply shader distortion if active effects exist
    let distortedBackground = null;
    for (const effect of this.effects) {
      if (effect.hasShader && !effect.isFinished(this.time)) {
        effect.drawShaderOnly(this.time);
        distortedBackground = effect.getDistortedBackground();
        break; // Only one shader effect at a time
      }
    }

    // Use distorted background if available (from expanding wave effects)
    if (distortedBackground) {
      image(distortedBackground, 0, 0, width, height);
    }

    // Draw game elements
    this.targetWave.draw(this.time);
    this.player.draw(this.time);

    // Draw active visual effects (without shader)
    for (const effect of this.effects) {
      effect.drawVisualOnly(this.time);
    }

    earth.show();
    earth.animate();

    UI.display(this.sync, this.score, this.player);
  }

  // Handle key press events
  handleKeyPressed() {
    this.inputHandler.handleKeyPressed();
  }

  // Utility function for random integers
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Apply subtle distortion effect from target wave
  applyTargetWaveDistortion() {
    if (!distortionShader || !backgroundImg) return;

    try {
      distortionBuffer.clear();
      distortionBuffer.shader(distortionShader);

      // Very subtle distortion parameters for target wave
      distortionShader.setUniform("u_texture", backgroundImg);
      distortionShader.setUniform("u_resolution", [width, height]);
      distortionShader.setUniform("u_time", this.time * 0.1); // Much slower animation
      distortionShader.setUniform("u_waveCenter", [
        CONFIG.earthX,
        CONFIG.earthY,
      ]);
      distortionShader.setUniform("u_waveRadius", this.targetWave.baseRadius);
      distortionShader.setUniform(
        "u_waveAmplitude",
        this.targetWave.amplitude * 0.3
      ); // Much weaker
      distortionShader.setUniform("u_waveFrequency", this.targetWave.frequency);
      distortionShader.setUniform("u_distortionStrength", 0.3); // Very subtle

      // Render to buffer
      distortionBuffer.quad(
        -width / 2,
        -height / 2,
        width / 2,
        -height / 2,
        width / 2,
        height / 2,
        -width / 2,
        height / 2
      );

      // Apply the distorted background
      image(distortionBuffer, 0, 0);
    } catch (e) {
      console.error("Target wave distortion error:", e);
    }
  }
}
