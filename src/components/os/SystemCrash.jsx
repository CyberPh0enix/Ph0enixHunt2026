import { Component } from "react";
import { SYSTEM_DATA } from "../../config/build.prop";
import { SensoryEngine } from "../../utils/sensory";

export default class SystemCrash extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("KERNEL PANIC:", error, errorInfo);
    SensoryEngine.playError();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      document.addEventListener("keydown", this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
      this.rebootSystem();
    }
  }

  rebootSystem = () => {
    SensoryEngine.playKeystroke();
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#050505] text-white font-mono text-[9px] sm:text-xs md:text-sm z-[99999] overflow-y-auto overflow-x-hidden select-none animate-in fade-in duration-0 custom-scrollbar">
          {/* CRT Overlay */}
          <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 opacity-20"></div>

          {/* layout math */}
          <div className="min-h-full flex flex-col p-4 sm:p-6 pb-8 sm:pb-20 relative z-40">
            {/* magic fix */}
            <div className="flex-1"></div>

            {/* The Content Block */}
            <div className="space-y-1 md:space-y-2 leading-tight opacity-90 max-w-full sm:max-w-4xl break-words w-full pt-8">
              <p>
                [ 0.000000] {SYSTEM_DATA.kernel || "Linux"} (
                {SYSTEM_DATA.author || "root"}) (gcc version 12.2.0) #1 SMP
                PREEMPT_DYNAMIC
              </p>
              <p className="text-blue-400">
                [ 0.000000] OS_INIT: {SYSTEM_DATA.osName} v{SYSTEM_DATA.version}
              </p>
              <p className="text-blue-400">
                [ 0.000000] BUILD_ID: {SYSTEM_DATA.buildNumber} (
                {SYSTEM_DATA.buildDate})
              </p>

              <p>
                [ 0.281924] x86/fpu: Supporting XSAVE feature 0x004: 'AVX
                registers'
              </p>

              <p className="text-red-500 mt-4 sm:mt-6 font-bold text-xs sm:text-base md:text-lg animate-pulse">
                [ 12.482012] Kernel panic - not syncing: Fatal exception in
                interrupt
              </p>

              <p className="text-red-400">
                [ 12.482012] DUMP_ERR:{" "}
                {this.state.error?.message || "Unknown Error"}
              </p>
              <p>
                [ 12.482012] CPU: 0 PID: 420 Comm: kworker/u2:1 Tainted: G W{" "}
                {SYSTEM_DATA.version}
              </p>
              <p>
                [ 12.482012] Hardware name: Ph0enix/VirtualBox, BIOS VirtualBox
                12/01/2006
              </p>
              <p>[ 12.482012] &lt;IRQ&gt;</p>
              <p>[ 12.482012] dump_stack+0x6d/0x90</p>
              <p>[ 12.482012] panic+0x101/0x298</p>
              <p>[ 12.482012] do_trap+0xdc/0x130</p>
              <p>[ 12.482012] do_error_trap+0x8b/0x110</p>
              <p>[ 12.482012] ? search_module_extables+0x2a/0x50</p>
              <p>[ 12.482012] ? handle_invalid_op+0x28/0x30</p>
              <p>[ 12.482012] &lt;/IRQ&gt;</p>
              <p>
                [ 12.482012] ---[ end Kernel panic - not syncing: Fatal
                exception in interrupt ]---
              </p>

              <div className="mt-8 sm:mt-12 text-red-500 font-bold tracking-widest text-[10px] sm:text-sm">
                _ SYSTEM HALTED.
              </div>

              {/* Recovery Options Block */}
              <div className="mt-6 sm:mt-8 border border-white/20 p-3 sm:p-4 inline-block bg-black/50 backdrop-blur-sm w-full sm:w-auto">
                <p className="text-neutral-400 mb-2 text-[8px] sm:text-xs uppercase tracking-widest">
                  Recovery Options:
                </p>
                <p className="text-white animate-pulse text-[9px] sm:text-sm">
                  &gt; Press [ENTER] to initiate force reboot...
                </p>
                <button
                  onClick={this.rebootSystem}
                  className="mt-4 w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-black px-4 py-3 sm:py-2 text-[10px] sm:text-xs font-bold transition-colors uppercase tracking-widest border border-white/20 sm:border-transparent active:scale-95"
                >
                  Execute Manual Reboot
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
