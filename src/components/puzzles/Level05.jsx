import { useState } from "react";
import { useFlag } from "../../hooks/useFlag";

export default function Level05() {
  const [revealed, setRevealed] = useState(false);
  const flag = useFlag("level-05");

  // CRITICAL: This throws the error when the state changes
  if (revealed) {
    throw new Error(`CRITICAL_FAILURE: ${flag}`);
  }

  const handleRealClick = () => {
    setRevealed(true);
  };

  const handleFakeClick = () => {
    alert(
      "ADVERTISEMENT CLICKED! (You need to remove this element, not click it)",
    );
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col items-center justify-center min-h-[60vh] relative">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Corrupted Display Interface
      </h1>

      <div className="relative w-full max-w-md h-64 bg-gray-200 rounded-xl border-4 border-dashed border-gray-400 flex items-center justify-center overflow-hidden">
        {/* THE BUTTON (Hidden under ad) */}
        <button
          onClick={handleRealClick}
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95 z-0"
        >
          GENERATE SYSTEM FLAG
        </button>

        {/* THE BLOCKER (Top Layer) */}
        <div
          onClick={handleFakeClick}
          className="absolute inset-0 bg-red-600/90 z-50 flex flex-col items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
          title="Delete me in Elements tab!"
        >
          <h2 className="text-white text-4xl font-black tracking-tighter transform -rotate-12 drop-shadow-md">
            ADVERTISEMENT
          </h2>
          <p className="text-white/80 font-mono mt-4 text-center px-6">
            Buy Ph0enix Pro to remove ads!
          </p>
          <span className="text-white/50 text-xs mt-8 font-mono">
            (Hint: z-index: 50)
          </span>
        </div>
      </div>

      <p className="mt-8 text-gray-500 max-w-md text-center text-sm">
        System Error: Interface blocked by promotional layer.
        <br />
        <span className="font-mono text-blue-500">
          Action Required: Modify DOM to access underlying controls.
        </span>
      </p>
    </div>
  );
}
