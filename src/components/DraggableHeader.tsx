import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BezierLink } from "./BezierLink";

export const DraggableHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Read auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Track scroll position to add background/border on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Assessment", path: "/education-level" },
    { label: "Careers", path: "/careers" },
    { label: "Methodology", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Premium Full-Width Sticky Top Header */}
      <header
        className={`fixed top-0 inset-x-0 z-[1000] w-full transition-all duration-300 border-b ${
          scrolled
            ? "border-[color:var(--z-border)]/40 bg-[color:var(--z-canvas)]/85 backdrop-blur-xl shadow-premium-sm"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1080px] h-20 px-6 flex items-center justify-between">
          {/* Logo */}
          <span
            onClick={() => handleNavigation("/")}
            className="cursor-pointer text-[12px] font-semibold tracking-[0.25em] uppercase text-[color:var(--z-ink)] hover:opacity-80 transition-opacity"
          >
            Zertainity
          </span>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <BezierLink
                key={item.path}
                label={item.label}
                onClick={() => handleNavigation(item.path)}
                className={`text-xs font-light tracking-wide transition-colors ${
                  location.pathname === item.path
                    ? "text-[color:var(--z-ink)] font-normal"
                    : "text-[color:var(--z-ink-secondary)] hover:text-[color:var(--z-ink)]"
                }`}
              />
            ))}
          </nav>

          {/* Desktop Auth CTA */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <span
                onClick={() => handleNavigation("/settings")}
                className="cursor-pointer text-xs font-light text-[color:var(--z-ink-secondary)] hover:text-[color:var(--z-ink)] transition-colors"
              >
                Account
              </span>
            ) : (
              <span
                onClick={() => handleNavigation("/auth")}
                className="cursor-pointer text-xs font-light text-[color:var(--z-ink-secondary)] hover:text-[color:var(--z-ink)] transition-colors"
              >
                Sign in
              </span>
            )}

            <button
              onClick={() => handleNavigation("/education-level")}
              className="flex items-center gap-1.5 bg-[color:var(--z-ink)] hover:bg-[color:var(--z-ink-secondary)] text-[color:var(--z-canvas)] text-[11px] font-normal tracking-wide px-4 py-2 rounded-full transition-all duration-250 active:scale-[0.96] shadow-sm"
            >
              Start Assessment
              <ArrowUpRight size={12} className="opacity-80" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-[color:var(--z-border)] text-[color:var(--z-ink)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 z-[990] bg-[color:var(--z-canvas)] px-8 pt-28 pb-32 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 mt-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--z-ink-muted)] border-b border-[color:var(--z-border)] pb-2 mb-2">
                Navigation
              </span>
              {navItems.map((item) => (
                <span
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`text-2xl font-light py-2 text-[color:var(--z-ink)] cursor-pointer ${
                    location.pathname === item.path ? "font-normal border-l-2 border-[color:var(--z-ink)] pl-3" : ""
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--z-ink-muted)] border-b border-[color:var(--z-border)] pb-2 mb-2">
                Account
              </span>
              {isAuthenticated ? (
                <span
                  onClick={() => handleNavigation("/settings")}
                  className="text-lg font-light text-[color:var(--z-ink)] cursor-pointer"
                >
                  Account Settings
                </span>
              ) : (
                <span
                  onClick={() => handleNavigation("/auth")}
                  className="text-lg font-light text-[color:var(--z-ink)] cursor-pointer"
                >
                  Sign in to Zertainity
                </span>
              )}
              <button
                onClick={() => handleNavigation("/education-level")}
                className="w-full flex items-center justify-center gap-1.5 bg-[color:var(--z-ink)] text-[color:var(--z-canvas)] text-sm font-normal py-3 rounded-full mt-4"
              >
                Start Assessment
                <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
