import { useRef, useEffect } from "react";
import { useFlag } from "../../hooks/useFlag";

export default function Level01() {
  const containerRef = useRef(null);
  const flag = useFlag("level-01");

  useEffect(() => {
    if (containerRef.current) {
      const comment = document.createComment(` SECRET FLAG: ${flag} `);
      containerRef.current.appendChild(comment);
    }
  }, [flag]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* ... UI remains the same ... */}
      <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">Maintenance Note:</p>
        <p ref={containerRef}>
          Please do not inspect the source code. It is trade secret.
        </p>
      </div>
    </div>
  );
}
