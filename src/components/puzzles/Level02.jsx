export default function Level02() {
  return (
    <div className="h-full bg-white p-8">
      <h1 className="text-3xl font-bold mb-4">Design System V2</h1>
      <div className="bg-black p-10 mt-10 relative select-none">
        <p className="text-white mb-4">Dark Mode Enabled.</p>
        <p className="text-black select-text selection:bg-white selection:text-black">
          {"flag{contrast_is_key}"}
        </p>
      </div>
    </div>
  );
}
