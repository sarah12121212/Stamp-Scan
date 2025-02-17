let classifier;
let video;
let label = "slow async...";
let confidence;

function preload() {
    classifier = ml5.imageClassifier("MobileNet");
}

function gotResults(results){
    console.log(results);
    label = results[0].label;
    confidence = results[0].confidence;
}

function setup() {
    createCanvas(800,800);
    video = createCapture(VIDEO);
    classifier.classify(video, gotResults);
}

function draw() {
    background(220);
    image(img, 0, 0, width, height);

    rectMode(CENTER);
    fill(0);
    rect(200, 200, 400, 50);
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    noStroke();
    text(label, 200, 200);
    text(confidence, 200, 200);


}