let classifier;
let img;

function preload() {
    classifier = ml5.imageClassifier("MobileNet");
    img = loadImage("images/5.jpg")
}

function gotResults(results){
    console.log(results);
}

function setup() {
    createCanvas(400,400);
    classifier.classify(img, gotResults);
}

function draw() {
    background(220);
    image(img, 0, 0, width, height);
}