import React, { useEffect, useState, useRef } from "react";
import "./WheelComponent.css";

const WheelComponent = ({
    segments,
    segColors,
    winningSegment,
    onFinished,
    primaryColor,
    primaryColoraround,
    contrastColor,
    buttonText,
    isOnlyOnce = true,
    size = 290,
    upDuration = 500,
    downDuration = 4000,
    fontFamily = "proxima-nova"
}) => {
    const canvasRef = useRef(null);
    const [isFinished, setFinished] = useState(false);
    let angleCurrent = useRef(0);
    let spinHandle = useRef(null);
    let canvasContext = null;

    useEffect(() => {
        wheelInit();
        const timeout = setTimeout(() => {
            spin();
        }, 500);
        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(spinHandle.current);
        };
    }, [segments, winningSegment]);

    const wheelInit = () => {
        initCanvas();
        wheelDraw();
    };

    const initCanvas = () => {
        if (!canvasRef.current) return;
        canvasContext = canvasRef.current.getContext("2d");
    };

    const spin = () => {
        setFinished(false);
        const winningSegmentIndex = segments.indexOf(winningSegment);
        if (winningSegmentIndex < 0) {
            console.error('Winning segment not found in segments array');
            return;
        }

        const segmentAngle = (2 * Math.PI) / segments.length;
        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
        const targetAngle = (winningSegmentIndex + 0.5) * segmentAngle + randomOffset;
        
        const totalRotations = Math.floor(downDuration / 1000) * (2 * Math.PI);
        const finalAngle = totalRotations + (2 * Math.PI - targetAngle) + (3 * Math.PI / 2);

        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const totalDuration = upDuration + downDuration;
            
            const newAngle = easeInOutCubic(Math.min(progress, totalDuration), 0, finalAngle, totalDuration);
            
            angleCurrent.current = newAngle;

            draw();

            if (progress < totalDuration) {
                spinHandle.current = requestAnimationFrame(animate);
            } else {
                setFinished(true);
                if (onFinished) onFinished(winningSegment);
            }
        };

        spinHandle.current = requestAnimationFrame(animate);
    };

    const easeInOutCubic = (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
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
        ctx.moveTo(300, 300);
        ctx.arc(300, 300, size, lastAngle, angle, false);
        ctx.lineTo(300, 300);
        ctx.closePath();
        ctx.fillStyle = segColors[key];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = contrastColor || "white";
        ctx.font = "bold 1em " + fontFamily;
        ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
        ctx.restore();
    };

    const drawWheel = () => {
        const ctx = canvasContext;
        let lastAngle = angleCurrent.current;
        const len = segments.length;
        const PI2 = Math.PI * 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor || "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "1em " + fontFamily;
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent.current;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        ctx.beginPath();
        ctx.arc(300, 300, 40, 0, PI2, false);
        ctx.closePath();
        ctx.fillStyle = primaryColor || "black";
        ctx.lineWidth = 5;
        ctx.strokeStyle = contrastColor || "white";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(300, 300, size, 0, PI2, false);
        ctx.closePath();
        ctx.lineWidth = 25;
        ctx.strokeStyle = primaryColoraround || "white";
        ctx.stroke();
    }

    const drawNeedle = () => {
        const ctx = canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = contrastColor || "white";
        ctx.fillStyle = contrastColor || "white";
        ctx.beginPath();
        ctx.moveTo(300 - 15, 300 - size - 5);
        ctx.lineTo(300 + 15, 300 - size - 5);
        ctx.lineTo(300, 300 - size + 25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    const clear = () => {
        if (!canvasContext) return;
        canvasContext.clearRect(0, 0, 600, 600);
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
                }}
            />
        </div>
    );
};

export default WheelComponent; 