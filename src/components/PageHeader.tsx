import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  /** Breadcrumb segment shown after "Zertainity /" */
  title: string;
  /** Where the back button navigates. Defaults to "/" */
  backTo?: string;
  /** Show the back arrow button. Defaults to true */
  showBack?: boolean;
  /** Optional content rendered on the right side of the header */
  right?: ReactNode;
  /** Optional content rendered on the left side, before the back button/logo */
  left?: ReactNode;
  /** Optional additional classes for the inner wrapper */
  className?: string;
}

/**
 * Shared page header used across all non-home pages.
 * Provides a consistent glassmorphic sticky header with:
 * - Single <h1> (Zertainity / Title) for proper SEO
 * - Optional back button
 * - Optional right slot for page-specific actions
 */
export function PageHeader({
  title,
  backTo = "/",
  showBack = true,
  right,
  left,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className={`px-4 py-4 flex items-center justify-between ${className || "container mx-auto"}`}>
        <div className="flex items-center gap-3">
          {left}
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(backTo)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Zertainity
              <span className="text-muted-foreground mx-1.5">/</span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          </div>
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  );
}
