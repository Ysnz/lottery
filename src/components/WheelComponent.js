import React, { useEffect, useState, useRef } from "react";
import "./WheelComponent.css";

const WheelComponent = ({
    segments,
    segColors,
    winningSegment,
    onFinished,
    onRotate,
    onRotatefinish,
    primaryColor,
    primaryColoraround,
    contrastColor,
    buttonText,
    isOnlyOnce = true,
    size = 290,
    upDuration = 1000,
    downDuration = 100,
    fontFamily = "proxima-nova",
    width = 100,
    height = 100
}) => {
    const canvasRef = useRef(null);
    const [isFinished, setFinished] = useState(false);
    const [currentSegment, setCurrentSegment] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [showSpinBtn, setShowSpinBtn] = useState(true);
    const [winner, setWinner] = useState(null);

    let timerHandle = 0;
    let angleCurrent = 0;
    let angleDelta = 0;
    let canvasContext = null;
    let maxSpeed = Math.PI / segments.length;
    const upTime = segments.length * upDuration;
    const downTime = segments.length * downDuration;
    let spinStart = 0;
    let frames = 0;
    const centerX = 300;
    const centerY = 300;
    const timerDelay = segments.length;

    useEffect(() => {
        wheelInit();
        setShowSpinBtn(true);
        setFinished(false);
        setWinner(null);
        setIsStarted(false);
        return () => {
            if (timerHandle) {
                clearInterval(timerHandle);
            }
        };
    }, [segments]);

    const wheelInit = () => {
        initCanvas();
        wheelDraw();
    };

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (navigator.appVersion.indexOf("MSIE") !== -1) {
            const newCanvas = document.createElement("canvas");
            newCanvas.setAttribute("width", width);
            newCanvas.setAttribute("height", height);
            newCanvas.setAttribute("id", "canvas");
            document.getElementById("wheel").appendChild(newCanvas);
        }
        canvasContext = canvas.getContext("2d");
    };

    const spin = () => {
        if (isFinished && isOnlyOnce) return;
        setIsStarted(true);
        setShowSpinBtn(false);
        if (timerHandle === 0) {
            spinStart = new Date().getTime();
            maxSpeed = Math.PI / segments.length;
            frames = 0;
            timerHandle = setInterval(onTimerTick, timerDelay);
        }
    };

    const onTimerTick = () => {
        frames++;
        draw();
        const duration = new Date().getTime() - spinStart;
        let progress = 0;
        let finished = false;

        if (duration < upTime) {
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            if (winningSegment) {
                if (currentSegment === winningSegment && frames > segments.length) {
                    progress = duration / upTime;
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                    progress = 1;
                } else {
                    progress = duration / downTime;
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                }
            } else {
                progress = duration / downTime;
                if (progress >= 0.8) {
                    angleDelta = maxSpeed / 1.2 * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                } else if (progress >= 0.98) {
                    angleDelta = maxSpeed / 2 * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                } else {
                    angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
                }
            }
            if (progress >= 1) finished = true;
        }

        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;

        if (finished) {
            setFinished(true);
            setWinner(currentSegment);
            if (onFinished) onFinished(currentSegment);
            clearInterval(timerHandle);
            timerHandle = 0;
            angleDelta = 0;
        }
    };

    const wheelDraw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const draw = () => {
        if (!canvasContext) return;
        clear();
        drawWheel();
        drawNeedle();
    };

    const drawSegment = (key, lastAngle, angle) => {
        const ctx = canvasContext;
        const value = segments[key];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = segColors[key];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = contrastColor || "white";
        ctx.font = "bold 1em " + fontFamily;
        ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
        ctx.restore();
    };

    const drawWheel = () => {
        const ctx = canvasContext;
        let lastAngle = angleCurrent;
        const len = segments.length;
        const PI2 = Math.PI * 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor || "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "1em " + fontFamily;
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 40, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = primaryColor || "black";
        ctx.lineWidth = 5;
        ctx.strokeStyle = contrastColor || "white";
        ctx.fill();
        ctx.font = "bold 2em " + fontFamily;
        ctx.fillStyle = contrastColor || "white";
        ctx.textAlign = "center";
        ctx.fillText(buttonText || "Spin", centerX, centerY + 3);
        ctx.stroke();
        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();
        ctx.lineWidth = 25;
        ctx.strokeStyle = primaryColoraround || "white";
        ctx.stroke();
    };

    const drawNeedle = () => {
        const ctx = canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = contrastColor || "white";
        ctx.fillStyle = contrastColor || "white";
        ctx.beginPath();
        ctx.moveTo(centerX + 10, centerY - 40);
        ctx.lineTo(centerX - 10, centerY - 40);
        ctx.lineTo(centerX, centerY - 60);
        ctx.closePath();
        ctx.fill();
        const change = angleCurrent + Math.PI / 2;
        let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
        if (i < 0) i = i + segments.length;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "transparent";
        ctx.font = "bold 1.5em " + fontFamily;
        const newCurrentSegment = segments[i];
        setCurrentSegment(newCurrentSegment);
        if (isStarted) {
            ctx.fillText(newCurrentSegment, centerX + 10, centerY + size + 50);
        }
    };

    const clear = () => {
        if (!canvasContext) return;
        canvasContext.clearRect(0, 0, 1000, 800);
    };

    return (
        <div id="wheel" className="wheel-container" style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                id="canvas"
                width="600"
                height="600"
                style={{
                    pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
                    cursor: isFinished && isOnlyOnce ? "not-allowed" : "pointer"
                }}
            />
            {showSpinBtn && (
                <button
                    className="wheel-spin-center-btn"
                    onClick={spin}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: '#13a3b3',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '2rem',
                        border: 'none',
                        boxShadow: '0 4px 24px rgba(19,163,179,0.13)',
                        zIndex: 10,
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.18s, box-shadow 0.18s'
                    }}
                >
                    SPIN
                </button>
            )}
        </div>
    );
};

export default WheelComponent; 