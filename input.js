// Input handler for player controls
class InputHandler {
  constructor(player) {
    this.player = player;
    this.inputCooldown = 0;
    this.lastKeyStates = {};
  }

  // Handle continuous input with cooldown system
  handleContinuousInput() {
    this.inputCooldown++;

    // Key mappings for wave control
    const keys = {
      w: {
        pressed: keyIsDown(87) || keyIsDown(119), // W/w
        action: () => this.player.increaseAmplitude(),
      },
      s: {
        pressed: keyIsDown(83) || keyIsDown(115), // S/s
        action: () => this.player.decreaseAmplitude(),
      },
      a: {
        pressed: keyIsDown(65) || keyIsDown(97), // A/a
        action: () => this.player.decreaseFrequency(),
      },
      d: {
        pressed: keyIsDown(68) || keyIsDown(100), // D/d
        action: () => this.player.increaseFrequency(),
      },
    };

    let anyJustPressed = false;

    // Process each key
    for (const [key, keyData] of Object.entries(keys)) {
      const justPressed = keyData.pressed && !this.lastKeyStates[key];

      // Handle instant presses
      if (justPressed) {
        keyData.action();
        anyJustPressed = true;
      }
      // Handle continuous presses (with cooldown)
      else if (
        this.inputCooldown >= CONFIG.inputCooldownMax &&
        keyData.pressed &&
        !anyJustPressed
      ) {
        keyData.action();
      }

      // Save current key state
      this.lastKeyStates[key] = keyData.pressed;
    }

    // Reset cooldown timer when action performed
    if (anyJustPressed || this.inputCooldown >= CONFIG.inputCooldownMax) {
      this.inputCooldown = 0;
    }
  }

  // Handle single key presses
  handleKeyPressed() {
    if (key === " ") {
      this.player.reset();
    }
  }
}
