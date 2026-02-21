import { useEffect, useRef } from "react";
import SecurityShell from "../apps/Security";
import { getLevelFlag, isLevelUnlocked } from "../../utils/game";

function FeedCanvas({ filterStyle, flag }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // HD-DPI Scaling Fix
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);

    // Dark Room Background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, 800, 600);

    // Desk Surface
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(50, 400);
    ctx.lineTo(750, 400);
    ctx.lineTo(800, 600);
    ctx.lineTo(0, 600);
    ctx.fill();

    // Server/Monitor Silhouette
    ctx.fillStyle = "#030303";
    ctx.fillRect(200, 150, 350, 250);
    ctx.fillRect(350, 400, 50, 80);

    // === THE HIDDEN STICKY NOTE ===
    ctx.save();
    ctx.translate(450, 500); // Safe center coordinate
    ctx.rotate(-0.06);

    // The Paper Background (WIDENED drastically to hold long flags)
    ctx.fillStyle = "#0f0f0f";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 15;
    ctx.fillRect(-150, -60, 300, 120);

    // The Secret Text
    ctx.shadowBlur = 0;
    // Perfect hex delta. Invisible normally, sharp under 3000% contrast.
    ctx.fillStyle = "#161616";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("OVERRIDE KEY", 0, -15);

    // The Flag (Text bounded to 280px so it NEVER overflows the 300px paper)
    ctx.font = "14px monospace";
    ctx.fillText(flag, 0, 25, 280);

    ctx.restore();
  }, [flag]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        ...filterStyle,
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
      className="select-none pointer-events-none transition-all duration-200"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}

export default function VisualForensics({ onClose, progressionIds = [] }) {
  const isUnlocked = isLevelUnlocked("visual-forensics", progressionIds);
  const RAW_FLAG = getLevelFlag("visual-forensics");

  const renderFeed = (filterStyle) => {
    return <FeedCanvas filterStyle={filterStyle} flag={RAW_FLAG} />;
  };

  return (
    <SecurityShell
      onClose={onClose}
      isUnlocked={isUnlocked}
      renderFeed={renderFeed}
    />
  );
}
