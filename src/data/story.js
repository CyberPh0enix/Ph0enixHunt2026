export const CONTACTS = [
  {
    id: "unknown",
    name: "Unknown Source",
    avatar: "https://ui-avatars.com/api/?name=?",
    lastMessage: "The system is compromised...",
    unread: 2,
    messages: [
      { id: 1, text: "Are you in?", sender: "them", time: "10:42 PM" },
      {
        id: 2,
        text: "I managed to bypass the firewall, but they traced me.",
        sender: "them",
        time: "10:43 PM",
      },
      {
        id: 3,
        text: "I hid the first flag in the boot sequence.",
        sender: "them",
        time: "10:45 PM",
      },
      {
        id: 4,
        text: "Check the terminal logs carefully.",
        sender: "them",
        time: "10:45 PM",
      },
    ],
  },
  {
    id: "admin",
    name: "SysAdmin",
    avatar: "https://ui-avatars.com/api/?name=SA&background=random",
    lastMessage: "DO NOT SHARE PASSWORDS",
    unread: 0,
    messages: [
      {
        id: 1,
        text: "Reminder: The server password was changed to 'hunter2'.",
        sender: "them",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "Wait, that's not secure.",
        sender: "me",
        time: "Yesterday",
      },
      {
        id: 3,
        text: "It's fine, nobody reads these logs.",
        sender: "them",
        time: "Yesterday",
      },
    ],
  },
];
