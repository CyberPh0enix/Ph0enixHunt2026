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
import { weaponizationCommands } from "../components/puzzles/Weaponization";
import { privilegeEscalationCommands } from "../components/puzzles/PrivilegeEscalation";

// Map Semantic IDs to their Code counterpart
const CODE_MAP = {
  "first-blood": {},
  "html-source": { component: HtmlSource },
  "design-v2": { component: DesignV2 },
  "system-logs": { component: SystemLogs },
  "secure-transmission": { component: SecureTransmission },
  "corrupted-display": { component: CorruptedDisplay },
  "session-manager": { component: SessionManager },
  "visual-forensics": { component: VisualForensics },

  "hidden-services": { commands: hiddenServicesCommands },
  "data-recovery": { commands: dataRecoveryCommands },
  weaponization: { commands: weaponizationCommands },
  "privilege-escalation": { commands: privilegeEscalationCommands },
  "digital-footprint": {},
};

// Merge them automatically
export const PUZZLE_CONFIG = LEVEL_CONFIG.map((config) => ({
  ...config,
  ...CODE_MAP[config.id],
}));
