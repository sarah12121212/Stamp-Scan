let classifier;
let video;
let label = "slow async...";
let modelReady = false;
let confidence = 0;
let iterations = 0;
//let imagesData = {"Class 1": "images2/1.jpg", "Class 10": "images2/10.jpg", "Class 11": "images2/11.jpg", "Class 12": "images2/12.jpg", "Class 13": "images2/13.jpg", "Class 2": "images2/2.jpg", "Class 3": "images2/3.jpg", "Class 4": "images2/4.jpg","Class 5": "images2/5.jpg", "Class 6": "images2/6.jpg", "Class 7": "images2/7.jpg", "Class 8": "images2/8.jpg", "Class 9": "images2/9.jpg"};
let i;
let img;
let header;
let confidencePara;

var popupWindow = document.getElementById("popup-window");
var closeButton = document.getElementById("close-button");

popupWindow.style.display = 'none';


// Load images.json
// fetch('images.json')
//     .then(response => response.json())
//     .then(data => {
//         imagesData = data.images;
//         console.log('Images data loaded:', imagesData);
//     })
//     .catch(error => console.error('Error loading images.json:', error));


function preload() {
    classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/Qg_34YlBm/", modelLoaded);

}



function gotResults(error, results){
    console.log("In gotResults");
    iterations++;

    if (error) {
        console.error("Error in classification:", error);
        return;
    }

    if (results) {
        label = results[0].label;
        i = imagesData[label];
        confidence = results[0].confidence;
    } else{
        label = "nope sorry, nothing";
    }


    // if iterations pass threshold and confidence is high enough, show popup window
    if (iterations > 50 && confidence > .98) {
        iterations = 0;

        // Show the pop-up window when a match is found
        popupWindow.style.display = "block";


        // pause here somehow...
        
        // video.elt.pause();

        if (i) {
            video.pause();
            img = document.createElement('img');
            img.classList.add("round-img");
            img.src = i;
            popupWindow.appendChild(img);

            header = document.createElement('h1');
            header.textContent = label;
            popupWindow.appendChild(header);

            confidencePara = document.createElement('p');
            confidencePara.textContent = `Confidence: ${confidence}`;
            popupWindow.appendChild(confidencePara);

        }



        return;

        
    }
    
    // Endless loop
    classifier.classify(video, gotResults);
    //
}

function modelLoaded() {
    console.log("Model Loaded Successfully!");
    modelReady = true;
}

function setup() {
    createCanvas(windowWidth, windowHeight);


    // back camera:
    const constraints = {
        video: {
            facingMode: "environment"
        },
        audio: false
    };

    video = createCapture(constraints);
    video.elt.muted = true;

    video.elt.onloadeddata = () => {
        console.log("Video has loaded");
        if (modelReady) {
            classifier.classify(video, gotResults);
        } else {
            console.log("Model not ready yet...");
        }

        //classifier.classify(video, gotResults);
    }
    //classifier.classify(video, gotResults);
    video.hide();
}

function draw() {
    background(220);
    image(video, 0, 0, width, height);

    rectMode(CENTER);
    fill(0);
    rect(width/2, height -70, width, 50);
    textSize(32);


    fill(255);
    textAlign(CENTER, CENTER);
    noStroke();
    text(label, width/2, height -70);

    //text(confidence, 200, 200);

    rectMode(CENTER);
    fill(0);
    rect(width/2, height -20, width, 50);
    textSize(32);


    fill(255);
    textAlign(CENTER, CENTER);
    noStroke();
    text(confidence, width/2, height -20);


}

// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function() {
    popupWindow.style.display = "none";

    popupWindow.removeChild(confidencePara);
    popupWindow.removeChild(header); 
    popupWindow.removeChild(img);

    video.play();
    setup();
});




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }


async function test() {
await sleep(1000);
}
test();


