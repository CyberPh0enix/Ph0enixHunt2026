import { useMemo, useState, useEffect } from "react";
import { Activity, Network, ShieldAlert } from "lucide-react";

export default function SecureTransmission({ flag }) {
  const [scanning, setScanning] = useState(true);

  const encodedFlag = useMemo(() => {
    try {
      return btoa(flag);
    } catch (e) {
      return "Loading...";
    }
  }, [flag]);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full bg-neutral-900 text-green-500 font-mono p-4 sm:p-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-green-900/50 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Network className="text-green-500 shrink-0" size={28} />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-widest truncate">
              NET-SNIFFER v3.1
            </h1>
            <p className="text-[10px] sm:text-xs text-green-700 truncate">
              Listening on interface: eth0 // Promiscuous Mode
            </p>
          </div>
        </div>
        {scanning ? (
          <div className="flex items-center gap-2 text-yellow-500 text-xs animate-pulse whitespace-nowrap">
            <Activity size={16} className="shrink-0" /> INTERCEPTING...
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold whitespace-nowrap">
            <ShieldAlert size={16} className="shrink-0" /> ANOMALY DETECTED
          </div>
        )}
      </div>

      {/* The Table Container (Scrollable on Mobile) */}
      <div className="bg-black border border-green-900/30 rounded flex flex-col overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[600px]">
            {" "}
            {/* Forces scroll on screens smaller than 600px */}
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 p-3 bg-green-950/20 border-b border-green-900/30 text-[10px] sm:text-xs font-bold text-green-600">
              <div className="col-span-2">TIME</div>
              <div className="col-span-3">SOURCE</div>
              <div className="col-span-3">DESTINATION</div>
              <div className="col-span-1">PROTO</div>
              <div className="col-span-3">PAYLOAD (RAW)</div>
            </div>
            {/* Fake Packets */}
            <div className="flex flex-col text-[10px] sm:text-xs text-green-400 opacity-50">
              <div className="grid grid-cols-12 gap-2 p-3 border-b border-green-900/10 items-center">
                <div className="col-span-2">14:02:11.001</div>
                <div className="col-span-3 truncate">10.0.4.12</div>
                <div className="col-span-3 truncate">192.168.1.1</div>
                <div className="col-span-1">TCP</div>
                <div className="col-span-3 truncate min-w-0">SYN ACK 8080</div>
              </div>
              <div className="grid grid-cols-12 gap-2 p-3 border-b border-green-900/10 items-center">
                <div className="col-span-2">14:02:11.405</div>
                <div className="col-span-3 truncate">10.0.4.15</div>
                <div className="col-span-3 truncate">192.168.1.5</div>
                <div className="col-span-1">UDP</div>
                <div className="col-span-3 truncate min-w-0">
                  DNS QUERY internal.corp
                </div>
              </div>
            </div>
            {/* The Target Packet */}
            {!scanning && (
              <div className="grid grid-cols-12 gap-2 p-3 bg-red-950/20 border-l-2 border-red-500 text-[10px] sm:text-xs text-red-400 animate-in slide-in-from-right duration-500 items-center">
                <div className="col-span-2">14:02:12.992</div>
                <div className="col-span-3 text-white truncate">
                  10.0.0.2 (SECURE)
                </div>
                <div className="col-span-3 truncate">192.168.1.100</div>
                <div className="col-span-1 font-bold text-yellow-500">AUTH</div>

                {/* The payload uses break-all so the long base64 string wraps cleanly 
                  instead of breaking the grid layout.
                */}
                <div className="col-span-3 font-bold break-all min-w-0 selection:bg-red-500 selection:text-white">
                  {encodedFlag}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!scanning && (
        <div className="mt-6 p-4 bg-green-950/10 border border-green-900/30 text-[10px] sm:text-sm text-green-600 leading-relaxed">
          <strong className="text-green-500">SYSTEM ANALYSIS:</strong> Packet
          payload contains encoded string ending in padding characters.
          Recommended action: Route through standard decoding algorithm.
        </div>
      )}
    </div>
  );
}
