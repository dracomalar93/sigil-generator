let img = new Image(); // Declare the image globally so we don't reload it each time
let letterCoordinates = []; // Store coordinates of detected letters
let canvasWidth, canvasHeight; // Store canvas dimensions
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200); // Resize after 200ms delay
});


// Manually defined coordinates for letters (example)
const letterMap = {
    'K': { x: 372, y: 190 },
    'Q': { x: 372, y: 190 },
    'TZ': { x: 417, y: 237 },
    'N': { x: 378, y: 410 },
    'Y': { x: 241, y: 407 },
    'I': { x: 241, y: 407 },
    'J': { x: 241, y: 407 },
    'CH': { x: 180, y: 298 },
    'V': { x: 248, y: 182 }, 
    'O': { x: 248, y: 182 }, 
    'U': { x: 248, y: 182 },
    'KH': { x: 345, y: 216 },
    'G': { x: 372, y: 361 },
    'GH': { x: 372, y: 361 },
    'R': { x: 221, y: 281 },
    'RH': { x: 221, y: 281 },
    'P': { x: 268, y: 219 },
    'PH': { x: 268, y: 219 },
    'F': { x: 268, y: 219 },
    'M': { x: 263, y: 329 },
    'A': { x: 435, y: 300 },
    'S': { x: 419, y: 366 },
    'T': { x: 392, y: 280 },
    'TH': { x: 392, y: 280 },
    'Z': { x: 201, y: 232 },
    'H': { x: 306, y: 173 },
    'D': { x: 305, y: 389 },
    'DH': { x: 305, y: 389 },
    'B': { x: 240, y: 358 },
    'E': { x: 307, y: 245 },
    'SH': { x: 353, y: 329 },
    'L': { x: 307, y: 430 },
    'E': { x: 307, y: 245 },
};


let coordinatesDisplay = document.getElementById('coordinatesDisplay'); // Display element for showing hovered letter

// Load the image as a background on page load
window.onload = function() {
    const canvas = document.getElementById('sigilCanvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = function() {
        console.log("Image loaded successfully!");
        
        // Resize and redraw the canvas when the image is loaded
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas); // Adjust canvas size on window resize
        window.onload = resizeCanvas; // Set canvas size on page load


        // Store canvas dimensions
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        // Resize canvas to fit the image size (or keep it at fixed dimensions)
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);
    };

    img.onerror = function() {
        console.error("Error: Image failed to load.");
    };

    img.src = 'Rosy Cross.png';  // Update this path if necessary to the PNG file

    const canvasRect = canvas.getBoundingClientRect(); // Get the canvas position relative to the viewport

    // Add the mouse move event listener to track coordinates on hover and display the hovered letter
    canvas.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX - canvasRect.left; // Calculate mouse X position relative to canvas
        const mouseY = e.clientY - canvasRect.top; // Calculate mouse Y position relative to canvas

        // Get the hovered letter at the mouse position
        const hoveredLetter = getHoveredLetter(mouseX, mouseY);
        
        // Display the coordinates and the hovered letter on the page
        if (coordinatesDisplay) {
            coordinatesDisplay.textContent = `Mouse Coordinates: x=${mouseX}, y=${mouseY} - Hovered Letter: ${hoveredLetter}`;
        }
    });
};

