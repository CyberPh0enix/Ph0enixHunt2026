import { useEffect } from "react";

export default function Level03() {
  useEffect(() => {
    console.log("%c STOP!", "color: red; font-size: 30px; font-weight: bold;");
    console.log("Backup code: flag{console_log_master}");
  }, []);

  return (
    <div className="p-8 text-center mt-20">
      <h1 className="text-4xl">System Console</h1>
      <p className="mt-4 text-gray-600">
        Open Developer Tools (F12) to view logs.
      </p>
    </div>
  );
}
