const screenWith = 640;
const screenHeight = 480;
const clearColor = "black";

function setup() {
  createCanvas(screenWith, screenHeight);
}

function draw() {
  background(clearColor);
  drawEarth();
}

function drawEarth() {
  fill("#000055");
  circle(screenWith / 2, screenHeight / 2, 100);
}
