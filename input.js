class InputHandler {
  constructor(player) {
    this.player = player;
    this.inputCooldown = 0;
    this.lastKeyStates = {};
  }

  handleContinuousInput() {
    this.inputCooldown++;

    // Define key mappings
    const keys = {
      w: {
        pressed: keyIsDown(87) || keyIsDown(119),
        action: () => this.player.increaseAmplitude(),
      },
      s: {
        pressed: keyIsDown(83) || keyIsDown(115),
        action: () => this.player.decreaseAmplitude(),
      },
      a: {
        pressed: keyIsDown(65) || keyIsDown(97),
        action: () => this.player.decreaseFrequency(),
      },
      d: {
        pressed: keyIsDown(68) || keyIsDown(100),
        action: () => this.player.increaseFrequency(),
      },
    };

    let anyJustPressed = false;

    // Handle instant presses and continuous controls
    for (let key in keys) {
      const keyData = keys[key];
      const justPressed = keyData.pressed && !this.lastKeyStates[key];

      // Instant press (always works)
      if (justPressed) {
        keyData.action();
        anyJustPressed = true;
      }
      // Continuous press (only if timer expired and no instant press)
      else if (
        this.inputCooldown >= CONFIG.inputCooldownMax &&
        keyData.pressed &&
        !anyJustPressed
      ) {
        keyData.action();
      }

      // Save current state
      this.lastKeyStates[key] = keyData.pressed;
    }

    // Reset timer if any action was performed
    if (anyJustPressed || this.inputCooldown >= CONFIG.inputCooldownMax) {
      this.inputCooldown = 0;
    }
  }

  handleKeyPressed() {
    if (key === " ") {
      this.player.reset();
    }
  }
}
