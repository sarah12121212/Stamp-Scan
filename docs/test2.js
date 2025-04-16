let classifier;
let video;
let label = "slow async...";
let modelReady = false;
let confidence = 0;
let iterations = 0;
//let imagesData = {"Class 1": "images2/1.jpg", "Class 10": "images2/10.jpg", "Class 11": "images2/11.jpg", "Class 12": "images2/12.jpg", "Class 13": "images2/13.jpg", "Class 2": "images2/2.jpg", "Class 3": "images2/3.jpg", "Class 4": "images2/4.jpg","Class 5": "images2/5.jpg", "Class 6": "images2/6.jpg", "Class 7": "images2/7.jpg", "Class 8": "images2/8.jpg", "Class 9": "images2/9.jpg"};
let classestest = ['109', '2', '21', '22', '4', '42', '48', '57', '64', '69', '73']
let classes10 = ['1040', '1060', '109', '1118', '1144', '1148', '1162', '1169', '1204', '1205', '1212', '1224', '123', '1240', '1282', '133', '1348', '1368', '138', '1403', '146', '1600', '1609', '1710', '1730', '1739', '1742', '1794', '1798', '1843', '1854', '2', '2022.14', '2022.6', '21', '2101', '2162', '2173', '218', '219', '2191', '22', '2224', '2243', '2245', '2258', '2261', '2266', '229', '2315', '2340', '2346', '2390', '243', '2438', '2556', '2559', '2561', '2564', '2583', '2584', '2589', '2605', '2618', '268', '2680', '272', '2729', '2746', '2799', '2808', '2818', '2888', '2902', '2905', '2915', '2919', '2922', '2925', '2957', '298', '300', '304', '3051', '306', '3080', '3088', '3101', '3110', '312', '3123', '3126', '3137', '3148', '3166', '3179', '3188', '3205', '321', '3217', '322', '3226', '3248', '3264', '3281', '329', '3382', '3406', '3445', '3531', '3603', '3604', '3617', '3645', '3659', '3665', '3668', '3680', '3706', '3722', '3723', '3737', '3746', '3752', '3758', '3765', '3791', '3805', '3808', '3821', '3823', '3829', '3860', '3871', '390', '3965', '3986', '3992', '4', '4010', '4013', '4016', '4036', '4054', '4067', '4075', '4080', '4084', '4095', '4098', '4111', '4121', '4180', '4182', '42', '4247', '4265', '4266', '433', '4356', '4357', '4387', '4408', '4410', '4427', '452', '4534', '4536', '4547', '4554', '4560', '459', '4608', '461', '4626', '4648', '4653', '4667', '4712', '4716', '4723', '4731', '4740', '4746', '4763', '4763 (2)', '4765', '4769', '477', '4784', '4792', '48', '4864', '4876', '4910', '4931', '4943', '4992', '4994', '5026', '5029', '5037', '5051', '5075', '5077', '5111', '5203', '5253', '5298', '5299', '5375', '5381', '5386', '5409', '5416', '5459', '5460', '5526', '5630', '5631', '565', '5651', '5694', '57', '5700', '5702', '5703', '5704', '5705', '5706', '5709', '571', '5710', '5711', '5714', '5720', '5721', '5723', '5724', '5742', '5744', '5747', '5753', '5754', '5762', '5763', '5764', '5765', '582', '607', '635', '64', '650', '69', '728', '73', '730', '787', '920', '944']
let i;
let img;
let header;
let confidencePara;
let gyroThreshold = 1;
let accelThreshold = 1;
let isSlowGyro=true;
let isSlowAccel=true;

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


// function preload() {
//     classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/Qg_34YlBm/", modelLoaded);

// }

// class TFOpLambda extends tf.layers.Layer {
//     constructor(config) {
//       super(config);
//       this.name = config.name;
//       this.function = config.function;
//     }
  
//     call(input) {
//       return tf.tidy(() => {
//         // Implement the function here
//         // For example, if function is 'math.truediv':
//         return tf.div(input, 127.5);
//       });
//     }
  
//     computeOutputShape(inputShape) {
//       // Implement the output shape calculation here
//       return inputShape;
//     }
//   }
  
//   tf.serialization.registerClass(TFOpLambda);

document.getElementById("startMotion").addEventListener("click", () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    console.log("Gyroscope access granted");
                } else {
                    console.log("Gyroscope access denied");
                    // Optionally, set the slow vars so they don’t interfere
                    isSlowGyro = true;
                    isSlowAccel = true;
                }
            })
            .catch(console.error);
    }
});

