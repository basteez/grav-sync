let spritedata;
let spritesheet;
let animation = [];
let earth;
let game;

function preload() {
  spritedata = loadJSON("animations/earth.json");
  spritesheet = loadImage("sprites/earth.png");
}

function setup() {
  createCanvas(CONFIG.screenWidth, CONFIG.screenHeight);
  let frames = spritedata.frames;

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  // Scale sprite to match earthRadius * 2 (target diameter = 96px, source sprite = 48px)
  let spriteScale = (CONFIG.earthRadius * 2) / 48;
  earth = new Sprite(
    animation,
    CONFIG.earthX,
    CONFIG.earthY,
    random(0.1, 0.4),
    spriteScale
  );

  game = new Game();
}

function draw() {
  game.update();
  game.draw();
}

function keyPressed() {
  game.handleKeyPressed();
}
