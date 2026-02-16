import { useEffect } from "react";

export default function Level06() {
  useEffect(() => {
    // This sets a real cookie in their browser
    document.cookie = "session_id=flag{cookies_are_tasty}; path=/";
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">
        We can't log you in because your session token is invalid.
      </p>
      <div className="bg-red-100 p-4 border border-red-400 text-red-700 inline-block">
        Error: 403 Forbidden
      </div>
      <p className="mt-8 text-sm text-gray-500">
        (Hint: Check your Storage/Cookies in DevTools)
      </p>
    </div>
  );
}
