import { SYSTEM_DATA } from "../../config/build.prop";
import ObfuscatedText from "../ui/ObfuscatedText";

export default function DesignV2({ flag }) {
  const colors = [
    { name: "Primary Blue", hex: "#2563EB", text: "text-white" },
    { name: "Secondary Slate", hex: "#475569", text: "text-white" },
    { name: "Warning Amber", hex: "#D97706", text: "text-white" },
    { name: "Error Red", hex: "#DC2626", text: "text-white" },
    { name: "Success Green", hex: "#16A34A", text: "text-white" },
    { name: "Neutral Gray", hex: "#F3F4F6", text: "text-gray-900" },
  ];

  return (
    <div className="min-h-full bg-white p-8 font-sans animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b pb-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {SYSTEM_DATA.orgShort} Design System
          </h1>
          <p className="text-gray-500 mt-2">
            Version 2.4.1 // Official Brand Guidelines
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Core Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {colors.map((c) => (
              <div
                key={c.name}
                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-32 flex items-end p-4 ${c.text}`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="font-mono text-sm opacity-90">{c.hex}</span>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-gray-800">{c.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Used for main UI elements
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            High-Contrast Modes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="h-32 bg-white flex items-center justify-center border-b border-gray-100">
                <span className="text-black font-bold">Standard Light</span>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold">Light Mode</h3>
              </div>
            </div>

            {/* THE PUZZLE ELEMENT */}
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
              <div className="h-32 bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="text-[#0a0a0a] font-mono text-sm select-text selection:bg-blue-500 selection:text-white text-center flex flex-wrap justify-center">
                  {/* BEAUTIFUL & CLEAN ANTI-CHEAT */}
                  <ObfuscatedText
                    text={flag}
                    className="justify-center"
                    spanClassName="hover:text-[#0b0b0b] transition-colors duration-1000"
                  />
                </div>
              </div>
              <div className="p-4 bg-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">Absolute Void</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Deep background color
                  </p>
                </div>
                <span className="font-mono text-xs text-gray-400">#0a0a0a</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
