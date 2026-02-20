import { useState, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>?/";

export default function DecryptedText({
  text,
  speed = 15,
  delay = 0,
  className = "",
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timeout;
    let interval;
    let iteration = 0;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayText((prev) => {
          const scrambled = text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("");
          return scrambled;
        });

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text);
        }
        iteration += 1;
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayText}</span>;
}
