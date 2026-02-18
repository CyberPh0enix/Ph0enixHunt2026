import { SYSTEM_DATA } from "../config/build.prop";

import Level01 from "../components/puzzles/Level01";
import Level02 from "../components/puzzles/Level02";
import Level03 from "../components/puzzles/Level03";
import Level04 from "../components/puzzles/Level04";
import Level05 from "../components/puzzles/Level05";
import Level06 from "../components/puzzles/Level06";

import { level07Commands } from "../components/puzzles/Level07";
import { level08Commands } from "../components/puzzles/Level08";

export const PUZZLE_CONFIG = [
  // --- BROWSER PUZZLES ---
  {
    id: "level-01",
    type: "browser",
    title: "Dev Team Notes",
    desc: "HTML Source Code Inspection",
    path: "dev-notes",
    component: Level01,
    encryptedFlag:
      "666c61677b68746d6c5f636f6d6d656e74735f6172655f6e6f745f7365637572657d",
    requires: null,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "level-02",
    type: "browser",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    path: "design-v2",
    component: Level02,
    encryptedFlag: "666c61677b636f6e74726173745f69735f6b65797d",
    requires: "level-01",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "level-03",
    type: "browser",
    title: "System Logs",
    desc: "Console Debugging",
    path: "logs",
    component: Level03,
    encryptedFlag: "666c61677b636f6e736f6c655f6c6f675f6d61737465727d",
    requires: "level-02",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "level-04",
    type: "browser",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    path: "secure-transmission",
    component: Level04,
    encryptedFlag:
      "666c61677b6261736536345f69735f6e6f745f656e6372797074696f6e7d",
    requires: "level-03",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "level-05",
    type: "browser",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    path: "ads",
    component: Level05,
    encryptedFlag: "666c61677b7a5f696e6465785f68696465735f616c6c5f73696e737d",
    requires: "level-04",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "level-06",
    type: "browser",
    title: "Session Manager",
    desc: "Storage Inspection",
    path: "auth",
    component: Level06,
    encryptedFlag: "666c61677b636f6f6b6965735f6172655f74617374797d",
    requires: "level-05",
    color: "bg-green-100 text-green-800",
  },

  // --- TERMINAL PUZZLES ---
  {
    id: "level-07",
    type: "terminal",
    title: "Hidden Services",
    desc: "Network Port Analysis",
    commands: level07Commands,
    onStart: "Suspicious activity detected on network.",
    flagHash:
      "ef73643c56c4e933fb2ce904efc1d4569a93b2eecae9be4748ec4bdc91c4d334",
    requires: "level-06",
    color: "bg-neutral-800 text-green-500",
  },
  {
    id: "level-08",
    type: "terminal",
    title: "Data Recovery",
    desc: "File System Forensics",
    commands: level08Commands,
    onStart: "Logs are meant to be grep-ed. Investigate.",
    flagHash:
      "e2037733748bdc33e66dddc8140dcd6ca264fcbb97670f29bab21e3b5a726299",
    requires: "level-07",
    color: "bg-blue-900 text-blue-300",
  },
];
