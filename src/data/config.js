export const LEVEL_CONFIG = [
  // --- TUTORIAL ---
  {
    id: "level-00",
    type: "terminal",
    title: "First Blood",
    desc: "Terminal Uplink Initialization",
    requires: null, // First level has no requirements
    color: "bg-neutral-800 text-green-500",
    onStart: "Awaiting manual override code.",
    encryptedFlag: "666c61677b77656c636f6d655f746f5f706830656e69787d",
    hints: [
      {
        id: "h0-1",
        delay: 5,
        sender: "GLITCH",
        text: "Candidate, I've secured a connection. Let's make sure your terminal works. Open the Terminal app and type exactly this: submit flag{welcome_to_ph0enix}",
      },
      {
        id: "h0-2",
        delay: 30,
        sender: "SYSTEM",
        text: "WARNING: Terminal idle. Awaiting 'submit' command.",
      },
    ],
  },

  // --- BROWSER LEVELS ---
  {
    id: "level-01",
    type: "browser",
    title: "Dev Team Notes",
    desc: "HTML Source Code Inspection",
    path: "dev-notes",
    requires: null,
    color: "bg-blue-100 text-blue-800",
    encryptedFlag:
      "666c61677b68746d6c5f636f6d6d656e74735f6172655f6e6f745f7365637572657d",
    hints: [
      {
        id: "h1-1",
        delay: 2,
        sender: "GLITCH",
        text: "I've breached the firewall. The visual interface is locked, but the architect left the blueprints exposed. Look *beneath* the rendered page.",
      },
      {
        id: "h1-2",
        delay: 45,
        sender: "UNKNOWN",
        text: "Developers are so careless. They leave sticky notes in the HTML comments thinking nobody checks the Source.",
      },
    ],
  },
  {
    id: "level-02",
    type: "browser",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    path: "design-v2",
    requires: "level-01",
    color: "bg-purple-100 text-purple-800",
    encryptedFlag: "666c61677b636f6e74726173745f69735f6b65797d",
    hints: [
      {
        id: "h2-1",
        delay: 5,
        sender: "GLITCH",
        text: "This page looks empty, but my data stream shows a 4KB payload. There is information here, camouflaged.",
      },
      {
        id: "h2-2",
        delay: 60,
        sender: "UNKNOWN",
        text: "Invisible Ink. A classic spy trick. Highlight the void to see the truth.",
      },
    ],
  },
  {
    id: "level-03",
    type: "browser",
    title: "System Logs",
    desc: "Console Debugging",
    path: "logs",
    requires: "level-02",
    color: "bg-red-100 text-red-800",
    encryptedFlag: "666c61677b636f6e736f6c655f6c6f675f6d61737465727d",
    hints: [
      {
        id: "h3-1",
        delay: 10,
        sender: "SYSTEM",
        text: "ALERT: Variable 'flag' is undefined in Viewport. Dumping stack trace to Debug Console.",
      },
      {
        id: "h3-2",
        delay: 90,
        sender: "GLITCH",
        text: "Stop looking at the page content. The devs are chatting in the engine room. Pop the hood and eavesdrop on the console.",
      },
    ],
  },
  {
    id: "level-04",
    type: "browser",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    path: "secure-transmission",
    requires: "level-03",
    color: "bg-orange-100 text-orange-800",
    encryptedFlag:
      "666c61677b6261736536345f69735f6e6f745f656e6372797074696f6e7d",
    hints: [
      {
        id: "h4-1",
        delay: 10,
        sender: "GLITCH",
        text: "I intercepted a scrambled message. It ends with an '=' sign. That's not an encryption tho...",
      },
      {
        id: "h4-2",
        delay: 75,
        sender: "SYSTEM",
        text: "Encoding Scheme Detected: Base64. Decryption tools are available in the public domain.",
      },
    ],
  },
  {
    id: "level-05",
    type: "browser",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    path: "ads",
    requires: "level-04",
    color: "bg-yellow-100 text-yellow-800",
    encryptedFlag: "666c61677b7a5f696e6465785f68696465735f616c6c5f73696e737d",
    hints: [
      {
        id: "h5-1",
        delay: 15,
        sender: "GLITCH",
        text: "I can see a button in the code, but the Advertisement is annoying.",
      },
      {
        id: "h5-2",
        delay: 90,
        sender: "DEV",
        text: "Who put this overlay here? It's blocking the UI! Just delete it, I don't care anymore.",
      },
    ],
  },
  {
    id: "level-06",
    type: "browser",
    title: "Session Manager",
    desc: "Storage Inspection",
    path: "auth",
    requires: "level-05",
    color: "bg-green-100 text-green-800",
    encryptedFlag: "666c61677b636f6f6b6965735f6172655f74617374797d",
    hints: [
      {
        id: "h6-1",
        delay: 10,
        sender: "SYSTEM",
        text: "ACCESS DENIED. Session ID 'guest' has insufficient privileges. Admin clearance required.",
      },
      {
        id: "h6-2",
        delay: 100,
        sender: "GLITCH",
        text: "They store your clearance in snacks. Bake your own snack, you become the admin.",
      },
    ],
  },

  // --- TERMINAL LEVELS ---
  {
    id: "level-07",
    type: "terminal",
    title: "Hidden Services",
    desc: "Network Port Analysis",
    requires: "level-06",
    color: "bg-neutral-800 text-green-500",
    terminalCommands: ["nmap", "netstat"],
    onStart: "Suspicious activity detected on network.",
    encryptedFlag: "666c61677b706f72745f7363616e6e696e675f69735f66756e7d",
    hints: [
      {
        id: "h7-1",
        delay: 5,
        sender: "GLITCH",
        text: "We are done with the web. The real secrets are on the network layer. Open the console.",
      },
      {
        id: "h7-2",
        delay: 45,
        sender: "SYSTEM",
        text: "Anomaly detected: Unregistered service listening on 127.0.0.1. Port number obscured.",
      },
      {
        id: "h7-3",
        delay: 120,
        sender: "GLITCH",
        text: "The call is coming from *inside* the house. Map the 'localhost' network. Find the open port.",
      },
    ],
  },
  {
    id: "level-08",
    type: "terminal",
    title: "Data Recovery",
    desc: "File System Forensics",
    requires: "level-07",
    color: "bg-blue-900 text-blue-300",
    terminalCommands: ["grep"],
    onStart: "Logs are meant to be grep-ed. Investigate.",
    encryptedFlag:
      "666c61677b66696c655f73797374656d735f73746f72655f736563726574737d",
    hints: [
      {
        id: "h8-1",
        delay: 10,
        sender: "GLITCH",
        text: "We found the port. Now we need the data.",
      },
      {
        id: "h8-2",
        delay: 90,
        sender: "SYSTEM",
        text: "WARNING: File '*******.old' is too large for standard display. Read operation timed out.",
      },
      {
        id: "h8-3",
        delay: 180,
        sender: "UNKNOWN",
        text: "You can't just read the whole haystack. You need a magnet. Filter the file for the pattern 'flag'.",
      },
    ],
  },
];
