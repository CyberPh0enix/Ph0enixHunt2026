import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Info,
  Image as ImageIcon,
  MapPin,
  Camera,
  Grid,
} from "lucide-react";
import { isLevelUnlocked } from "../../utils/game";
import { getPuzzleImage } from "../puzzles/DigitalFootprint";
import ObfuscatedText from "../ui/ObfuscatedText";

const DUMMY_IMAGES = [
  {
    id: "wall-mario-01",
    name: "mk_plumbing_sys.svg",
    size: "404 KB",
    resolution: "1920 x 1080",
    date: "Jan 12, 2026",
    device: "Toadstool Tracker V2",
    lens: "Warp-Pipe Optic",
    getLocation: () => "World 1-1 // Underground Sector",
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="100%" height="100%" fill="%230a0a1a"/><defs><pattern id="pipes" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0 0 H10 V100 H0 Z M90 0 H100 V100 H90 Z" fill="%2300aaff" opacity="0.1"/><rect x="0" y="0" width="100" height="10" fill="%2300aaff" opacity="0.1"/></pattern><linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ffaa00" stop-opacity="0.8"/><stop offset="100%" stop-color="%23ffaa00" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23pipes)"/><g transform="translate(960, 540)"><circle r="300" fill="none" stroke="%23ffcc00" stroke-width="3" opacity="0.3" stroke-dasharray="10 5"/><path d="M-200 -200 L200 200 M200 -200 L-200 200" stroke="%23ffcc00" stroke-width="2" opacity="0.2"/><circle r="80" fill="url(%23glow)"/><g fill="%23ffcc00" opacity="0.9"><circle r="12" cx="120" cy="-100"/><circle r="12" cx="-120" cy="-100"/><circle r="12" cx="120" cy="100"/><circle r="12" cx="-120" cy="100"/></g><path d="M-50 -150 L50 -150 L50 -50 L150 -50 L150 50 L50 50 L50 150 L-50 150 L-50 50 L-150 50 L-150 -50 L-50 -50 Z" fill="none" stroke="%23ff3300" stroke-width="5" opacity="0.9"/></g><rect x="50" y="50" width="400" height="150" fill="%23000" stroke="%23ff3300" stroke-width="2" opacity="0.8"/><text x="70" y="90" fill="%23ffaa00" font-family="monospace" font-size="18">PING: princess_peach.local</text><text x="70" y="120" fill="%23ff3300" font-family="monospace" font-size="18">ERR 404: CASTLE_NOT_FOUND</text><text x="70" y="150" fill="%23ffaa00" font-family="monospace" font-size="18">ROUTING TO: CASTLE_02...</text></svg>`,
  },
  {
    id: "wall-zelda-02",
    name: "sheikah_slate_dump.svg",
    size: "1.2 MB",
    resolution: "1920 x 1080",
    date: "Mar 03, 2026",
    device: "Sheikah Slate Terminal",
    lens: "Eye of Truth",
    getLocation: () => "Shrine of Resurrection // Core",
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="100%" height="100%" fill="%230d1117"/><defs><pattern id="sheikah" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M40 10 A30 30 0 1 1 40 70 A30 30 0 1 1 40 10 M40 25 A15 15 0 1 0 40 55 A15 15 0 1 0 40 25" fill="none" stroke="%2300e5ff" stroke-width="1" opacity="0.1"/></pattern><filter id="glow-blue"><feGaussianBlur stdDeviation="6" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(%23sheikah)"/><g transform="translate(960, 540)" filter="url(%23glow-blue)"><path d="M0 -250 L216.5 125 L-216.5 125 Z" fill="none" stroke="%2300e5ff" stroke-width="4"/><path d="M0 -250 L0 0 M216.5 125 L0 0 M-216.5 125 L0 0" stroke="%2300e5ff" stroke-width="2" opacity="0.5"/><path d="M0 -120 L103.9 60 L-103.9 60 Z" fill="none" stroke="%2300e5ff" stroke-width="4"/><path d="M0 -60 L51.9 30 L-51.9 30 Z" fill="%2300e5ff" opacity="0.9"/></g><rect x="1450" y="850" width="420" height="180" fill="%23000" stroke="%2300e5ff" stroke-width="2" opacity="0.8"/><text x="1480" y="900" fill="%2300e5ff" font-family="monospace" font-size="20">RUNNING TRIFORCE.EXE...</text><text x="1480" y="940" fill="%2300e5ff" font-family="monospace" font-size="20">COURAGE_MODULE: LOADED</text><text x="1480" y="980" fill="%2300e5ff" font-family="monospace" font-size="20">WISDOM_MODULE:  LOADED</text></svg>`,
  },
  {
    id: "wall-mc-03",
    name: "redstone_logic_gate.svg",
    size: "64 KB",
    resolution: "1920 x 1080",
    date: "Nov 18, 2026",
    device: "Observer Block Render",
    lens: "Direct Feed",
    getLocation: () => "Chunk [12, -4, 8] // Y: 11",
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="100%" height="100%" fill="%23140505"/><defs><pattern id="blocks" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill="none" stroke="%23ff3300" stroke-width="1" opacity="0.15"/><rect x="16" y="16" width="32" height="32" fill="%23ff3300" opacity="0.05"/></pattern><filter id="glow-red"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(%23blocks)"/><g transform="translate(960, 540)" filter="url(%23glow-red)"><rect x="-384" y="-192" width="768" height="384" fill="none" stroke="%23ff3300" stroke-width="6"/><path d="M-384 0 H384 M0 -192 V192" stroke="%23ff3300" stroke-width="2" opacity="0.4"/><rect x="-192" y="-96" width="384" height="192" fill="none" stroke="%23ff3300" stroke-width="4"/><rect x="-96" y="-48" width="192" height="96" fill="%23ff3300" opacity="0.8"/></g><g font-family="monospace" font-size="24" fill="%23ff3300"><text x="600" y="320">T-FLIP-FLOP: ACTIVE</text><text x="600" y="780">OUTPUT: HIGH (15)</text><text x="1100" y="320">TICK_RATE: 20/s</text></g></svg>`,
  },
  {
    id: "wall-gta-04",
    name: "ls_radar_sweep.svg",
    size: "890 KB",
    resolution: "1920 x 1080",
    date: "Oct 26, 2026",
    device: "FIB Surveillance Drone",
    lens: "Nightvision/Thermal",
    getLocation: () => "Los Santos // Vinewood Hills",
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="100%" height="100%" fill="%23050510"/><defs><linearGradient id="grad-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2300001a"/><stop offset="100%" stop-color="%23220033"/></linearGradient><filter id="neon"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(%23grad-sky)"/><g filter="url(%23neon)"><path d="M0 800 L150 720 L300 750 L450 650 L650 720 L850 600 L1100 680 L1350 550 L1600 650 L1800 500 L1920 580" fill="none" stroke="%23ff00ff" stroke-width="4"/><rect x="250" y="750" width="40" height="330" fill="%2300ffff" opacity="0.5"/><rect x="350" y="720" width="50" height="360" fill="%23ff00ff" opacity="0.4"/><rect x="550" y="700" width="60" height="380" fill="%2300ffff" opacity="0.5"/><rect x="750" y="650" width="80" height="430" fill="%23ff00ff" opacity="0.4"/><rect x="1050" y="620" width="90" height="460" fill="%2300ffff" opacity="0.5"/><rect x="1350" y="580" width="70" height="500" fill="%23ff00ff" opacity="0.4"/><rect x="1700" y="520" width="80" height="560" fill="%2300ffff" opacity="0.5"/></g><rect x="50" y="50" width="400" height="200" rx="10" fill="%23000" stroke="%23ff00ff" stroke-width="2" opacity="0.8"/><text x="80" y="100" fill="%23ff00ff" font-family="monospace" font-size="22" font-weight="bold">WANTED LEVEL: ★★★★★</text><text x="80" y="140" fill="%2300ffff" font-family="monospace" font-size="18">UNIT: LSPD AIR-1</text><text x="80" y="180" fill="%2300ffff" font-family="monospace" font-size="18">SUSPECT: NORTHBOUND, ALTA ST.</text></svg>`,
  },
  {
    id: "wall-cyber-05",
    name: "geometric_node_breach.svg",
    size: "3.1 MB",
    resolution: "1920 x 1080",
    date: "Dec 10, 2026",
    device: "Cyberdeck Mk. IV",
    lens: "Kiroshi Optics",
    getLocation: () => "Subnet 8 // ICE Layer 3",
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="100%" height="100%" fill="%23020617"/><defs><filter id="glow-cyan"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><g filter="url(%23glow-cyan)"><path d="M400 300 L550 200 L700 300 L700 500 L550 600 L400 500 Z" fill="url(%23metal)" stroke="%2306b6d4" stroke-width="3"/><line x1="550" y1="200" x2="650" y2="100" stroke="%2322d3ee" stroke-width="4"/><path d="M900 400 L1050 300 L1200 400 L1200 600 L1050 700 L900 600 Z" fill="url(%23metal)" stroke="%2306b6d4" stroke-width="3"/><line x1="1200" y1="400" x2="1350" y2="300" stroke="%2322d3ee" stroke-width="4"/><path d="M1300 600 L1450 500 L1600 600 L1600 800 L1450 900 L1300 800 Z" fill="url(%23metal)" stroke="%2306b6d4" stroke-width="3"/><line x1="1300" y1="600" x2="1150" y2="500" stroke="%2322d3ee" stroke-width="4"/><path d="M500 700 L650 600 L800 700 L800 900 L650 1000 L500 900 Z" fill="url(%23metal)" stroke="%2306b6d4" stroke-width="3"/><line x1="650" y1="1000" x2="750" y2="1100" stroke="%2322d3ee" stroke-width="4"/><line x1="700" y1="400" x2="900" y2="500" stroke="%2306b6d4" stroke-width="2" stroke-dasharray="10 5"/><line x1="1200" y1="500" x2="1300" y2="700" stroke="%2306b6d4" stroke-width="2" stroke-dasharray="10 5"/><line x1="800" y1="800" x2="900" y2="600" stroke="%2306b6d4" stroke-width="2" stroke-dasharray="10 5"/></g><rect x="1400" y="50" width="450" height="250" fill="%23000" stroke="%2306b6d4" stroke-width="2" opacity="0.8"/><text x="1430" y="100" fill="%2306b6d4" font-family="monospace" font-size="20">BREACH PROTOCOL: INITIATED</text><text x="1430" y="140" fill="%23cbd5e1" font-family="monospace" font-size="16">NODE 01: BYPASSED</text><text x="1430" y="170" fill="%23cbd5e1" font-family="monospace" font-size="16">NODE 02: BYPASSED</text><text x="1430" y="200" fill="%2322d3ee" font-family="monospace" font-size="16">NODE 03: BRUTEFORCING...</text><rect x="1430" y="220" width="300" height="10" fill="%231e293b"/><rect x="1430" y="220" width="210" height="10" fill="%2306b6d4"/></svg>`,
  },
];

export default function Gallery({ onClose, progressionIds = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const isLevel11Unlocked = isLevelUnlocked(
    "digital-footprint",
    progressionIds,
  );

  const images = useMemo(() => {
    const list = [...DUMMY_IMAGES];
    if (isLevel11Unlocked) list.push(getPuzzleImage());
    return list;
  }, [isLevel11Unlocked]);

  // DETAIL VIEWER
  if (selectedImage) {
    return (
      <div className="h-full bg-neutral-900 text-white flex flex-col font-sans animate-in zoom-in-95 duration-200">
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedImage(null);
                setShowInfo(false);
              }}
              className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-semibold text-sm flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-400" />{" "}
              {selectedImage.name}
            </span>
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1.5 rounded-full transition-colors ${showInfo ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/10"}`}
          >
            <Info size={18} />
          </button>
        </div>

        <div className="flex-1 flex relative overflow-hidden bg-black">
          {/* Main Image */}
          <div
            className={`flex-1 flex items-center justify-center p-8 transition-all duration-300 ${showInfo ? "mr-64" : ""}`}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />
          </div>

          {/* EXIF Sidebar */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-64 bg-neutral-900 border-l border-white/10 transform transition-transform duration-300 ${showInfo ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="p-4 space-y-6 overflow-y-auto h-full">
              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  File Properties
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Name</span>
                    <span className="truncate ml-2">{selectedImage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Size</span>
                    <span>{selectedImage.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Res</span>
                    <span>{selectedImage.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Date</span>
                    <span>{selectedImage.date}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full"></div>

              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Camera size={14} /> EXIF Metadata
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-neutral-400 text-xs block">
                      Device
                    </span>
                    <span className="font-mono text-xs">
                      {selectedImage.device}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs block">Lens</span>
                    <span className="font-mono text-xs">
                      {selectedImage.lens}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-xs flex items-center gap-1 mb-1">
                      <MapPin size={10} /> Location Data
                    </span>
                    {/* The flag is evaluated dynamically here! */}
                    <span className="font-mono text-[10px] text-blue-400 break-all bg-blue-900/20 p-2 rounded block border border-blue-500/20">
                      {/* EXIF ANTI-CHEAT */}
                      <ObfuscatedText text={selectedImage.getLocation()} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEWER
  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-sans animate-in zoom-in-95 duration-200">
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="font-semibold text-sm flex items-center gap-2">
            <Grid size={16} className="text-yellow-400" /> Local Storage
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="aspect-square bg-black border border-white/10 rounded overflow-hidden hover:border-blue-500/50 transition-colors group relative"
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1 translate-y-full group-hover:translate-y-0 transition-transform">
                <span className="text-[9px] text-neutral-300 truncate block px-1">
                  {img.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
