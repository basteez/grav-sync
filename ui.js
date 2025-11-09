// Static UI class for displaying game information
class UI {
  static display(sync, score, player) {
    // Display controls
    fill(255);
    textSize(14);
    text("Controls:", 10, 20);
    text("W/S: Amplitude (" + player.amplitude + ")", 10, 40);
    text("A/D: Frequency (" + player.frequency + ")", 10, 60);
    text("SPACE: Reset", 10, 80);

    // Display sync status with color coding
    fill(sync > CONFIG.syncThreshold ? color(0, 255, 0) : color(255, 0, 0));
    text("Sync: " + Math.round(sync * 100) + "%", 10, 110);

    // Display score
    fill("white");
    text("Score: " + score, 10, 130);
  }
}
