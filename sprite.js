class Sprite {
  constructor(animation, x, y, speed, scale = 1) {
    this.x = x;
    this.y = y;
    this.animation = animation;
    if (
      this.animation.length > 0 &&
      this.animation[0] &&
      typeof this.animation[0].width !== "undefined"
    ) {
      this.w = this.animation[0].width;
    } else {
      this.w = 0;
      console.warn(
        "Sprite: animation array is empty or first frame has no width property."
      );
    }
    this.len = this.animation.length;
    this.speed = speed;
    this.scale = scale;
    this.index = 0;
  }

  show() {
    let index = floor(this.index) % this.len;
    push();
    imageMode(CENTER);
    image(
      this.animation[index],
      this.x,
      this.y,
      this.w * this.scale,
      this.w * this.scale
    );
    pop();
  }

  animate() {
    this.index += this.speed;
  }

  // Advance animation by one frame (useful for manual control)
  nextFrame() {
    this.index = (this.index + 1) % this.len;
  }
}
