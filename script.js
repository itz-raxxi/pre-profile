const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');

menuIcon.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('image-canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download-button');

const maskImage = new Image();
maskImage.src = 'mask.png'; // Replace with your mask PNG URL
maskImage.onload = () => {
    // Set canvas size to match the mask
    canvas.width = maskImage.width;
    canvas.height = maskImage.height;
    drawImages(); // Initial draw
};

let userImage = new Image();
let imageX = 0; // Position of the user image on the canvas
let imageY = 0; // Position of the user image on the canvas
let scale = 1; // Scale factor for zooming
let isDragging = false;
let startX, startY;

// File input change event
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userImage.src = e.target.result;
            userImage.onload = function() {
                // Center the image on the canvas
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
    ctx.drawImage(userImage, imageX, imageY, userImage.width * scale, userImage.height * scale); 
    ctx.drawImage(maskImage, 0, 0, maskImage.width, maskImage.height);
}

// Mouse and touch events for drag and zoom
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX - imageX;
    startY = e.offsetY - imageY;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        imageX = e.offsetX - startX;
        imageY = e.offsetY - startY;
        drawImages();
    }
});

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - imageX;
        startY = e.touches[0].clientY - imageY;
    } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        scale = Math.max(0.1, Math.min(distance / 100, 3)); // Limit scale between 0.1 and 3
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        imageX = e.touches[0].clientX - startX;
        imageY = e.touches[0].clientY - startY;
        drawImages();
        e.preventDefault(); // Prevent scrolling
    } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        scale = Math.max(0.1, Math.min(distance / 100, 3)); // Limit scale between 0.1 and 3
        drawImages();
        e.preventDefault(); // Prevent scrolling
    }
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Function to download the canvas content as an image
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'pre-profile.jpg'; // Set the file name for download
    link.href = canvas.toDataURL(); // Convert canvas content to data URL
    link.click(); // Trigger download
});
