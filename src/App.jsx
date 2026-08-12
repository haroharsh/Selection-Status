import { useState, useEffect, useRef } from 'react';

const renderCaptcha = (canvas, code) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#ede6d0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const lineColors = ["#b3b3b3", "#d3c3a3", "#a89980", "#c4bca2"];
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const fonts = [
    "bold 32px 'Arvo'", 
    "bold 34px 'Courier New'", 
    "bold 36px 'Georgia'", 
    "bold 35px 'Times New Roman'", 
    "bold 33px serif"
  ];
  const charColors = ["#8b0000", "#111111", "#e51b24", "#3a3a3a", "#5a0003", "#7a1a1d"];
  
  const startX = 35;
  const spacing = 48;

  for (let i = 0; i < code.length; i++) {
    const char = code.charAt(i);
    ctx.font = fonts[Math.floor(Math.random() * fonts.length)];
    ctx.fillStyle = charColors[Math.floor(Math.random() * charColors.length)];
    
    ctx.save();
    
    const x = startX + i * spacing + (Math.random() * 8 - 4);
    const y = canvas.height / 2 + 10 + (Math.random() * 10 - 5);
    const angle = (Math.random() * 40 - 20) * Math.PI / 180;
    
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 0, -5);
    
    ctx.restore();
  }

  const fgColors = ["#e51b24", "#8b0000", "#111111", "#444444"];
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = fgColors[Math.floor(Math.random() * fgColors.length)];
    ctx.lineWidth = Math.random() * 1.5 + 1.2;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * canvas.height);
    ctx.bezierCurveTo(
      canvas.width * 0.25, Math.random() * canvas.height,
      canvas.width * 0.75, Math.random() * canvas.height,
      canvas.width, Math.random() * canvas.height
    );
    ctx.stroke();
  }
};

const generateCaptchaText = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 5; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
};

