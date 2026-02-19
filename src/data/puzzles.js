import { LEVEL_CONFIG } from "./config";

// Import the actual Code
import Level01 from "../components/puzzles/Level01";
import Level02 from "../components/puzzles/Level02";
import Level03 from "../components/puzzles/Level03";
import Level04 from "../components/puzzles/Level04";
import Level05 from "../components/puzzles/Level05";
import Level06 from "../components/puzzles/Level06";

import { level07Commands } from "../components/puzzles/Level07";
import { level08Commands } from "../components/puzzles/Level08";
import { level09Commands } from "../components/puzzles/Level09";

// Map IDs to their Code counterpart
const CODE_MAP = {
  "level-00": {}, // empty object for tutorial
  "level-01": { component: Level01 },
  "level-02": { component: Level02 },
  "level-03": { component: Level03 },
  "level-04": { component: Level04 },
  "level-05": { component: Level05 },
  "level-06": { component: Level06 },
  "level-07": { commands: level07Commands },
  "level-08": { commands: level08Commands },
  "level-09": { commands: level09Commands },
};

// Merge them automatically
export const PUZZLE_CONFIG = LEVEL_CONFIG.map((config) => ({
  ...config,
  ...CODE_MAP[config.id],
}));
