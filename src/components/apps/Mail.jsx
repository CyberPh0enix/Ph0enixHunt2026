import { useState, useEffect } from "react";
import { Mail as MailIcon, AlertCircle, RefreshCw } from "lucide-react";
import { SYSTEM_DATA } from "../../config/build.prop";

export default function Mail({ onClose }) {
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("failed");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full bg-white text-gray-800 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-blue-600 p-3 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          <MailIcon size={18} className="text-white" />
          <span className="font-bold text-sm text-white tracking-wide">
            {SYSTEM_DATA.orgShort} Outlook Web
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        {status === "connecting" ? (
          <div className="flex flex-col items-center animate-pulse">
            <RefreshCw size={32} className="text-blue-500 animate-spin mb-4" />
            <h2 className="text-lg font-bold text-gray-700">
              Connecting to Exchange Server...
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-2">
              tcp://mail.{SYSTEM_DATA.website}:993
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 max-w-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-200 shadow-sm">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">
              Connection Refused
            </h2>
            <div className="w-12 h-1 bg-red-500 mb-4 rounded-full"></div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              The internal mail server is currently unreachable. The network
              administrator has locked down external routing protocols.
            </p>
            <div className="bg-gray-200 p-3 rounded w-full text-left border border-gray-300">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-1">
                Diagnostic Info
              </span>
              <span className="text-xs font-mono text-gray-700">
                ERR_CONNECTION_REFUSED
                <br />
                NODE: mail-gateway-01
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
