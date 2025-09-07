const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

let drawing = false;
let alreadyDrawn = false;

function startDrawing(e) {
  if (alreadyDrawn) return;
  drawing = true;
  draw(e);
}

function stopDrawing() {
  if (!drawing) return;
  drawing = false;
  alreadyDrawn = true;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing || alreadyDrawn) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// mouse + touch events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", (e) => {
  draw(e.touches[0]);
  e.preventDefault();
});

// reset button
document.getElementById("clearBtn")?.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  alreadyDrawn = false;
});

// compare with phoenix
document.getElementById("checkBtn")?.addEventListener("click", () => {
  const phoenix = new Image();
  phoenix.src = "src/phoenix.png"; // silhouette image

  phoenix.onload = () => {
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;
    const hctx = hiddenCanvas.getContext("2d");

    hctx.drawImage(phoenix, 0, 0, canvas.width, canvas.height);

    const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const refData = hctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let matchCount = 0, totalCount = 0;

    for (let i = 0; i < userData.length; i += 4) {
      const userDrawn = userData[i + 3] > 0; // alpha > 0 → drawn pixel
      const phoenixPixel = refData[i + 3] > 0; // silhouette pixel

      if (phoenixPixel) {
        totalCount++;
        if (userDrawn) matchCount++;
      }
    }

    const similarity = (matchCount / totalCount) * 100;
    const result = document.getElementById("result");

    if (similarity > 30) {
      result.innerHTML = `<p style="color:green">✅ Looks like a Phoenix! Redirecting...</p>`;

      // redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      result.innerHTML = `<p style="color:red">❌ Not close enough. Try again!</p>`;
    }
  };
});

