import { useEffect, useState } from "react";
import { Activity, Server } from "lucide-react";

export default function SystemLogs({ flag }) {
  const [logs, setLogs] = useState([]);
  const [kernelPanic, setKernelPanic] = useState(false); // [NEW] The intentional crash trigger

  // 1. THE FAKE LOGS & CRASH SEQUENCE
  useEffect(() => {
    let isMounted = true;

    const fakeLogs = [
      "INFO: Application booting...",
      "INFO: Connecting to database cluster...",
      "WARN: High latency on node-04.",
      "INFO: Database connected. Pool size: 20.",
      "DEBUG: Initializing session manager...",
      "CRITICAL: Memory leak detected in UI renderer.",
      "FATAL: Initiating failsafe memory dump...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (!isMounted) return;

      if (i < fakeLogs.length) {
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toISOString().split("T")[1].slice(0, 8),
            text: fakeLogs[i],
          },
        ]);
        i++;
      } else {
        // Once logs finish, wait 1 second and pull the plug!
        setTimeout(() => {
          if (isMounted) setKernelPanic(true);
        }, 1000);
        clearInterval(interval);
      }
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. THE SILENT FLAG (Prints to F12)
  useEffect(() => {
    if (flag && flag !== "ERROR_MISSING_FLAG") {
      const timer = setTimeout(() => {
        console.log(
          "%c Ph0enix Internal Diagnostics ",
          "background: #222; color: #bada55; font-size: 20px; font-weight: bold;",
        );
        console.log("Checking environment variables...");
        console.log("Checking Auth State...");
        console.warn(
          "CRITICAL WARNING: Failsafe triggered. Environment variables dumped to console to prevent total lock-out.",
        );
        console.log(`[DEBUG_DUMP] MASTER_OVERRIDE_KEY = ${flag}`);
        console.log("End of diagnostic run.");
      }, 1500); // Prints safely before the crash happens

      return () => clearTimeout(timer);
    }
  }, [flag]);

  // 3. THE INTENTIONAL CRASH
  if (kernelPanic) {
    // This intentionally breaks the React tree and triggers your <SystemCrash /> Error Boundary
    throw new Error(
      "KERNEL PANIC: UI Thread Terminated. Memory dumped to backend.",
    );
  }

  return (
    <div className="min-h-full bg-[#0d1117] text-gray-300 font-mono p-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 border-b border-gray-800 pb-4 mb-6">
        <Server className="text-blue-500" size={28} />
        <div>
          <h1 className="text-xl font-bold text-white">
            Server Diagnostics / Live Logs
          </h1>
          <p className="text-xs text-gray-500">
            Instance: prod-cluster-us-east // Stream: ACTIVE
          </p>
        </div>
        <Activity className="text-green-500 ml-auto animate-pulse" size={24} />
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4 h-[60vh] overflow-y-auto font-mono text-sm shadow-inner">
        {logs.map((log, index) => {
          if (!log || !log.text) return null; // Safety net against HMR glitches

          return (
            <div
              key={index}
              className="flex gap-4 mb-2 hover:bg-gray-800/50 px-2 rounded animate-in slide-in-from-left-2 duration-300"
            >
              <span className="text-gray-500 shrink-0">[{log.time}]</span>
              <span
                className={`
                ${log.text.includes("FATAL") || log.text.includes("CRITICAL") ? "text-red-500 font-bold" : ""}
                ${log.text.includes("WARN") ? "text-yellow-400" : ""}
                ${log.text.includes("INFO") ? "text-blue-400" : ""}
                ${log.text.includes("DEBUG") ? "text-purple-400" : ""}
              `}
              >
                {log.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
