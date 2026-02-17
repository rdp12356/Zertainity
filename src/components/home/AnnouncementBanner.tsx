import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-foreground text-background relative overflow-hidden"
        >
          <div className="container mx-auto px-6 py-2.5 flex items-center justify-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">
              🎓 New: AI-powered career matching is live — discover your dream path today!
            </span>
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
