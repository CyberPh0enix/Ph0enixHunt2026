import { useEffect } from "react";
import { useFlag } from "../../hooks/useFlag";

export default function Level03() {
  const flag = useFlag("level-03");

  useEffect(() => {
    // Only log if we have the flag
    if (flag && flag !== "ERROR_MISSING_FLAG") {
      console.log(
        "%c STOP!",
        "color: red; font-size: 30px; font-weight: bold;",
      );
      console.log(`Backup code: ${flag}`);
    }
  }, [flag]);

  return (
    <div className="p-8 text-center mt-20">
      <h1 className="text-4xl">System Console</h1>
      <p className="mt-4 text-gray-600">
        Open Developer Tools (F12) to view logs.
      </p>
    </div>
  );
}
