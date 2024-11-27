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
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF).');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            userImage.src = e.target.result;
            userImage.onload = function() {
                fitImageToCanvas();
                drawImages();
            };
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert('No file selected. Please choose an image file.');
    }
});

// Function to fit the image to the canvas
function fitImageToCanvas() {
    const canvasAspectRatio = canvas.width / canvas.height;
    const imageAspectRatio = userImage.width / userImage.height;

    if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas
        scale = canvas.width / userImage.width; // Scale by width
        imageX = 0; // Center horizontally
        imageY = (canvas.height - (userImage.height * scale)) / 2; // Center vertically
    } else {
        // Image is taller than canvas
        scale = canvas.height / userImage.height; // Scale by height
        imageX = (canvas.width - (userImage.width * scale)) / 2; // Center horizontally
        imageY = 0; // Center vertically
    }
}

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
    canvas.style.cursor = 'grabbing'; // Change cursor to grabbing
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.style.cursor = 'grab'; // Change cursor back to grab
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Smooth dragging
        const dx = e.offsetX - startX;
        const dy = e.offsetY - startY;
        imageX += dx;
        imageY += dy;
        startX = e.offsetX; // Update start positions for smooth dragging
        startY = e.offsetY;
        drawImages();
    }
});

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - imageX;
        startY = e.touches[0].clientY - imageY;
        canvas.style.cursor = 'grabbing'; // Change cursor to grabbing
    } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.t ouches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        scale = Math.max(0.1, Math.min(distance / 100, 3)); // Limit scale between 0.1 and 3
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        imageX = e.touches[0].clientX - startX;
        imageY = e.touches[0].clientY - startY;
        drawImages();
    }
});

// Zoom functionality
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    scale += e.deltaY > 0 ? -zoomFactor : zoomFactor;
    scale = Math.max(0.1, Math.min(scale, 3)); // Limit scale between 0.1 and 3
    drawImages();
});

// Download functionality
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Redraw images when the window is resized
window.addEventListener('resize', () => {
    canvas.width = maskImage.width;
    canvas.height = maskImage.height;
    drawImages();
});
