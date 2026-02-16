import { useRef, useEffect } from "react";

export default function Level01() {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const comment = document.createComment(
        " SECRET FLAG: flag{html_comments_are_not_secure} ",
      );
      containerRef.current.appendChild(comment);
    }
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Dev Team Notes</h1>
      <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">Maintenance Note:</p>
        <p ref={containerRef}>
          Please do not inspect the source code. It is trade secret.
        </p>
      </div>
    </div>
  );
}
