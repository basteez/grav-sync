// Expanding wave effect with shader distortion
class ExpandingWaveEffect {
  constructor(wave, time, success) {
    // Store wave data copy instead of referencing the instance
    this.waveData = {
      baseRadius: wave.baseRadius,
      amplitude: wave.amplitude,
      frequency: wave.frequency,
      phase: wave.phase,
      animationSpeed: wave.animationSpeed,
      color: [...wave.color],
    };
    this.startTime = time;
    this.duration = 2; // frames
    this.maxScale = 6.0; // maximum expansion scale
    this.color = success ? [255, 255, 255, 150] : [255, 0, 0, 150];
    this.hasShader = true; // indicates this effect uses shader
  }

  // Check if effect has finished
  isFinished(currentTime) {
    return Math.floor(currentTime - this.startTime) >= this.duration;
  }

  // Calculate effect progress values
  getProgress(currentTime) {
    const elapsed = currentTime - this.startTime;
    const progress = elapsed / this.duration;
    const scale = 1 + (this.maxScale - 1) * progress;
    const alpha = this.color[3] * (1 - progress);
    return { scale, alpha, progress };
  }

  // Draw only shader effect
  drawShaderOnly(currentTime) {
    const { scale, alpha } = this.getProgress(currentTime);
    if (alpha > 0 && distortionShader && backgroundImg) {
      this.drawWithShader(scale, alpha);
    }
  }

  // Draw only visual effect (no shader)
  drawVisualOnly(currentTime) {
    const { scale, alpha } = this.getProgress(currentTime);
    if (alpha > 0) {
      this.drawVisualEffect(scale, alpha);
    }
  }

  // Draw traditional visual effect with glow
  drawVisualEffect(scale, alpha) {
    const phaseRadians = radians(this.waveData.phase);
    const timeOffset = this.startTime * this.waveData.animationSpeed * 50;

    // Multi-layer glow effect
    for (let glowLevel = 0; glowLevel < 3; glowLevel++) {
      const glowAlpha = alpha * (0.3 - glowLevel * 0.1);
      if (glowAlpha <= 0) continue;

      stroke(this.color[0], this.color[1], this.color[2], glowAlpha);
      strokeWeight(8 - glowLevel * 2);
      noFill();

      beginShape();
      for (let angle = 0; angle <= TWO_PI + 0.01; angle += 0.02) {
        const waveRadius =
          this.waveData.baseRadius * scale +
          this.waveData.amplitude *
            sin(this.waveData.frequency * angle + phaseRadians + timeOffset);

        // Add visual disturbance
        const disturbance =
          2 *
          sin(angle * 15 + this.startTime * 0.8) *
          cos(angle * 8 + this.startTime * 0.6);

        const radius = waveRadius + disturbance;
        const x = CONFIG.earthX + radius * cos(angle);
        const y = CONFIG.earthY + radius * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }

  // Apply shader distortion to background
  drawWithShader(scale, alpha) {
    if (!distortionShader || !backgroundImg) return;

    try {
      distortionBuffer.clear();
      distortionBuffer.shader(distortionShader);

      distortionShader.setUniform("u_texture", backgroundImg);
      distortionShader.setUniform("u_resolution", [width, height]);
      distortionShader.setUniform("u_time", this.startTime);
      distortionShader.setUniform("u_waveCenter", [
        CONFIG.earthX,
        CONFIG.earthY,
      ]);
      distortionShader.setUniform(
        "u_waveRadius",
        this.waveData.baseRadius * scale
      );
      distortionShader.setUniform("u_waveAmplitude", this.waveData.amplitude);
      distortionShader.setUniform("u_waveFrequency", this.waveData.frequency);
      distortionShader.setUniform("u_distortionStrength", alpha * 2.0);

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
    } catch (e) {
      console.error("Shader error:", e);
    }
  }

  // Get the distorted background buffer
  getDistortedBackground() {
    return distortionBuffer;
  }
}
