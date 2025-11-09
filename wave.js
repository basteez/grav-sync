// Wave class representing oscillating circular waves
class Wave {
  constructor(baseRadius, amplitude, frequency, phase, animationSpeed, color) {
    this.baseRadius = baseRadius;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.animationSpeed = animationSpeed;
    this.color = color;
  }

  // Draw the wave with enhanced visual effects
  draw(currentTime) {
    const phaseRadians = radians(this.phase);
    const timeOffset = currentTime * this.animationSpeed * 50;

    // Draw energy field background
    this.drawEnergyField(phaseRadians, timeOffset);

    // Draw subtle glow effect
    this.drawWaveGlow(phaseRadians, timeOffset);

    // Draw main wave with dynamic styling
    this.drawMainWave(phaseRadians, timeOffset);

    // Draw constellation points along the wave
    this.drawConstellationPoints(currentTime, phaseRadians, timeOffset);
  }

  // Draw subtle energy field background
  drawEnergyField(phaseRadians, timeOffset) {
    fill(this.color[0], this.color[1], this.color[2], 8);
    noStroke();

    beginShape();
    for (let angle = 0; angle <= TWO_PI + 0.2; angle += 0.1) {
      const radius =
        this.baseRadius +
        this.amplitude *
          sin(this.frequency * angle + phaseRadians + timeOffset) +
        15; // Expand the field slightly
      const x = CONFIG.earthX + radius * cos(angle);
      const y = CONFIG.earthY + radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Draw subtle glow behind the wave
  drawWaveGlow(phaseRadians, timeOffset) {
    stroke(this.color[0], this.color[1], this.color[2], 25);
    strokeWeight(10);
    noFill();

    beginShape();
    for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.08) {
      const radius =
        this.baseRadius +
        this.amplitude *
          sin(this.frequency * angle + phaseRadians + timeOffset);
      const x = CONFIG.earthX + radius * cos(angle);
      const y = CONFIG.earthY + radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Draw main wave with dynamic thickness and color
  drawMainWave(phaseRadians, timeOffset) {
    noFill();

    beginShape();
    for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.03) {
      const waveValue = sin(this.frequency * angle + phaseRadians + timeOffset);
      const radius = this.baseRadius + this.amplitude * waveValue;

      // Dynamic thickness and color intensity based on wave amplitude
      const localAmplitude = Math.abs(this.amplitude * waveValue);
      const thickness = 2 + localAmplitude * 0.1;
      const intensity = 0.7 + localAmplitude * 0.3;
      const alpha = this.color[3] * intensity;

      stroke(this.color[0], this.color[1], this.color[2], alpha);
      strokeWeight(thickness);

      const x = CONFIG.earthX + radius * cos(angle);
      const y = CONFIG.earthY + radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Draw constellation-like points along the wave
  drawConstellationPoints(currentTime, phaseRadians, timeOffset) {
    const pointCount = 12;
    for (let i = 0; i < pointCount; i++) {
      const angle = (TWO_PI / pointCount) * i;
      let radius =
        this.baseRadius +
        this.amplitude *
          sin(this.frequency * angle + phaseRadians + timeOffset);

      // Add slight random offset for organic feel
      const offsetAngle = angle + sin(currentTime * 0.5 + i) * 0.1;
      const offsetRadius = radius + cos(currentTime * 0.3 + i) * 2;

      const x = CONFIG.earthX + offsetRadius * cos(offsetAngle);
      const y = CONFIG.earthY + offsetRadius * sin(offsetAngle);

      // Draw star-like point
      fill(this.color[0], this.color[1], this.color[2], 180);
      noStroke();
      rectMode(CENTER);

      // Small cross for star effect
      const size = 1.5;
      rect(x, y, size, 1);
      rect(x, y, 1, size);
    }
  }

  // Calculate synchronization score between this wave and another wave
  calculateSync(otherWave, time) {
    const samples = CONFIG.syncSamples;
    let totalNormDiff = 0;

    for (let i = 0; i < samples; i++) {
      const angle = (TWO_PI / samples) * i;
      const timeOffset = time * this.animationSpeed * 50;
      const otherTimeOffset = time * otherWave.animationSpeed * 50;

      // Normalized oscillation comparison (range -1..1)
      const targetNorm = sin(
        this.frequency * angle + radians(this.phase) + timeOffset
      );
      const playerNorm = sin(
        otherWave.frequency * angle + radians(otherWave.phase) + otherTimeOffset
      );

      // Difference between normalized waves (0..2), normalize to 0..1
      const normDiff = Math.abs(targetNorm - playerNorm) / 2;
      totalNormDiff += normDiff;
    }

    const avgNormDiff = totalNormDiff / samples;
    const freqScore = Math.max(0, 1 - avgNormDiff);

    // Amplitude similarity comparison
    const maxAmpRange =
      CONFIG.maxAmplitude - CONFIG.minAmplitude || CONFIG.maxAmplitude || 1;
    const ampDiff =
      Math.abs(this.amplitude - otherWave.amplitude) / maxAmpRange;
    const ampScore = 1 - Math.max(0, Math.min(1, ampDiff));

    // Weighted combination
    const combined =
      freqScore * CONFIG.syncWeights.frequency +
      ampScore * CONFIG.syncWeights.amplitude;

    return Math.max(0, Math.min(1, combined));
  }
}
