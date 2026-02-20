const LEVEL_CONFIG = [
  // --- TUTORIAL ---
  {
    id: "level-00",
    type: "terminal",
    title: "First Blood",
    desc: "Terminal Uplink Initialization",
    color: "bg-neutral-800 text-green-500",
    onStart: "Awaiting manual override code.",
    encryptedFlag: "666c61677b77656c636f6d655f746f5f706830656e69787d",
    hints: [
      {
        id: "h0-1",
        delay: 5,
        sender: "SYSTEM",
        text: "ALERT: Unauthorized connection established. Awaiting authentication token.",
      },
      {
        id: "h0-2",
        delay: 15,
        sender: "GLITCH",
        text: "Candidate, I'm masking your IP, but we have to move fast. Open the Terminal app.",
      },
      {
        id: "h0-3",
        delay: 45,
        sender: "GLITCH",
        text: "Type exactly this into the terminal: submit flag{welcome_to_ph0enix}",
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
    color: "bg-blue-100 text-blue-800",
    encryptedFlag:
      "666c61677b68746d6c5f636f6d6d656e74735f6172655f6e6f745f7365637572657d",
    hints: [
      {
        id: "h1-1",
        delay: 10,
        sender: "UNKNOWN",
        text: "The architects always leave their blueprints behind. Look beneath the rendered surface.",
      },
      {
        id: "h1-2",
        delay: 45,
        sender: "SYSTEM",
        text: "WARNING: Unsanitized HTML comments detected in viewport.",
      },
      {
        id: "h1-3",
        delay: 90,
        sender: "GLITCH",
        text: "Developers leave sticky notes in their markup.",
      },
    ],
  },
  {
    id: "level-02",
    type: "browser",
    title: "Design System V2",
    desc: "Contrast & Selection Tests",
    path: "design-v2",
    color: "bg-purple-100 text-purple-800",
    encryptedFlag: "666c61677b636f6e74726173745f69735f6b65797d",
    hints: [
      {
        id: "h2-1",
        delay: 15,
        sender: "SYSTEM",
        text: "ACCESSIBILITY ERROR: Contrast ratio 1:1 detected on element <p>.",
      },
      {
        id: "h2-2",
        delay: 60,
        sender: "GLITCH",
        text: "The SYSTEM just gave it away. They hid the note.Try highlighting the empty void.",
      },
    ],
  },
  {
    id: "level-03",
    type: "browser",
    title: "System Logs",
    desc: "Console Debugging",
    path: "logs",
    color: "bg-red-100 text-red-800",
    encryptedFlag: "666c61677b636f6e736f6c655f6c6f675f6d61737465727d",
    hints: [
      {
        id: "h3-1",
        delay: 15,
        sender: "SYSTEM",
        text: "Exception Caught: Variable stack dumped to Developer Console.",
      },
      {
        id: "h3-2",
        delay: 60,
        sender: "GLITCH",
        text: "We aren't looking at the HTML layout, JS leaves its own errors.",
      },
    ],
  },
  {
    id: "level-04",
    type: "browser",
    title: "Secure Transmission",
    desc: "Encoding Analysis",
    path: "secure-transmission",
    color: "bg-orange-100 text-orange-800",
    encryptedFlag:
      "666c61677b6261736536345f69735f6e6f745f656e6372797074696f6e7d",
    hints: [
      {
        id: "h4-1",
        delay: 15,
        sender: "UNKNOWN",
        text: "amateurs think every scrambled thing is encryption.",
      },
      {
        id: "h4-2",
        delay: 75,
        sender: "GLITCH",
        text: "That string UNKNOWN intercepted is base. You need to decode it.",
      },
    ],
  },
  {
    id: "level-05",
    type: "browser",
    title: "Corrupted Display",
    desc: "CSS Layer Analysis",
    path: "ads",
    color: "bg-yellow-100 text-yellow-800",
    encryptedFlag: "666c61677b7a5f696e6465785f68696465735f616c6c5f73696e737d",
    hints: [
      {
        id: "h5-1",
        delay: 15,
        sender: "SYSTEM",
        text: "UI_OVERLAY_BLOCKED: A high z element is preventing click events on the target payload.",
      },
      {
        id: "h5-2",
        delay: 80,
        sender: "GLITCH",
        text: "It's just an Adware, nuke it <DEL>",
      },
    ],
  },
  {
    id: "level-06",
    type: "browser",
    title: "Session Manager",
    desc: "Storage Inspection",
    path: "auth",
    color: "bg-green-100 text-green-800",
    encryptedFlag: "666c61677b636f6f6b6965735f6172655f74617374797d",
    hints: [
      {
        id: "h6-1",
        delay: 10,
        sender: "SYSTEM",
        text: "ACCESS DENIED. Local Storage key 'role' strictly requires 'admin' privileges.",
      },
      {
        id: "h6-2",
        delay: 60,
        sender: "UNKNOWN",
        text: "Did you find any snack? Just Bake your own, you become admin.",
      },
      {
        id: "h6-3",
        delay: 120,
        sender: "GLITCH",
        text: "Browser bakes its own tasty snacks, grab them",
      },
    ],
  },

  // --- TERMINAL LEVELS ---
  {
    id: "level-07",
    type: "terminal",
    title: "Hidden Services",
    desc: "Network Port Analysis",
    color: "bg-neutral-800 text-green-500",
    terminalCommands: ["nmap", "netstat"],
    onStart: "Suspicious activity detected on network.",
    encryptedFlag: "666c61677b706f72745f7363616e6e696e675f69735f66756e7d",
    hints: [
      {
        id: "h7-1",
        delay: 15,
        sender: "GLITCH",
        text: "Web games are over. We are into the internal network now <CMD>.",
      },
      {
        id: "h7-2",
        delay: 60,
        sender: "SYSTEM",
        text: "TRAFFIC ANOMALY: unrecognized routing active. review connections.",
      },
      {
        id: "h7-3",
        delay: 130,
        sender: "UNKNOWN",
        text: "Someone left a network backdoor open. find that network source, and pull the payload.",
      },
    ],
  },
  {
    id: "level-08",
    type: "terminal",
    title: "Data Recovery",
    desc: "File System Forensics",
    color: "bg-blue-900 text-blue-300",
    terminalCommands: ["grep"],
    onStart: "Logs are meant to be grep-ed. Investigate.",
    encryptedFlag:
      "666c61677b66696c655f73797374656d735f73746f72655f736563726574737d",
    hints: [
      {
        id: "h8-1",
        delay: 15,
        sender: "SYSTEM",
        text: "KERNEL_PANIC: secure_vault dumped core. Binary memory saved to crash/.",
      },
      {
        id: "h8-2",
        delay: 75,
        sender: "GLITCH",
        text: "Check Sysdump logs. It's just unreadable hex garbage but might come handy.",
      },
      {
        id: "h8-3",
        delay: 140,
        sender: "UNKNOWN",
        text: "Find the needle in the hex stack. filter the flag in binary noise.",
      },
    ],
  },
  {
    id: "level-09",
    type: "terminal",
    title: "Weaponization",
    desc: "File Permissions",
    color: "bg-red-900 text-red-400",
    terminalCommands: ["chmod"],
    onStart: "Dormant payload located in /root. Arm it.",
    encryptedFlag: "666c61677b63686d6f645f706f7765727d",
    hints: [
      {
        id: "h9-1",
        delay: 15,
        sender: "GLITCH",
        text: "We found the exploit binary inside the `/` directory. `./exploit.bin`",
      },
      {
        id: "h9-2",
        delay: 60,
        sender: "SYSTEM",
        text: "BASH ERROR: ./exploit.bin execution prevented. Missing 'x' flag in POSIX permissions.",
      },
      {
        id: "h9-3",
        delay: 140,
        sender: "UNKNOWN",
        text: "The system locked the file, use `+x` arg for execution bit.",
      },
    ],
  },
  {
    id: "level-10",
    type: "terminal",
    title: "Privilege Escalation",
    desc: "Identity Spoofing & TTY Bypass",
    color: "bg-purple-900 text-purple-400",
    terminalCommands: ["su"],
    onStart: "Initial foothold secured. Escalate to root.",
    encryptedFlag:
      "666c61677b726f6f745f70726976696c6567655f657363616c6174696f6e5f636f6d706c6574657d",
    hints: [
      {
        id: "h10-1",
        delay: 15,
        sender: "GLITCH",
        text: "We have execution, but we are just a regular user. Check your `~/todo` again. The admin left a note.",
      },
      {
        id: "h10-2",
        delay: 70,
        sender: "SYSTEM",
        text: "SECURITY WARNING: Plaintext credentials detected in `backups` directory.",
      },
      {
        id: "h10-3",
        delay: 140,
        sender: "UNKNOWN",
        text: "Sysadmins always reuse passwd. dB passwd is what u need, then run `su <user> <auth>` to steal their identity.",
      },
    ],
  },
  // --- OTHERS ---
  {
    id: "level-11",
    type: "osint",
    title: "Digital Footprint",
    desc: "EXIF Metadata Extraction",
    color: "bg-yellow-900 text-yellow-400",
    onStart: "Incoming file transfer detected.",
    encryptedFlag:
      "666c61677b657869665f646174615f6c65616b735f6c6f636174696f6e7d",
    hints: [
      {
        id: "h11-1",
        delay: 15,
        sender: "GLITCH",
        text: "We need to find where the rogue admin is hiding. I've intercepted a photo they took of a server rack.",
      },
      {
        id: "h11-2",
        delay: 60,
        sender: "SYSTEM",
        text: "ANALYSIS: Image contains some coded info.",
      },
      {
        id: "h11-3",
        delay: 130,
        sender: "UNKNOWN",
        text: "People always forget that Photos contain data, find the info/data string.",
      },
    ],
  },
  {
    id: "level-12",
    type: "osint",
    title: "Visual Forensics",
    desc: "Steganography & Filtering",
    color: "bg-red-900 text-red-400",
    onStart: "Target location identified. Accessing CCTV...",
    encryptedFlag: "666c61677b6e696768745f766973696f6e5f6163746976617465647d",
    hints: [
      {
        id: "h12-1",
        delay: 15,
        sender: "GLITCH",
        text: "The GPS coordinates matched a server facility. I've routed their internal cameras.",
      },
      {
        id: "h12-2",
        delay: 60,
        sender: "SYSTEM",
        text: "WARNING: Extremely low contrast detected on physical objects in Camera 01 viewport.",
      },
      {
        id: "h12-3",
        delay: 150,
        sender: "UNKNOWN",
        text: "Sometimes what is hidden in the dark can only be seen when you change your perspective. Use the optics filters on the camera feed.",
      },
    ],
  },
];

LEVEL_CONFIG.forEach((level, index) => {
  if (index === 0) {
    level.requires = null;
  } else {
    level.requires = LEVEL_CONFIG[index - 1].id;
  }
});

export { LEVEL_CONFIG };
