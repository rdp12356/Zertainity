import { GraduationCap } from "lucide-react";

const ComingSoon = () => {


  return (
    <div className="min-h-screen bg-background flex items-center justify-center" role="main">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 border-b border-border/40 bg-card/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-foreground" />
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                Zertainity
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero with animated ocean gradient */}
      <section className="relative overflow-hidden gradient-hero animate-gradient w-full h-screen flex items-center">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[hsl(190_80%_40%/0.12)] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(210_70%_50%/0.08)] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[hsl(185_60%_45%/0.06)] blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Text overlay */}
            <p className="animate-float-up text-sm font-medium tracking-widest uppercase text-[hsl(185_60%_70%)]">
              Coming Soon
            </p>
            <h2 className="animate-float-up-delay-1 text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
              The Future of
              <span className="block mt-2 bg-gradient-to-r from-[hsl(185_80%_65%)] to-[hsl(200_80%_75%)] bg-clip-text text-transparent">
                Career Guidance
              </span>
            </h2>
            <p className="animate-float-up-delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
              We're building something amazing. Get ready to discover your perfect career path with AI-powered guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
