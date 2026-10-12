var latInput;
var longInput;
var dataValueInput;

function setup() {
  var canvas = createCanvas(800, 420);
  var canvasX = canvas.position().x;
  var canvasY = canvas.position().y;
// The actual coordinates will appear within a 720 by 360 pixel range. The extra pixels are there to create space for the interactivity and provide a sense of a border.
  textAlign(CENTER, CENTER)
  
  dataValueInput = createInput("100", "number").size(60, 20);
  dataValueInput.position(canvasX + 100, canvasY + 390);
  dataValuePrefix = createElement("p", "Data value is");
  dataValuePrefix.position(canvasX + 10, canvasY + 378);
  
  dataValueSuffix = createElement("p", "|");
  dataValueSuffix.position(canvasX + 172, canvasY + 378);

  latInput = createInput("0", "number").size(60, 20);
  latInput.position(canvasX + 255, canvasY + 390);
  latPrefix = createElement("p", "Latitude is");
  latPrefix.position(canvasX + 182, canvasY + 378);
  latSuffix = createElement("p", "|");
  latSuffix.position(canvasX + 328, canvasY + 378);

  longInput = createInput("0", "number").size(60, 20);
  longInput.position(canvasX + 424, canvasY + 390);
  longPrefix = createElement("p", "Longitude is");
  longPrefix.position(canvasX + 338, canvasY + 378);
  longSuffix = createElement("p", "|");
  longSuffix.position(canvasX + 495, canvasY + 378);
  
}

function draw() {
  background(220);

  var dataValue;
  var lat;
  var long;

  dataValue = Number(dataValueInput.value());
  lat = Number(latInput.value());
  long = Number(longInput.value());

  noStroke();

var x = 2 * long + 400;
var y = 180 - 2 * lat;
var newX = x;
var newY = y;
  if (dist(mouseX, mouseY, x, y) < 20) {
    newX = x + 50;
    newY = y - 50;

  stroke(0);
  line(x, y, newX, newY);
  noStroke();
}


  // circle(long + 360, 180 - lat, dataValue);
//  smallCircle =   circle(long + 360, 180 - lat, 5);
// mediumCircle =  circle(long + 360, 180 - lat, 10);
// largeCircle =   circle(long + 360, 180 - lat, 15);

  if ((lat < -90) || (lat > 90)) {
    return;
  }
  if ((long < -180) || (long > 180)) {
    return;
  }
  if (dataValue < 0) {
    fill(255, 0, 0);
  }
  if (dataValue > 0) {
    fill(210, 155, 0,);
  }
  if (dataValue < 0) {
    return textSize(20) && text('X', newX, newY,);
  }
  if ((dataValue <= 100) && (dataValue >= 0)) {
    return circle(newX, newY, 10);
  }
  else if ((dataValue <= 200) && (dataValue > 100)) {
    return circle(newX, newY, 20);
  }
  else if (dataValue > 200) {
    return circle(newX, newY, 30);
  }
}