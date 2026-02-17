import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <GraduationCap className="h-7 w-7 text-foreground" />
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Zertainity
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/setup")}
                className="rounded-full px-5 font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="rounded-full px-5 font-medium"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
