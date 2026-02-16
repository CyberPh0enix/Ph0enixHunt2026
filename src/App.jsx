import PhoneFrame from "./components/os/PhoneFrame";
import LockScreen from "./components/os/LockScreen";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <PhoneFrame>
      {user ? (
        // LOGGED IN VIEW (The Desktop)
        <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h1 className="text-2xl text-green-500 font-mono">
            WELCOME, OPERATOR
          </h1>
          <p className="text-xs text-neutral-500">{user.email}</p>
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded text-green-400 font-mono text-sm">
            SYSTEM_STATUS: ONLINE
          </div>
        </div>
      ) : (
        // LOGGED OUT VIEW (Lock Screen)
        <LockScreen />
      )}
    </PhoneFrame>
  );
}

export default App;
