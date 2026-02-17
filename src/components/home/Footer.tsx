import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto px-6 text-center text-muted-foreground space-y-3">
        <div className="flex justify-center gap-6 text-sm">
          <button onClick={() => navigate("/careers")} className="hover:text-foreground transition-colors">Careers</button>
          <button onClick={() => navigate("/contact")} className="hover:text-foreground transition-colors">Contact</button>
          <button onClick={() => navigate("/quiz")} className="hover:text-foreground transition-colors">Quiz</button>
        </div>
        <p className="text-sm font-light">© 2026 Zertainity. Empowering students to find their path.</p>
        <p className="text-xs text-muted-foreground">Created by Viney Ragesh & Johan Manoj</p>
      </div>
    </footer>
  );
};

export default Footer;
