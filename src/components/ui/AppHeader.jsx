import { X } from "lucide-react";
import { SensoryEngine } from "../../utils/sensory";

export default function AppHeader({ title, icon: Icon, onClose, extra }) {
  const handleClose = () => {
    SensoryEngine.playKeystroke();
    SensoryEngine.vibrate([30]);
    if (onClose) onClose();
  };

  return (
    <div className="px-3 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0 select-none z-50">
      <div className="flex items-center gap-2 text-white/90 font-mono text-xs md:text-sm tracking-widest uppercase font-bold">
        {Icon && <Icon size={16} className="text-blue-500" />}
        {title}
      </div>

      <div className="flex items-center gap-3">
        {extra && <div className="hidden sm:block">{extra}</div>}
        <button
          onClick={handleClose}
          className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 p-1 rounded-md transition-all active:scale-90"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
