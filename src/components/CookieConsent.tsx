import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Keep the key and event in sync with the bootstrap in index.html.
const CONSENT_KEY = "zertainity_optional_cookies";
const CHANGED_EVENT = "zertainity:tracking-consent";
const OPEN_EVENT = "zertainity:open-cookie-settings";
type ConsentChoice = "accepted" | "declined";

function readChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(readChoice);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openPreferences = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_EVENT, openPreferences);
  }, []);

  const saveChoice = (next: ConsentChoice) => {
    const previous = readChoice();
    try {
      window.localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // Storage disabled: optional tracking remains blocked.
    }
    setChoice(next);
    setIsOpen(false);
    window.dispatchEvent(new Event(CHANGED_EVENT));
    // Previously loaded analytics scripts cannot reliably be unloaded from a SPA.
    // Reload to ensure withdrawn consent stops further client tracking.
    if (previous === "accepted" && next === "declined") {
      window.location.reload();
    }
  };

  if (choice !== null && !isOpen) return null;

  return (
    <section
      role="dialog"
      aria-label="Optional cookie preferences"
      className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-6"
    >
      <h2 className="text-lg font-semibold text-foreground">Your privacy matters</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Essential authentication and security features work without optional cookies.
        You can choose whether we load Google Analytics, Microsoft Clarity and optional advertising scripts.
        You can change this choice anytime in the footer.
      </p>
      <Link to="/privacy-policy" className="mt-2 inline-block text-sm underline text-primary">
        Read our privacy policy
      </Link>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          onClick={() => saveChoice("declined")}
        >
          Reject optional cookies
        </button>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          onClick={() => saveChoice("accepted")}
        >
          Accept optional cookies
        </button>
      </div>
    </section>
  );
}
