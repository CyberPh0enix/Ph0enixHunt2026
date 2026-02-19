import { getLevelFlag } from "../../utils/game";

export const getPuzzleImage = () => ({
  id: "level-11-puzzle",
  name: "secure_server.jpg",
  size: "4.2 MB",
  resolution: "4032 x 3024",
  date: "Feb 19, 2026",
  device: "Ph0enix-Admin-Device",
  lens: "24mm f/1.8",
  getLocation: () => getLevelFlag("level-11"),

  // SVG of a Server Rack
  src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="%23050505"/>
    <rect x="250" y="80" width="300" height="440" rx="5" fill="%23111" stroke="%23222" stroke-width="4"/>
    <g fill="%230f0">
      <circle cx="280" cy="140" r="5"/><circle cx="280" cy="180" r="5"/>
      <circle cx="280" cy="220" r="5"/><circle cx="280" cy="300" r="5"/>
    </g>
    <g fill="%23f00"><circle cx="280" cy="260" r="5"/></g>
    <g fill="%23333">
      <rect x="310" y="135" width="210" height="10"/><rect x="310" y="175" width="210" height="10"/>
      <rect x="310" y="215" width="210" height="10"/><rect x="310" y="255" width="210" height="10"/>
      <rect x="310" y="295" width="210" height="10"/>
    </g>
    <text x="400" y="550" fill="%23444" font-family="monospace" font-size="16" text-anchor="middle">SITE-B : RACK-04 : SECURE</text>
  </svg>`,
});
