import Level01 from "../components/puzzles/Level01";
import Level02 from "../components/puzzles/Level02";
import Level03 from "../components/puzzles/Level03";
import Level04 from "../components/puzzles/Level04";
import Level05 from "../components/puzzles/Level05";
import Level06 from "../components/puzzles/Level06";

export const PUZZLE_CONFIG = [
  {
    id: "level-01",
    title: "Dev Team Notes",
    desc: "HTML Source Code Inspection",
    url: "https://corpnet.internal/dev-notes",
    component: Level01,
    requires: null, // Always unlocked
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "level-02",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    url: "https://corpnet.internal/design-v2",
    component: Level02,
    requires: "level-01", // Locked until L1 is solved
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "level-03",
    title: "System Logs",
    desc: "Console Debugging",
    url: "https://corpnet.internal/logs",
    component: Level03,
    requires: "level-02", // Locked until L2 is solved
    color: "bg-red-100 text-red-800",
  },
  {
    id: "level-04",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    url: "https://corpnet.internal/secure-transmission",
    component: Level04,
    requires: "level-03", // Links it to Level 3
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "level-05",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    url: "https://corpnet.internal/ads",
    component: Level05,
    requires: "level-04", // Links it to Level 4
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "level-06",
    title: "Session Manager",
    desc: "Storage Inspection",
    url: "https://corpnet.internal/auth",
    component: Level06,
    requires: "level-05",
    color: "bg-green-100 text-green-800",
  },
];
