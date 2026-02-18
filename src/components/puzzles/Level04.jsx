import { useMemo } from "react";
import { useFlag } from "../../hooks/useFlag";

export default function Level04() {
  const flag = useFlag("level-04");

  const encodedFlag = useMemo(() => {
    try {
      return btoa(flag);
    } catch (e) {
      return "Loading...";
    }
  }, [flag]);

  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">Secure Transmission</h1>
      <p className="mb-4 text-sm text-gray-600">
        The network intercepted this encoded string:
      </p>
      <div className="bg-gray-100 p-6 border break-all">
        <code className="text-red-600 text-lg">{encodedFlag}</code>
      </div>
    </div>
  );
}
