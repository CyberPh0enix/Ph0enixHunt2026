import { LEVEL_CONFIG } from "./config";

// COMPONENTS
import HtmlSource from "../components/puzzles/HtmlSource";
import DesignV2 from "../components/puzzles/DesignV2";
import SystemLogs from "../components/puzzles/SystemLogs";
import SecureTransmission from "../components/puzzles/SecureTransmission";
import CorruptedDisplay from "../components/puzzles/CorruptedDisplay";
import SessionManager from "../components/puzzles/SessionManager";
import VisualForensics from "../components/puzzles/VisualForensics";

// COMMANDS
import { hiddenServicesCommands } from "../components/puzzles/HiddenServices";
import { dataRecoveryCommands } from "../components/puzzles/DataRecovery";

import ProjectPandora, {
  pandoraCommands,
} from "../components/puzzles/ProjectPandora";

// Map Semantic IDs to their Code counterpart
const CODE_MAP = {
  "first-blood": {},
  "html-source": { component: HtmlSource },
  "design-v2": { component: DesignV2 },
  "corrupted-display": { component: CorruptedDisplay },
  "system-logs": { component: SystemLogs },
  "secure-transmission": { component: SecureTransmission },
  "digital-footprint": {},
  "visual-forensics": { component: VisualForensics },
  "session-manager": { component: SessionManager },

  "hidden-services": { commands: hiddenServicesCommands },
  "data-recovery": { commands: dataRecoveryCommands },

  "project-pandora": { component: ProjectPandora, commands: pandoraCommands },
};

// Merge them automatically
export const PUZZLE_CONFIG = LEVEL_CONFIG.map((config) => ({
  ...config,
  ...CODE_MAP[config.id],
}));
