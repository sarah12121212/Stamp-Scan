

const extractor = ml5.featureExtractor('MobileNet', modelLoaded);

let images = []

function fetchJSON(){
    fetch('./images.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }
        return response.json();  
    })
    .then(data => console.log(data))  
    .catch(error => console.error('Failed to fetch data:', error)); 
    
}

