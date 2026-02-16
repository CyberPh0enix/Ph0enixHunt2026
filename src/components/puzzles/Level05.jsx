export default function Level05() {
  return (
    <div className="p-8 relative h-full min-h-[500px] overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">The "Corrupted" Image</h1>
      <p className="mb-4">
        The recovery key is printed on this page, but this annoying ad is
        blocking it.
        <br />
        <span className="text-sm text-gray-500">
          (Hint: Use the Element Inspector to delete the ad or lower its
          z-index)
        </span>
      </p>

      {/* THE FLAG (Hidden behind the overlay) */}
      <div className="absolute top-40 left-20 bg-green-100 p-6 border-2 border-green-500 z-0">
        <p className="font-bold text-green-800">RECOVERY KEY FOUND:</p>
        <code className="text-xl font-mono text-black">
          {"flag{z_index_hides_all_sins}"}
        </code>
      </div>

      {/* THE BLOCKER (High Z-Index) */}
      {/* This div covers the flag. User must delete it. */}
      <div className="absolute top-32 left-10 w-[400px] h-[300px] bg-red-600 text-white flex flex-col items-center justify-center font-bold text-2xl z-50 shadow-2xl rotate-3 border-4 border-yellow-400">
        <span className="text-6xl mb-2">⚠️</span>
        <span>CRITICAL ERROR</span>
        <span className="text-sm font-normal mt-2">Please contact support</span>
      </div>
    </div>
  );
}
