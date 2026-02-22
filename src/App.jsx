import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import LockScreen from "./components/os/LockScreen";
import Desktop from "./components/os/Desktop";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function App() {
  const { user, loading } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") setIsAdminRoute(true);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-500 text-sm tracking-widest animate-pulse">
            ESTABLISHING SECURE LINK...
          </span>
        </div>
      </div>
    );
  }

  if (isAdminRoute) return <AdminDashboard />;

  if (!user || !unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <Desktop />;
}
