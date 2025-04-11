const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
    // Match canvas resolution exactly to the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: { ideal: "environment" },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // for iOS
        video.play();
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function draw() {
    if (video.readyState >= 2) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasAspect = canvas.width / canvas.height;
        const videoAspect = video.videoWidth / video.videoHeight;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (videoAspect > canvasAspect) {
            // Video is wider than canvas
            drawHeight = canvas.height;
            drawWidth = video.videoWidth * (canvas.height / video.videoHeight);
            offsetX = (canvas.width - drawWidth) / 2;
        } else {
            // Video is taller than canvas
            drawWidth = canvas.width;
            drawHeight = video.videoHeight * (canvas.width / video.videoWidth);
            offsetY = (canvas.height - drawHeight) / 2;
        }

        // Draw video to fill canvas area
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        // Apply red filter to top half
        context.fillStyle = "rgba(255, 0, 0, 0.25)";
        context.fillRect(0, 0, canvas.width, canvas.height / 2);

        // Apply blue filter to bottom half
        context.fillStyle = "rgba(0, 200, 255, 0.25)";
        context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    }

    requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});

video.addEventListener("play", draw);

document.addEventListener("DOMContentLoaded", () => {
    startCamera();

    const eye = document.getElementById("eye");
    eye.addEventListener("click", () => {
        window.open("https://meg-james-design.com", "_blank");
    });
});
