import { Component } from "react";

export default class SystemCrash extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("KERNEL PANIC:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black text-white font-mono text-sm p-4 z-[99999] overflow-hidden select-none cursor-none flex flex-col justify-end pb-20">
          <div className="space-y-1 leading-tight opacity-90">
            <p>
              [ 0.000000] Linux version 6.9.1-hardened (root@ph0enix) (gcc
              version 12.2.0) #1 SMP PREEMPT_DYNAMIC
            </p>
            <p>
              [ 0.281920] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating
              point registers'
            </p>
            <p>
              [ 0.281922] x86/fpu: Supporting XSAVE feature 0x002: 'SSE
              registers'
            </p>
            <p>
              [ 0.281924] x86/fpu: Supporting XSAVE feature 0x004: 'AVX
              registers'
            </p>
            <p className="text-red-500 mt-4 font-bold">
              [ 12.482012] Kernel panic - not syncing: Fatal exception in
              interrupt
            </p>
            <p>
              [ 12.482012] DUMP_ERR:{" "}
              {this.state.error?.message || "Unknown Error"}
            </p>
            <p>
              [ 12.482012] CPU: 0 PID: 420 Comm: kworker/u2:1 Tainted: G W 6.9.1
              #1
            </p>
            <p>
              [ 12.482012] Hardware name: Ph0enix/VirtualBox, BIOS VirtualBox
              12/01/2006
            </p>
            <p>[ 12.482012] Call Trace:</p>
            <p>[ 12.482012] &lt;IRQ&gt;</p>
            <p>[ 12.482012] dump_stack+0x6d/0x90</p>
            <p>[ 12.482012] panic+0x101/0x298</p>
            <p>[ 12.482012] do_trap+0xdc/0x130</p>
            <p>[ 12.482012] do_error_trap+0x8b/0x110</p>
            <p>[ 12.482012] ? search_module_extables+0x2a/0x50</p>
            <p>[ 12.482012] ? handle_invalid_op+0x28/0x30</p>
            <p>[ 12.482012] &lt;/IRQ&gt;</p>
            <p>
              [ 12.482012] ---[ end Kernel panic - not syncing: Fatal exception
              in interrupt ]---
            </p>

            <div className="mt-8 animate-pulse text-red-500">
              _ system halted. manual restart required.
            </div>

            {/* Hidden restart button for user sanity */}
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 bg-white text-black px-2 text-xs cursor-pointer"
            >
              [ FORCE REBOOT ]
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
