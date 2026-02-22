const LEVEL_CONFIG = [
  // --- ACT 1: THE BREACH (Web & Fundamentals) ---
  {
    id: "first-blood",
    type: "terminal",
    title: "First Blood",
    desc: "Terminal Uplink Initialization",
    color: "bg-neutral-800 text-green-500",
    reward: 50,
    skipCost: 0,
    onStart: "Awaiting manual override code.",
    encryptedFlag: "666c61677b77656c636f6d655f746f5f706830656e69787d",
    hints: [
      {
        id: "h0-1",
        delay: 15,
        sender: "SYSTEM",
        text: "ERR: Uplink established but handshake missing.",
      },
      {
        id: "h0-2",
        delay: 45,
        sender: "GLITCH",
        text: "Alright, we're in. They think we're an internal node. Pop open the terminal.",
      },
      {
        id: "h0-3",
        delay: 60,
        sender: "GHOST",
        text: "The protocol expects a greeting. Say `submit flag{welcome_to_ph0enix}`.",
      },
    ],
  },
  {
    id: "html-source",
    type: "browser",
    path: "dev-notes",
    title: "Dev Team Notes",
    desc: "Source Code Inspection",
    color: "bg-blue-100 text-blue-800",
    reward: 100,
    skipCost: 50,
    encryptedFlag:
      "666c61677b68746d6c5f636f6d6d656e74735f6172655f6e6f745f7365637572657d",
    hints: [
      {
        id: "h1-1",
        delay: 30,
        sender: "GLITCH",
        text: "Look at this corporate landing page... bet they rushed it to production.",
      },
      {
        id: "h1-2",
        delay: 90,
        sender: "GHOST",
        text: "Architects always bury their mistakes. Look beneath the rendered surface.",
      },
      {
        id: "h1-3",
        delay: 150,
        sender: "GLITCH",
        text: "Dive into the page inspector. Some dev definitely left notes in the markup.",
      },
    ],
  },
  {
    id: "design-v2",
    type: "browser",
    path: "design-v2",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    color: "bg-purple-100 text-purple-800",
    reward: 150,
    skipCost: 75,
    encryptedFlag: "666c61677b636f6e74726173745f69735f6b65797d",
    hints: [
      {
        id: "h2-1",
        delay: 30,
        sender: "GLITCH",
        text: "Who designed this? There's a block that's literally unreadable.",
      },
      {
        id: "h2-2",
        delay: 90,
        sender: "SYSTEM",
        text: "Contrast ratio violation in UI component.",
      },
      {
        id: "h2-3",
        delay: 150,
        sender: "GHOST",
        text: "Sometimes to see what's hidden in the dark, you just have to drag your light across it.",
      },
    ],
  },
  {
    id: "corrupted-display",
    type: "browser",
    path: "ads",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    color: "bg-yellow-100 text-yellow-800",
    reward: 200,
    skipCost: 100,
    encryptedFlag: "666c61677b7a5f696e6465785f68696465735f616c6c5f73696e737d",
    hints: [
      {
        id: "h5-1",
        delay: 30,
        sender: "GLITCH",
        text: "Ugh, adware blocker. They locked the provision button.",
      },
      {
        id: "h5-2",
        delay: 90,
        sender: "GHOST",
        text: "An obstacle only exists if the document object model says it does.",
      },
      {
        id: "h5-3",
        delay: 150,
        sender: "GLITCH",
        text: "Use your tools to nuke adware overlay [DEL].",
      },
    ],
  },

  // --- ACT 2: THE ANALYST (Logs & OSINT) ---
  {
    id: "system-logs",
    type: "browser",
    path: "logs",
    title: "System Logs",
    desc: "Console Debugging",
    color: "bg-red-100 text-red-800",
    reward: 250,
    skipCost: 125,
    encryptedFlag: "666c61677b636f6e736f6c655f6c6f675f6d61737465727d",
    hints: [
      {
        id: "h3-1",
        delay: 45,
        sender: "GLITCH",
        text: "Sysadmins left the debug console running. Typical.",
      },
      {
        id: "h3-2",
        delay: 120,
        sender: "GHOST",
        text: "Too much noise. The truth is buried in the critical failures.",
      },
      {
        id: "h3-3",
        delay: 200,
        sender: "GLITCH",
        text: "Look for the crashes, filter the noise. The payload is in the stack trace.",
      },
    ],
  },
  {
    id: "secure-transmission",
    type: "browser",
    path: "secure-transmission",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    color: "bg-orange-100 text-orange-800",
    reward: 300,
    skipCost: 150,
    encryptedFlag:
      "666c61677b6261736536345f69735f6e6f745f656e6372797074696f6e7d",
    hints: [
      {
        id: "h4-1",
        delay: 45,
        sender: "GLITCH",
        text: "Intercepted a weird payload. Doesn't look like AES encryption.",
      },
      {
        id: "h4-2",
        delay: 120,
        sender: "GHOST",
        text: "Sixty-four ways to disguise a string base, all ending with an equal sign...",
      },
      {
        id: "h4-3",
        delay: 200,
        sender: "GLITCH",
        text: "It's standard encoding padding. Decoding might require dark web access.",
      },
    ],
  },
  {
    id: "digital-footprint",
    type: "osint",
    title: "Digital Footprint",
    desc: "EXIF Metadata Extraction",
    color: "bg-yellow-900 text-yellow-400",
    onStart: "Incoming file transfer detected.",
    reward: 350,
    skipCost: 175,
    encryptedFlag:
      "666c61677b657869665f646174615f6c65616b735f6c6f636174696f6e7d",
    hints: [
      {
        id: "h11-1",
        delay: 45,
        sender: "GLITCH",
        text: "Got a leak of their server rack.",
      },
      {
        id: "h11-2",
        delay: 120,
        sender: "GHOST",
        text: "Every photo whispers its secrets. Where it was ..., who saw it...",
      },
      {
        id: "h11-3",
        delay: 200,
        sender: "GLITCH",
        text: "Check the metadata props. Data never lies.",
      },
    ],
  },

  // --- ACT 3: THE SPY (Native & Manipulation) ---
  {
    id: "visual-forensics",
    type: "cctv",
    title: "Visual Forensics",
    desc: "Steganography & Filtering",
    color: "bg-red-900 text-red-400",
    onStart: "Target location identified. Accessing CCTV...",
    reward: 400,
    skipCost: 200,
    encryptedFlag: "666c61677b6e696768745f766973696f6e5f6163746976617465647d",
    hints: [
      {
        id: "h12-1",
        delay: 45,
        sender: "GLITCH",
        text: "Got the feed back online. The contrast in that server room is terrible.",
      },
      {
        id: "h12-2",
        delay: 120,
        sender: "GHOST",
        text: "The angle is skewed. The screen in the dark is broadcasting.",
      },
      {
        id: "h12-3",
        delay: 200,
        sender: "GLITCH",
        text: "Apply some optical filters to the feed, or just squint at that angled monitor.",
      },
    ],
  },
  {
    id: "session-manager",
    type: "browser",
    path: "auth",
    title: "Session Manager",
    desc: "Storage Inspection",
    color: "bg-green-100 text-green-800",
    reward: 450,
    skipCost: 225,
    encryptedFlag: "666c61677b636f6f6b6965735f6172655f74617374797d",
    hints: [
      {
        id: "h6-1",
        delay: 45,
        sender: "GLITCH",
        text: "They want an admin badge. We're just guests.",
      },
      {
        id: "h6-2",
        delay: 120,
        sender: "GHOST",
        text: "I can hack admin's system but I need some snacks/cookies as penalty.",
      },
      {
        id: "h6-3",
        delay: 200,
        sender: "GLITCH",
        text: "Even you don't have snack yourself, steal some from local storage.",
      },
    ],
  },

  // --- ACT 4: DEEP NETWORK (Terminal) ---
  {
    id: "hidden-services",
    type: "terminal",
    title: "Hidden Services",
    desc: "Network Port Analysis",
    color: "bg-neutral-800 text-green-500",
    terminalCommands: ["nmap", "netstat"],
    onStart: "Suspicious activity detected on network.",
    reward: 500,
    skipCost: 250,
    encryptedFlag: "666c61677b706f72745f7363616e6e696e675f69735f66756e7d",
    hints: [
      {
        id: "h7-1",
        delay: 60,
        sender: "GLITCH",
        text: "We're deep enough now. Time to map the internal network.",
      },
      {
        id: "h7-2",
        delay: 150,
        sender: "GHOST",
        text: "There are doors they left open. Listening on non-standard entry points...",
      },
      {
        id: "h7-3",
        delay: 240,
        sender: "GLITCH",
        text: "Scan the network map. See what's running on the strange, high-numbered ports.",
      },
    ],
  },
  {
    id: "data-recovery",
    type: "terminal",
    title: "Data Recovery",
    desc: "File System Forensics",
    color: "bg-blue-900 text-blue-300",
    terminalCommands: ["grep"],
    onStart: "Logs are meant to be grep-ed. Investigate.",
    reward: 550,
    skipCost: 275,
    encryptedFlag:
      "666c61677b66696c655f73797374656d735f73746f72655f736563726574737d",
    hints: [
      {
        id: "h8-1",
        delay: 60,
        sender: "GLITCH",
        text: "A core dump? It's huge. We can't read this manually.",
      },
      {
        id: "h8-2",
        delay: 150,
        sender: "GHOST",
        text: "Needles in haystacks. You must ask the terminal to filter the garbage for you.",
      },
      {
        id: "h8-3",
        delay: 240,
        sender: "GLITCH",
        text: "Use text-searching commands on the dump file to isolate our specific pattern.",
      },
    ],
  },

  // --- ACT 5: THE BOSS ---
  {
    id: "project-pandora",
    type: "browser",
    path: "tor://pandora.onion",
    title: "Project Pandora",
    desc: "Dual-Auth Final Enclave",
    color: "bg-red-950 text-red-500",
    reward: 5000,
    skipCost: 2500,
    encryptedFlag:
      "666c61677b706830656e69785f726562697274685f636f6d706c6574657d",
    terminalCommands: ["sys_auth"],
    onStart:
      "CRITICAL ALERT: Final enclave unlocked. Route connection to tor://pandora.onion immediately.",
    hints: [
      {
        id: "hM2-1",
        delay: 30,
        sender: "GHOST",
        text: "Welcome to tor://pandora.onion. I locked it behind an 800 cR Dark Market cipher. Good luck affording it.",
      },
      {
        id: "hM2-2",
        delay: 90,
        sender: "GLITCH",
        text: "Wait, check your Mail app! Did someone just send you a bypass script?!",
      },
      {
        id: "hM2-3",
        delay: 200,
        sender: "SYSTEM",
        text: "SECURITY WARNING: Review rule #1 in your Notes application before executing unknown terminal payloads.",
      },
    ],
  },
];

LEVEL_CONFIG.forEach((level, index) => {
  if (index === 0) level.requires = null;
  else level.requires = LEVEL_CONFIG[index - 1].id;
});

export { LEVEL_CONFIG };