export default function App() {
  const [step, setStep] = useState('signin');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  const [statusMessage, setStatusMessage] = useState(null);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    if (step === 'captcha' && canvasRef.current) {
      renderCaptcha(canvasRef.current, captchaCode);
    }
  }, [step, captchaCode]);

  const handleCheckResult = async (e) => {
    e.preventDefault();
    const trimmed = enrollmentNo.trim();

    if (!trimmed) {
      setStatusMessage({ text: "Please enter your enrollment number", type: "error" });
      return;
    }

    if (trimmed.length !== 9 || !/^[0-9]+$/.test(trimmed)) {
      setStatusMessage({ text: "Please enter a valid 9-digit enrollment number", type: "error" });
      return;
    }

    if (!trimmed.startsWith('24') && !trimmed.startsWith('25')) {
      setStatusMessage({ text: "Incorrect enrollment. Please try again!", type: "error" });
      return;
    }

    try {
      const response = await fetch('/students.json');
      const data = await response.json();
      const selected = data.selectedStudents.includes(trimmed);
      
      setIsSelected(selected);
      setCaptchaCode(generateCaptchaText());
      setCaptchaInput('');
      setStatusMessage(null);
      setStep('captcha');
    } catch (error) {
      setStatusMessage({ text: "Error checking selection status", type: "error" });
    }
  };

  const handleVerifyCaptcha = (e) => {
    e.preventDefault();
    const userInput = captchaInput.trim().toUpperCase();

    if (!userInput) {
      setStatusMessage({ text: "Please enter the captcha code", type: "error" });
      return;
    }

    if (userInput === captchaCode) {
      setStatusMessage({ text: "✅ Captcha verified! Access Granted.", type: "success" });
      
      setTimeout(() => {
        setStatusMessage(null);
        setStep('result');
      }, 1200);
    } else {
      setStatusMessage({ text: "❌ Incorrect captcha code. Try again!", type: "error" });
      setCaptchaInput('');
      setCaptchaCode(generateCaptchaText());
    }
  };

  const handleGoHome = () => {
    setEnrollmentNo('');
    setIsSelected(false);
    setCaptchaInput('');
    setCaptchaCode('');
    setStatusMessage(null);
    setStep('signin');
  };

  const getHeaderTitle = () => {
    if (step === 'signin') return "Recruitment 2026";
    if (step === 'captcha') return "Verification";
    return "Result 2026";
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col overflow-hidden">
      <img src="/rdr2_bg.png" className="bg-image" alt="RDR2 Background" />

      <div className="logo-container">
        <a href="https://siamjuit.vercel.app" target="_blank" rel="noopener noreferrer">
          <img src="/siam_logo-removebg-preview.webp" className="logo-img" alt="SIAM Logo" />
        </a>
      </div>

      <a 
        href="https://github.com/haroharsh/Selection-Status" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-6 right-6 z-[100] opacity-85 hover:opacity-100 hover:scale-108 transition-all duration-300"
      >
        <img 
          src="/ghSym.webp" 
          className="w-11 h-auto drop-shadow-[0_0_6px_rgba(0,0,0,0.9)] invert-[0.15] sepia-[0.8] hue-rotate-[-50deg] saturate-[3] brightness-[0.9]" 
          alt="GitHub" 
        />
      </a>

      <header className="top-header">
        <h1 className="heading">{getHeaderTitle()}</h1>
      </header>

      <main className="main-content">
        {step === 'signin' && (
          <div className="login hud-line fade-in">
            <h2>Selection Status</h2>
            <p className="catchLine">
              To check your selection status, Enter your enrollment number
            </p>
            
            <form onSubmit={handleCheckResult}>
              <div className="inputBox">
                <input 
                  type="text" 
                  placeholder="Enrollment No." 
                  value={enrollmentNo} 
                  onChange={(e) => setEnrollmentNo(e.target.value)}
                  maxLength={9}
                  autoComplete="off"
                />
              </div>
              <button type="submit" id="btn">
                Check Result
              </button>
            </form>

            {statusMessage && (
              <div className={`message ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}
          </div>
        )}

        {step === 'captcha' && (
          <div className="login captcha-card hud-line fade-in">
            <h2>Security Check</h2>
            <p className="catchLine">
              Enter the distorted characters below to prove you are human
            </p>

            <div id="captchaBox" className="captcha-canvas-container">
              <canvas 
                ref={canvasRef} 
                width={300} 
                height={90} 
              />
            </div>

            <form onSubmit={handleVerifyCaptcha}>
              <div className="inputBox">
                <input 
                  type="text" 
                  placeholder="Enter Captcha Code" 
                  value={captchaInput} 
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="btn-group">
                <button type="submit">Verify</button>
                <button 
                  type="button" 
                  id="clearBtn"
                  onClick={() => {
                    setCaptchaInput('');
                    setStatusMessage(null);
                    setCaptchaCode(generateCaptchaText());
                  }}
                >
                  Refresh
                </button>
              </div>
            </form>

            {statusMessage && (
              <div className={`message ${statusMessage.type}`}>
                {statusMessage.text}
              </div>
            )}
          </div>
        )}

        {step === 'result' && (
          <div className="login hud-line fade-in w-[460px]">
            <h2>Recruitment Result</h2>
            
            <div className="flex flex-col items-center justify-center w-full mt-4">
              {isSelected ? (
                <div className="w-full p-[22px] border border-[#27ae60] bg-[#27ae60]/15 text-[#2ecc71] font-bold text-center leading-[1.6] mb-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]">
                  CONGRATULATIONS! <br /> Enrollment No: {enrollmentNo} - You have been selected for SIAM!
                </div>
              ) : (
                <div className="w-full p-[22px] border border-rdr-red bg-rdr-red/15 text-[#ff4d4d] font-bold text-center leading-[1.6] mb-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]">
                  SORRY! <br /> Enrollment No: {enrollmentNo} - You have not been selected this time.
                  <br /><br />Keep trying and best of luck for next time!
                </div>
              )}
              
              <button className="home-btn" onClick={handleGoHome}>
                Go Home
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="rdr-footer">
        Created by <a href="https://github.com/JainSahab45" target="_blank" rel="noopener noreferrer">Tanish Jain(241034011)</a>
      </footer>
      
    </div>
  );
}
