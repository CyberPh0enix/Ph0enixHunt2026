import Level01 from "../components/puzzles/Level01";
import Level02 from "../components/puzzles/Level02";
import Level03 from "../components/puzzles/Level03";
import Level04 from "../components/puzzles/Level04";
import Level05 from "../components/puzzles/Level05";
import Level06 from "../components/puzzles/Level06";

export const PUZZLE_CONFIG = [
  // --- BROWSER PUZZLES (Levels 1-6) ---
  {
    id: "level-01",
    type: "browser",
    title: "Dev Team Notes",
    desc: "HTML Source Code Inspection",
    url: "https://corpnet.internal/dev-notes",
    component: Level01,
    requires: null,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "level-02",
    type: "browser",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    url: "https://corpnet.internal/design-v2",
    component: Level02,
    requires: "level-01",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "level-03",
    type: "browser",
    title: "System Logs",
    desc: "Console Debugging",
    url: "https://corpnet.internal/logs",
    component: Level03,
    requires: "level-02",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "level-04",
    type: "browser",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    url: "https://corpnet.internal/secure-transmission",
    component: Level04,
    requires: "level-03",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "level-05",
    type: "browser",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    url: "https://corpnet.internal/ads",
    component: Level05,
    requires: "level-04",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "level-06",
    type: "browser",
    title: "Session Manager",
    desc: "Storage Inspection",
    url: "https://corpnet.internal/auth",
    component: Level06,
    requires: "level-05",
    color: "bg-green-100 text-green-800",
  },

  // --- TERMINAL PUZZLES ---
  {
    id: "level-07",
    type: "terminal",
    title: "Hidden Services",
    desc: "Network Port Analysis",
    command: "netstat",
    flagHash:
      "ef73643c56c4e933fb2ce904efc1d4569a93b2eecae9be4748ec4bdc91c4d334",
    requires: "level-06",
    color: "bg-neutral-800 text-green-500",
  },
];
