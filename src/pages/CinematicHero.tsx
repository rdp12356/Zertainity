import React, { useEffect, useRef } from "react";
import { Globe, ArrowRight, Instagram, Twitter } from "lucide-react";

export default function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video with native looping and instant loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col font-sans">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dg3snayxc/video/upload/v1783172450/from_the_first_onwards_the_use_gwr_video_mvp_1_usotaa.mp4"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
        style={{ opacity: 1 }}
      />

      {/* Navigation */}
      <nav className="relative z-20 pl-6 pr-6 py-6 w-full">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          {/* Left: Logo & Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-white">
              <img 
                src="/logo-z.svg" 
                alt="Zertainity Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-lg">Asme</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</a>
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-4">
            <button className="text-white text-sm font-medium hover:text-white/80 transition-colors">
              Sign Up
            </button>
            <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight px-4"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        <div className="max-w-xl w-full space-y-4 flex flex-col items-center">
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="w-full liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base"
              required
            />
            <button 
              type="submit" 
              className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors flex items-center justify-center"
              aria-label="Submit"
            >
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-white text-sm leading-relaxed px-4">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-2">
            Read our manifesto
          </button>
        </div>
      </main>

      {/* Social Footer */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <a href="#" aria-label="Instagram" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Instagram size={20} />
        </a>
        <a href="#" aria-label="Twitter" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Twitter size={20} />
        </a>
        <a href="#" aria-label="Globe" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={20} />
        </a>
      </footer>
    </div>
  );
}