window.addEventListener("devicemotion", (event) => {

    let gyroMagnitude = 0;
    const rotationRate = event.rotationRate;
    if (rotationRate) {
        // equation for norm of vector through x y z dimensions
        const gyroMagnitude = Math.sqrt(
            Math.pow(rotationRate.alpha || 0, 2) +Math.pow(rotationRate.beta || 0, 2) + Math.pow(rotationRate.gamma || 0, 2)
        );
        console.log("Gyro", gyroMagnitude);
    }

    isSlowGyro = gyroMagnitude < gyroThreshold;

    // Translation motion
    let accelMagnitude = 0;
    const acceleration = event.acceleration;
    if (acceleration) {
        // equation for norm of vector through x y z dimensions
        const accelMagnitude = Math.sqrt(
            Math.pow(acceleration.x || 0, 2) +Math.pow(acceleration.y || 0, 2) + Math.pow(acceleration.z || 0, 2)
        );
        console.log("Acc", accelMagnitude);
    }

    isSlowAccel = accelMagnitude < accelThreshold;
});


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

// if (typeof DeviceMotionEvent.requestPermission === "function") {
//     DeviceMotionEvent.requestPermission()
//         .then((response) => {
//             if (response === "granted") {
//                 console.log("Gyroscope access granted");
//             }else{
//                 console.log("Gyroscope access denied");
//                 // set slow vars to true so they don't interfere
//                 isSlowGyro = true;
//                 isSlowAccel = true;
//             }
//         })
//         .catch(console.error);
// }

// function modelLoaded() {
//     console.log("Model Loaded Successfully!");
//     modelReady = true;
// }

let model;

async function loadModel2() {
    const modelUrl = 'https://raw.githubusercontent.com/sarah12121212/Stamp-Scan/refs/heads/main/docs/panel10_mobilenettestv2222/model.json';
    console.log("modelURL:", modelUrl);
    try {
        console.log("Loading model from:", modelUrl);
        model = await tf.loadLayersModel(modelUrl);
        console.log("Model Loaded");
        modelReady = true;
    } catch (error) {
        console.error("Error loading model:", error);
    }
    //console.log("Hello from loadModel()");
}

function preprocessVideoFrame(video) {
    return tf.tidy(() => {
        let tensor = tf.browser.fromPixels(video)
            .resizeNearestNeighbor([224, 224]) // match MobileNet input size
            .toFloat()
            .expandDims();
        return tensor;
    });
}

async function classifyFrame() {
    if (modelReady && video && video.elt.readyState === 4) {
        iterations++;
        const inputTensor = preprocessVideoFrame(video.elt);
        const prediction = await model.predict(inputTensor).data();
        //console.log(prediction);
        
        inputTensor.dispose();

        // find top prediction
        const maxIdx = prediction.indexOf(Math.max(...prediction));
        pred = classes10[maxIdx];
        //label = `Class ${maxIdx}`;
        confidence = prediction[maxIdx];
        label = `Class ${pred}`;
        console.log(isSlowAccel, isSlowGyro);

        if (confidence > 0.98 && isSlowGyro && isSlowAccel && iterations > 50) {
            popupWindow.style.display = "block";
            i = 1; // don't remember why i is being used here, but it is
            if (i) {
                video.pause();
                const imagePath = `classimages/${pred}.jpg`;
                img = document.createElement('img');
                img.classList.add("round-img");
                img.src = imagePath;
                popupWindow.appendChild(img);
    
                header = document.createElement('h1');
                header.textContent = label;
                popupWindow.appendChild(header);
    
                confidencePara = document.createElement('p');
                confidencePara.textContent = `Confidence: ${confidence}`;
                popupWindow.appendChild(confidencePara);
    
            }    
            iterations = 0;
            return;
        }
    }

    requestAnimationFrame(classifyFrame);
}

async function visualizePreprocessedFrame() {
    if (video && video.elt.readyState === 4) {
        // Preprocess the video frame
        const inputTensor = preprocessVideoFrame(video.elt);

        // Remove the batch dimension to visualize the frame
        const reshapedTensor = inputTensor.squeeze();

        // Convert the tensor to pixel data
        const pixelData = await tf.browser.toPixels(reshapedTensor);

        // Create an image from the pixel data
        const img = createImage(224, 224); // Match the size of the preprocessed frame
        img.loadPixels();
        for (let i = 0; i < pixelData.length; i++) {
            img.pixels[i] = pixelData[i];
        }
        img.updatePixels();

        // Draw the preprocessed frame on the canvas
        image(img, 0, 0, 224, 224); // Adjust position and size as needed

        // Dispose of tensors to free memory
        inputTensor.dispose();
        reshapedTensor.dispose();
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    console.log("starting setup...");


    // back camera:
    const constraints = {
        video: {
            facingMode: "environment"
        },
        audio: false
    };
    loadModel2();
    video = createCapture(constraints);
    video.elt.muted = true;

    video.elt.onloadeddata = () => {
        console.log("Video has loaded");
        if (modelReady) {
            classifyFrame();
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


