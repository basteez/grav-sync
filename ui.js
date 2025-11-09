// Static UI class for displaying game information
class UI {
  static display(sync, score, player) {
    // Display controls
    fill(255);
    textSize(14);
    text("A (" + player.amplitude + ")", 495, 413);
    text("F (" + player.frequency + ")", 125, 413);
    //text("SPACE: Reset", 10, 80);

    // Display sync status with color coding
    fill(sync > CONFIG.syncThreshold ? color(0, 255, 0) : color(255, 0, 0));
    text("Sync: " + Math.round(sync * 100) + "%", 295, 360);

    // Display score
    fill("white");
    text("Score: " + score, 295, 448);
  }
}
