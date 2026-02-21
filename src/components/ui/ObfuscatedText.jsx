import React from "react";

export default function ObfuscatedText({
  text,
  className = "",
  charClassName = "",
}) {
  if (!text) return null;

  const handleCopy = (e) => {
    e.preventDefault();
    e.clipboardData.setData("text/plain", text);
  };

  return (
    <span className={className} onCopy={handleCopy} title="Classified Payload">
      {text.split("").map((char, index) => {
        // Random invisible garbage character
        const noise = Math.random().toString(36).charAt(2);

        return (
          <React.Fragment key={index}>
            <span className={charClassName}>{char}</span>
            <span
              className="absolute opacity-0 w-0 h-0 text-[0px] overflow-hidden pointer-events-none select-none"
              aria-hidden="true"
            >
              {noise}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}