// Function to generate the sigil when the button is clicked
function generateSigil() {
    const inputText = document.getElementById('inputText').value;
    const sigilSymbols = processText(inputText);

    const canvas = document.getElementById('sigilCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the entire canvas to avoid drawing over previous sigils
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image first, ensuring it is on the bottom layer
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // After the image, draw the sigil lines on top
    drawSigil(sigilSymbols, ctx);
}

// Process the input text by removing duplicates and handling combinations
function processText(text) {
    const combinations = ['CH', 'PH', 'TH', 'RH', 'SH', 'KH', 'GH', 'DH', 'TZ']; // Include TZ in combinations
    let uniqueSymbols = [];
    let input = text.toUpperCase();

    // Loop through the input text to check for combinations and handle duplicates
    for (let i = 0; i < input.length; i++) {
        // Check if the next two letters form a combination
        let pair = input[i] + (input[i + 1] || ''); // Handle edge cases where there's no next letter

        if (combinations.includes(pair)) {
            // Add the combination if it's not already in the list
            if (!uniqueSymbols.includes(pair)) {
                uniqueSymbols.push(pair);
            }
            i++; // Skip the next letter since it's part of the combination
        } else {
            // Process single letters
            let letter = input[i];

            // Handle substitutions
            if (letter === 'C') {
                letter = 'K'; // Substitute C for K
            } else if (letter === 'W') {
                letter = 'U'; // Substitute W for U
            } else if (letter === 'X') {
                if (!uniqueSymbols.includes('K')) {
                    uniqueSymbols.push('K'); // Add K first
                }
                letter = 'S'; // Treat X as S next
            }

            // Add the letter if it hasn't been added yet
            if (!uniqueSymbols.includes(letter)) {
                uniqueSymbols.push(letter);
            }
        }
    }

    return uniqueSymbols;
}

function scaleCoordinates(coords, imgWidth, imgHeight, canvasWidth, canvasHeight) {
    // Map coordinates to match the actual canvas size
    const offsetX = 158; // X offset for the top-left corner
    const offsetY = 149; // Y offset for the top-left corner
    const pictureWidth = 459 - 158; // Effective width of the picture
    const pictureHeight = 459 - 149; // Effective height of the picture

    const scaleX = canvasWidth / pictureWidth;
    const scaleY = canvasHeight / pictureHeight;

    return {
        x: (coords.x - offsetX) * scaleX,
        y: (coords.y - offsetY) * scaleY
    };
}

// Key: Removed unnecessary coordinate-related code
// Functionality: Lines are thicker and red; black circles at each point; Enter key triggers sigil generation

// Updated drawSigil function
// Key: Removed unnecessary coordinate-related code
// Functionality: Lines are thicker and red; black circles at each point; Enter key triggers sigil generation

// Updated drawSigil function
function drawSigil(symbols, ctx) {
    let lastX, lastY;

    const canvas = document.getElementById('sigilCanvas');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width; // Original image width
    const imgHeight = img.height; // Original image height

    symbols.forEach((symbol, index) => {
        const detectedCoords = letterMap[symbol];

        if (detectedCoords) {
            const scaledCoords = scaleCoordinates(detectedCoords, imgWidth, imgHeight, canvasWidth, canvasHeight);

            if (!isValidCoordinate(scaledCoords, canvasWidth, canvasHeight)) {
                console.warn(`Skipping invalid coordinate for symbol "${symbol}":`, scaledCoords);
                return; // Skip this coordinate if it's invalid
            }

            // Draw black circle at the current point
            ctx.beginPath();
            ctx.arc(scaledCoords.x, scaledCoords.y, 5, 0, Math.PI * 2); // Circle radius = 5
            ctx.fillStyle = 'black';
            ctx.fill();

            if (index > 0) {
                // Draw the line connecting the last point to the current point
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(scaledCoords.x, scaledCoords.y);
                ctx.strokeStyle = 'red'; // Line color = red
                ctx.lineWidth = 3; // Thicker line
                ctx.stroke();
            }

            lastX = scaledCoords.x;
            lastY = scaledCoords.y;
        } else {
            console.warn(`No coordinates found for symbol "${symbol}"`);
        }
    });
}

// Event listener for Enter key
document.getElementById('inputText').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default behavior of Enter key (like form submission)
        generateSigil();
    }
});

// Function to validate coordinates
function isValidCoordinate(coord, canvasWidth, canvasHeight) {
    return coord.x >= 0 && coord.x <= canvasWidth && coord.y >= 0 && coord.y <= canvasHeight;
}


