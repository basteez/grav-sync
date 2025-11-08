class Sprite {
  constructor(animation, x, y, speed, scale = 1) {
    this.x = x;
    this.y = y;
    this.animation = animation;
    this.w = this.animation[0].width;
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
}
