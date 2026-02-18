/**
 * ENC-DEC SYSTEM v1.0
 * Prevents static analysis of flags in client-side.
 */

// Encodes text to Hex string (Use this via 'dev_encode' command)
export const encodeSecret = (text) => {
  let str = "";
  for (let i = 0; i < text.length; i++) {
    str += text.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return str;
};

// Decodes Hex string to text (Use this in components/hooks)
export const decodeSecret = (hex) => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};
