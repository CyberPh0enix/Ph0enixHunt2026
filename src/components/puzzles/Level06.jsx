import { useEffect } from "react";
import { useFlag } from "../../hooks/useFlag";

export default function Level06() {
  const flag = useFlag("level-06");

  useEffect(() => {
    if (flag && flag !== "ERROR_MISSING_FLAG") {
      document.cookie = `session_id=${flag}; path=/`;
    }
  }, [flag]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">
        We can't log you in because your session token is invalid.
      </p>
      <div className="bg-red-100 p-4 border border-red-400 text-red-700 inline-block">
        Error: 403 Forbidden
      </div>
      <p className="mt-8 text-sm text-gray-500">
        (Hint: Check your snacks in DevTools)
      </p>
    </div>
  );
}
