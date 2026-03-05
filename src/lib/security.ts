import CryptoJS from "crypto-js";

// A hardcoded secret key for localStorage encryption. 
// In a real prod app this would ideally be obfuscated or assembled at runtime,
// but the Vite javascript-obfuscator will scramble this string in the build anyway.
const SECRET_KEY = "zt-secure-v1-984hd&*#dha981";

export const secureStorage = {
    setItem: (key: string, value: any) => {
        try {
            const stringValue = JSON.stringify(value);
            const encryptedValue = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error("Error saving data securely");
        }
    },

    getItem: (key: string) => {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;

            const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            return JSON.parse(decryptedString);
        } catch (error) {
            console.error("Error reading secure data");
            return null;
        }
    },

    removeItem: (key: string) => {
        localStorage.removeItem(key);
    }
};

/**
 * Initializes anti-tampering measures. 
 * Should be called once at the root of the application.
 */
export const initSecurityMeasures = () => {
    // Only run in production to allow local development
    if (import.meta.env.MODE !== 'production') return;

    // 1. Block right click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 2. Block common developer tool shortcuts
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
        }

        // Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
        }

        // Ctrl+Shift+J (Windows) or Cmd+Option+J (Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
        }

        // Ctrl+U (View Source)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
        }
    });

    // 3. Simple Debugger Trap Loop
    // This continuously breaks the application if DevTools is open.
    // The javascript-obfuscator plugin also handles this, but having an explicit layer adds redundancy.
    setInterval(() => {
        const t = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        if (performance.now() - t > 100) {
            // If the debugger hit paused execution, it means dev tools are open.
            console.clear();
            document.body.innerHTML = 'Security violation detected. Please close developer tools.';
            window.location.reload();
        }
    }, 2000);
};
