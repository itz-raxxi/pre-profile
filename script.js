const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download-button');
const zoomInButton = document.getElementById('zoom-in-button');
const zoomOutButton = document.getElementById('zoom-out-button');
const moveLeftButton = document.getElementById('move-left-button');
const moveRightButton = document.getElementById('move-right-button');
const moveUpButton = document.getElementById('move-up-button');
const moveDownButton = document.getElementById('move-down-button');
const zoomControls = document.querySelector('.controls');

zoomControls.style.display = 'none'; // Initially hide the controls

let userImage = new Image();
let imageX = 0; // Position of the user image on the canvas
let imageY = 0; // Position of the user image on the canvas
let scale = 1; // Scale factor for zooming

// Set fixed canvas size (1:1 ratio)
canvas.width = 600; // Example width
canvas.height = 600; // Example height

const maskImage = new Image();
maskImage.src = 'mask.png'; // Replace with your mask PNG URL

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userImage.src = e.target.result;
            userImage.onload = function() {
                // Center the image on the canvas
                imageX = (canvas.width - userImage.width) / 2;
                imageY = (canvas.height - userImage.height) / 2;
                drawImages();
                
                // Show zoom and adjust buttons
                zoomControls.style.display = 'flex'; // Show controls when an image is uploaded
            };
        };
        reader.readAsDataURL(file);
    } else {
        zoomControls.style.display = 'none'; // Hide controls if no file is selected
    }
});

// Function to draw images on canvas
function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    // Draw user image with scaling
    ctx.drawImage(userImage, imageX, imageY, userImage.width * scale, userImage.height * scale); 
    // Draw mask image at fixed size (e.g., 600x600)
    ctx.drawImage(maskImage, 0, 0, 600, 600); // Replace 600, 600 with the actual dimensions of your mask image if different
}

// Zoom In
zoomInButton.addEventListener('click', () => {
    scale *= 1.1; // Increase scale by 10%
    drawImages();
});

// Zoom Out
zoomOutButton.addEventListener('click', () => {
    scale /= 1.1; // Decrease scale by 10%
    drawImages();
});

// Move Left
moveLeftButton.addEventListener('click', () => {
    imageX -= 20; // Move left
    drawImages();
});

// Move Right
moveRightButton.addEventListener('click', () => {
    imageX += 20; // Move right
    drawImages();
});

// Move Up
moveUpButton.addEventListener('click', () => {
    imageY -= 20 ; // Move up
    drawImages();
});

// Move Down
moveDownButton.addEventListener('click', () => {
    imageY += 20; // Move down
    drawImages();
});

// Function to download the canvas content as an image
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png'; // Set the file name for download
    link.href = canvas.toDataURL(); // Convert canvas content to data URL
    link.click(); // Trigger download
});

// Load the mask image and draw it once it's loaded
maskImage.onload = () => {
    drawImages(); // Initial draw
};
