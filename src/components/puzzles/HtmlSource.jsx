import { useRef, useEffect } from "react";
import { SYSTEM_DATA } from "../../config/build.prop";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function HtmlSource({ flag }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clean up previous comments if re-rendered
      containerRef.current.innerHTML = "";
      const comment = document.createComment(
        ` CRITICAL: Hardcoded Master Password: ${flag} - DO NOT COMMIT THIS TO PRODUCTION! `,
      );
      containerRef.current.appendChild(comment);
    }
  }, [flag]);

  const tickets = [
    {
      id: "PHX-104",
      status: "Done",
      title: "Update corporate logo on login page",
      priority: "Low",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      id: "PHX-105",
      status: "In Progress",
      title: "Migrate legacy database to AWS",
      priority: "High",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      id: "PHX-106",
      status: "Blocked",
      title: "Fix firewall bypass vulnerability",
      priority: "Critical",
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-8 font-sans animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {SYSTEM_DATA.orgName} DevBoard
            </h1>
            <p className="text-sm text-gray-500">
              Internal Engineering Tracker // Sprint 42
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
            CONFIDENTIAL
          </div>
        </div>

        <div className="space-y-4">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <t.icon className={t.color} size={24} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    {t.id}
                  </span>
                  <h3 className="font-bold text-gray-800">{t.title}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: {t.status}</p>
              </div>
              <div
                className={`text-xs font-bold px-2 py-1 rounded ${t.priority === "Critical" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}
              >
                {t.priority}
              </div>
            </div>
          ))}

          {/* The Vulnerable Ticket */}
          <div className="bg-red-50 p-5 rounded-lg border border-red-200 shadow-sm flex items-start gap-4 mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <AlertCircle className="text-red-500 shrink-0 mt-1" size={24} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-red-400">PHX-999</span>
                <h3 className="font-bold text-red-900">
                  Remove hardcoded credentials from frontend
                </h3>
              </div>
              <p className="text-sm text-red-700 mt-2">
                <strong>Assigned to:</strong> Junior_Dev
                <br />
                <strong>Notes:</strong> I temporarily put the master override
                code in the HTML comments so I wouldn't forget it while testing
                the new auth flow. Please remind me to delete it before the
                Friday deploy.
              </p>
              {/* The hidden comment is injected here */}
              <div ref={containerRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
