var latInput;
var longInput;
var dataValueInput;

function setup() {
  createCanvas(800, 420);
// The actual coordinates will appear within a 720 by 360 pixel range. The extra pixels are there to create space for the interactivity and provide a sense of a border.
  textAlign(CENTER, CENTER)
  
  dataValueInput = createInput("100", "number").size(60, 20);
  dataValueInput.position(100,380);
  dataValuePrefix = createElement("p", "Data value is");
  dataValuePrefix.position(
    dataValueInput.x - 90, 
    dataValueInput.y -13);
  
  dataValueSuffix = createElement("p", "|");
  dataValueSuffix.position(
    dataValueInput.x + 72, 
    dataValueInput.y -13);

  latInput = createInput("0", "number").size(60, 20);
  latInput.position(260,380);
  latPrefix = createElement("p", "Latitude is");
  latPrefix.position(
    latInput.x - 80, 
    latInput.y - 13);
  latSuffix = createElement("p", "|");
  latSuffix.position(
    latInput.x + 72, 
    latInput.y -13);

  longInput = createInput("0", "number").size(60, 20);
  longInput.position(425,380);
  longPrefix = createElement("p", "Longitude is");
  longPrefix.position(
    longInput.x - 85, 
    longInput.y - 13);
  longSuffix = createElement("p", "|");
  longSuffix.position(
    longInput.x + 72, 
    longInput.y -13);
  
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