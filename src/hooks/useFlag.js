import { useMemo } from "react";
import { PUZZLE_CONFIG } from "../data/puzzles";
import { decodeSecret } from "../utils/crypto";

export function useFlag(levelId) {
  const flag = useMemo(() => {
    const level = PUZZLE_CONFIG.find((p) => p.id === levelId);

    if (!level || !level.encryptedFlag) {
      console.warn(`[Security] No encrypted flag found for ${levelId}`);
      return "ERROR_MISSING_FLAG";
    }

    return decodeSecret(level.encryptedFlag);
  }, [levelId]);

  return flag;
}
