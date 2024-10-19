const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download-button');

const maskImage = new Image();
maskImage.src = 'mask.png'; // Replace with your mask PNG URL
  
let userImage = new Image();
let imageX = 0; // Position of the user image on the canvas
let imageY = 0; // Position of the user image on the canvas
let scale = 1; // Scale factor for zooming
let isDragging = false; // Flag to check if the image is being dragged
let dragStartX, dragStartY; // Starting coordinates for drag

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userImage.src = e.target.result;
            userImage.onload = function() {
                // Set canvas size to match the mask
                canvas.width = maskImage.width;
                canvas.height = maskImage.height;
                drawImages();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Function to draw images on canvas
function drawImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(userImage, imageX, imageY, maskImage.width * scale, maskImage.height * scale); // Draw user image with scaling
    ctx.drawImage(maskImage, 0, 0, maskImage.width, maskImage.height); // Draw mask image
}

// Mouse down event to start dragging
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.offsetX - imageX; // Calculate the offset
    dragStartY = e.offsetY - imageY;
});

// Mouse move event to drag the image
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        imageX = e.offsetX - dragStartX; // Update image position
        imageY = e.offsetY - dragStartY;
        drawImages(); // Redraw images
    }
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Mouse leave event to stop dragging if the mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Mouse wheel event for zooming
canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent default scrolling
    const zoomFactor = 0.1; // Zoom factor
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Update scale
    scale += (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    scale = Math.max(scale, 0.1); // Prevent scale from going below 0.1

    // Adjust image position based on zoom
    imageX = mouseX - (mouseX - imageX) * (scale / (scale - zoomFactor));
    imageY = mouseY - (mouseY - imageY) * (scale / (scale - zoomFactor));
    
    drawImages(); // Redraw images
});

// Touch events for pinch-to-zoom
let initialDistance = 0;

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        const zoomChange = currentDistance / initialDistance;
        scale *= zoomChange;
        scale = Math.max(scale, 0.1); // Prevent scale from going below 0.1

        // Adjust image position based on zoom
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        imageX = midX - (midX - imageX)
        imageY = midY - (midY - imageY) * (scale / (scale / zoomChange));
        
        drawImages(); // Redraw images with updated scale and position
    }
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
    // Set canvas size to match the mask
    canvas.width = maskImage.width;
    canvas.height = maskImage.height;
    drawImages(); // Initial draw
};