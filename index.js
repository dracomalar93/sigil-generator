let img = new Image(); // Declare the image globally so we don't reload it each time
let letterCoordinates = []; // Store coordinates of detected letters
let canvasWidth, canvasHeight; // Store canvas dimensions


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

const letterGroups = [
    ['K', 'Q'],                // Group 1: Same coordinates (372, 190)
    ['TZ'],                    // Group 2: (417, 237)
    ['N'],                     // Group 3: (378, 410)
    ['Y', 'I', 'J'],           // Group 4: (241, 407)
    ['CH'],                    // Group 5: (180, 298)
    ['V', 'O', 'U'],           // Group 6: (248, 182)
    ['KH'],                    // Group 7: (345, 216)
    ['G', 'GH'],               // Group 8: (372, 361)
    ['R', 'RH'],               // Group 9: (221, 281)
    ['P', 'PH', 'F'],          // Group 10: (268, 219)
    ['M'],                     // Group 11: (263, 329)
    ['A'],                     // Group 12: (435, 300)
    ['S'],                     // Group 13: (419, 366)
    ['T', 'TH'],               // Group 14: (392, 280)
    ['Z'],                     // Group 15: (201, 232)
    ['H'],                     // Group 16: (306, 173)
    ['D', 'DH'],               // Group 17: (305, 389)
    ['B'],                     // Group 18: (240, 358)
    ['E'],                     // Group 19: (307, 245)
    ['SH'],                    // Group 20: (353, 329)
    ['L'],                     // Group 21: (307, 430)
];

let coordinatesDisplay = document.getElementById('coordinatesDisplay'); // Display element for showing hovered letter

// Load the image as a background on page load
window.onload = function() {
    const canvas = document.getElementById('sigilCanvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = function() {
        console.log("Image loaded successfully!");

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
    const combinations = ['CH', 'PH', 'TH', 'RH', 'SH', 'KH', 'GH', 'DH', 'TZ']; // Two-letter combinations
    let uniqueSymbols = []; // Store final unique symbols
    let usedGroups = new Set(); // Track groups that have already contributed

    // Clean the input: remove punctuation and convert to uppercase
    let cleanedInput = text.toUpperCase().replace(/[^A-Z]/g, '');

    let i = 0;
    while (i < cleanedInput.length) {
        // Check for combinations first
        if (i < cleanedInput.length - 1) {
            let pair = cleanedInput[i] + cleanedInput[i + 1];
            if (combinations.includes(pair)) {
                let groupIndex = findGroup(pair, letterGroups); // Find group for the pair
                if (groupIndex !== -1 && !usedGroups.has(groupIndex)) {
                    uniqueSymbols.push(pair);
                    usedGroups.add(groupIndex);
                }
                i += 2; // Skip the second letter of the pair
                continue;
            }
        }

        // Handle single letters
        let letter = cleanedInput[i];

        // Substitutions for certain letters
        if (letter === 'C') letter = 'K';
        else if (letter === 'W') letter = 'U';
        else if (letter === 'X') {
            if (!uniqueSymbols.includes('K')) {
                let groupIndex = findGroup('K', letterGroups);
                if (groupIndex !== -1 && !usedGroups.has(groupIndex)) {
                    uniqueSymbols.push('K');
                    usedGroups.add(groupIndex);
                }
            }
            letter = 'S';
        }

        let groupIndex = findGroup(letter, letterGroups);
        if (groupIndex !== -1 && !usedGroups.has(groupIndex)) {
            uniqueSymbols.push(letter);
            usedGroups.add(groupIndex); // Mark group as used
        }

        i++;
    }

    return uniqueSymbols;
}

// Helper function to find the group index of a letter or combination
function findGroup(symbol, groups) {
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].includes(symbol)) {
            return i; // Return the group index
        }
    }
    return -1; // Not found
}


// Helper function to find the group index of a letter or combination
function findGroup(symbol, groups) {
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].includes(symbol)) {
            return i; // Return the group index
        }
    }
    return -1; // Not found
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
    let secondLastX, secondLastY; // For the perpendicular line

    symbols.forEach((symbol, index) => {
        const detectedCoords = letterMap[symbol];

        if (detectedCoords) {
            const scaledCoords = scaleCoordinates(
                detectedCoords,
                img.width,
                img.height,
                ctx.canvas.width,
                ctx.canvas.height
            );

            if (index === 0) {
                // Draw the starting red circle
                ctx.beginPath();
                ctx.arc(scaledCoords.x, scaledCoords.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'red';
                ctx.fill();
            } else {
                // Draw the connecting line
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(scaledCoords.x, scaledCoords.y);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            secondLastX = lastX;
            secondLastY = lastY;
            lastX = scaledCoords.x;
            lastY = scaledCoords.y;
        }
    });

    // Draw perpendicular line at the last point
    if (lastX !== undefined && lastY !== undefined && secondLastX !== undefined && secondLastY !== undefined) {
        const angle = Math.atan2(lastY - secondLastY, lastX - secondLastX);
        const perpendicularLength = 10; // Length of the perpendicular line

        // Calculate the endpoints of the perpendicular line
        const perpendicularX1 = lastX + perpendicularLength * Math.cos(angle + Math.PI / 2);
        const perpendicularY1 = lastY + perpendicularLength * Math.sin(angle + Math.PI / 2);
        const perpendicularX2 = lastX - perpendicularLength * Math.cos(angle + Math.PI / 2);
        const perpendicularY2 = lastY - perpendicularLength * Math.sin(angle + Math.PI / 2);

        // Ensure the perpendicular line stays within canvas boundaries
        const boundedX1 = Math.max(0, Math.min(ctx.canvas.width, perpendicularX1));
        const boundedY1 = Math.max(0, Math.min(ctx.canvas.height, perpendicularY1));
        const boundedX2 = Math.max(0, Math.min(ctx.canvas.width, perpendicularX2));
        const boundedY2 = Math.max(0, Math.min(ctx.canvas.height, perpendicularY2));

        // Draw the perpendicular line
        ctx.beginPath();
        ctx.moveTo(boundedX1, boundedY1);
        ctx.lineTo(boundedX2, boundedY2);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
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

function downloadSigil() {
    const mainCanvas = document.getElementById('sigilCanvas');
    const sigilSymbols = processText(document.getElementById('inputText').value);

    // Create an off-screen canvas
    const offScreenCanvas = document.createElement('canvas');
    const ctx = offScreenCanvas.getContext('2d');

    // Match the size of the main canvas
    offScreenCanvas.width = mainCanvas.width;
    offScreenCanvas.height = mainCanvas.height;

    // Draw the sigil on the off-screen canvas
    drawSigil(sigilSymbols, ctx);

    // Download the sigil as a PNG
    const link = document.createElement('a');
    link.download = 'sigil_only.png';
    link.href = offScreenCanvas.toDataURL('image/png');
    link.click();
}