// Event listener for Enter key
document.getElementById('inputText').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default behavior of Enter key (like form submission)
        generateSigil();
    }
});

// Function to validate coordinates
function isValidCoordinate(coord, canvasWidth, canvasHeight) {
    return coord.x >= 0 && coord.x <= canvasWidth && coord.y >= 0 && coord.y <= canvasHeight;
}


// Function to get the letter at the hovered coordinates
function getHoveredLetter(x, y) {
    for (let letter in letterMap) {
        const coords = letterMap[letter];

        // Check if the mouse is within a small threshold of the letter's coordinates
        if (Math.abs(x - coords.x) < 20 && Math.abs(y - coords.y) < 20) {
            return letter;
        }
    }
    return ''; // Return empty string if no letter is found
}

// Add the mouse move event listener to track coordinates on hover and display the hovered letter
const canvas = document.getElementById('sigilCanvas');
coordinatesDisplay = document.getElementById('coordinatesDisplay');

canvas.addEventListener('mousemove', function(e) {
    const canvasRect = canvas.getBoundingClientRect(); // Get canvas bounding rectangle
    const mouseX = e.clientX - canvasRect.left; // Calculate mouse X position relative to canvas
    const mouseY = e.clientY - canvasRect.top; // Calculate mouse Y position relative to canvas

    // Get the hovered letter at the mouse position
    const hoveredLetter = getHoveredLetter(mouseX, mouseY);
    
    // Display the coordinates and the hovered letter on the page
    if (coordinatesDisplay) {
        coordinatesDisplay.textContent = `Mouse Coordinates: x=${mouseX}, y=${mouseY} - Hovered Letter: ${hoveredLetter}`;
    }
});



// Function to get the letter at the hovered coordinates
function getHoveredLetter(x, y) {
    for (let letter in letterMap) {
        const coords = letterMap[letter];

        // Check if the mouse is within a small threshold of the letter's coordinates
        if (Math.abs(x - coords.x) < 20 && Math.abs(y - coords.y) < 20) {
            return letter;
        }
    }
    return ''; // Return empty string if no letter is found
}

canvas.addEventListener('touchmove', function(e) {
    const touch = e.touches[0]; // Get the first touch point
    const canvasRect = canvas.getBoundingClientRect(); // Get canvas position

    const touchX = touch.clientX - canvasRect.left; // X coordinate
    const touchY = touch.clientY - canvasRect.top; // Y coordinate

    // Use the coordinates (touchX, touchY) as needed
    const hoveredLetter = getHoveredLetter(touchX, touchY);
    if (coordinatesDisplay) {
        coordinatesDisplay.textContent = `Touch Coordinates: x=${touchX}, y=${touchY} - Hovered Letter: ${hoveredLetter}`;
    }
});

// Function to resize the canvas dynamically
function resizeCanvas() {
    const canvas = document.getElementById('sigilCanvas');
    const ctx = canvas.getContext('2d');

    const aspectRatio = img.width / img.height; // Calculate the aspect ratio

    // Calculate the new dimensions for the canvas
    let canvasWidth = window.innerWidth * 0.9; // Allow some margin
    let canvasHeight = canvasWidth / aspectRatio;

    // Adjust dimensions if height exceeds the viewport height
    if (canvasHeight > window.innerHeight * 0.9) {
        canvasHeight = window.innerHeight * 0.9;
        canvasWidth = canvasHeight * aspectRatio;
    }

    // Set the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Redraw the image to fit the new canvas size
    if (img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
    }
}

// Load the image and initialize the canvas
img.onload = function () {
    console.log("Image loaded successfully!");
    resizeCanvas(); // Resize the canvas when the image is loaded
};

img.src = 'Rosy Cross.png'; // Replace with the correct image path

// Attach event listeners for resizing
window.addEventListener('resize', resizeCanvas);
window.onload = resizeCanvas;