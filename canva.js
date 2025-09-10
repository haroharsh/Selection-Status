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

    // Mouse + touch support
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchmove", (e) => {
      draw(e.touches[0]);
      e.preventDefault();
    });

    document.getElementById("clearBtn")?.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alreadyDrawn = false;
      document.getElementById("result").innerHTML = "";
    });

    const overlayImg = document.getElementById("overlay");
    const toggleOverlayBtn = document.getElementById("toggleOverlayBtn");

    toggleOverlayBtn?.addEventListener("click", () => {
      if (overlayImg.style.display === "none") {
        overlayImg.style.display = "block";
        toggleOverlayBtn.textContent = "Hide Overlay";
      } else {
        overlayImg.style.display = "none";
        toggleOverlayBtn.textContent = "Show Overlay";
      }
    });

    document.getElementById("checkBtn")?.addEventListener("click", () => {
      const phoenix = new Image();
      phoenix.src = 'src/phoenix.png';

      phoenix.onload = () => {
        const hiddenCanvas = document.createElement("canvas");
        hiddenCanvas.width = canvas.width;
        hiddenCanvas.height = canvas.height;
        const hctx = hiddenCanvas.getContext("2d");

        hctx.drawImage(phoenix, 0, 0, canvas.width, canvas.height);

        const userData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const refData = hctx.getImageData(0, 0, canvas.width, canvas.height).data;

        const tolerance = 5;
        const width = canvas.width;

        let matchCount = 0, totalCount = 0;

        function isUserNearbyDrawn(i) {
          const x = (i / 4) % width;
          const y = Math.floor((i / 4) / width);

          for (let dy = -tolerance; dy <= tolerance; dy++) {
            for (let dx = -tolerance; dx <= tolerance; dx++) {
              const nx = x + dx;
              const ny = y + dy;

              if (nx < 0 || ny < 0 || nx >= width || ny >= canvas.height) continue;

              const ni = (ny * width + nx) * 4;
              if (userData[ni + 3] > 0) return true;
            }
          }
          return false;
        }

        for (let i = 0; i < refData.length; i += 4) {
          const phoenixPixel = refData[i + 3] > 0;

          if (phoenixPixel) {
            totalCount++;
            if (isUserNearbyDrawn(i)) matchCount++;
          }
        }

        const similarity = (matchCount / totalCount) * 100;
        const result = document.getElementById("result");

        if (similarity > 50) {
          result.innerHTML = `<p style="color:green">✅ Looks like a Phoenix!</p>`;
          setTimeout(() => {
            alert('Congrats! You are selected')
          }, 1000);
        } else {
          result.innerHTML = `<p style="color:red">❌ Not close enough. Try again!</p>`;
        }
      };
    });