class Wave {
  constructor(baseRadius, amplitude, frequency, phase, animationSpeed, color) {
    this.baseRadius = baseRadius;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.animationSpeed = animationSpeed;
    this.color = color;
  }

  draw(currentTime) {
    stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
    strokeWeight(3);
    noFill();

    beginShape();
    for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.05) {
      let phaseRadians = radians(this.phase);

      // Base wave calculation (for sync)
      let baseRadius =
        this.baseRadius +
        this.amplitude *
          sin(
            this.frequency * angle +
              phaseRadians +
              currentTime * this.animationSpeed * 50
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
      let x = CONFIG.earthX + radius * cos(angle);
      let y = CONFIG.earthY + radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    stroke("black");
  }

  calculateSync(otherWave, time) {
    let samples = CONFIG.syncSamples;
    let totalNormDiff = 0;
    for (let i = 0; i < samples; i++) {
      let angle = (TWO_PI / samples) * i;
      // normalized oscillation (range -1..1), so amplitude doesn't affect this
      let targetNorm = sin(
        this.frequency * angle +
          radians(this.phase) +
          time * this.animationSpeed * 50
      );
      let playerNorm = sin(
        otherWave.frequency * angle +
          radians(otherWave.phase) +
          time * otherWave.animationSpeed * 50
      );
      // difference between normalized waves (0..2), divide by 2 to get 0..1
      let normDiff = abs(targetNorm - playerNorm) / 2;
      totalNormDiff += normDiff;
    }
    let avgNormDiff = totalNormDiff / samples;
    let freqScore = max(0, 1 - avgNormDiff);

    // amplitude similarity: compare amplitudes (0..maxAmplitude)
    let maxAmpRange = CONFIG.maxAmplitude - CONFIG.minAmplitude;
    // avoid division by zero
    if (maxAmpRange <= 0) maxAmpRange = CONFIG.maxAmplitude || 1;
    let ampDiff = abs(this.amplitude - otherWave.amplitude) / maxAmpRange;
    ampDiff = max(0, min(1, ampDiff));
    let ampScore = 1 - ampDiff;

    // combine scores with weights: frequency 80%, amplitude 20%
    let combined =
      freqScore * CONFIG.syncWeights.frequency +
      ampScore * CONFIG.syncWeights.amplitude;
    return max(0, min(1, combined));
  }
}
