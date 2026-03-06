import { useState, useRef, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Share2, Music2, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock Data for Reels
const MOCK_REELS = [
    {
        id: "r1",
        career: "Software Engineer",
        creator: "@code_ninja",
        description: "A day in my life at a FAANG company in India! 🚀 #softwareengineer #dayinthelife",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Placeholder public video
        likes: "45.2K",
        comments: "1.2K",
        audio: "Original Audio - Tech Beats"
    },
    {
        id: "r2",
        career: "Medical Doctor (MBBS)",
        creator: "@dr_surya",
        description: "14 hour shift in the ER! 🏥 Here is what nobody tells you about medical school. #neet #mbbs",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        likes: "128K",
        comments: "4.5K",
        audio: "Trending - Chill Vibes"
    },
    {
        id: "r3",
        career: "UI/UX Designer",
        creator: "@design_with_riya",
        description: "Figma tips & my remote work setup in Bangalore 🎨 #design #remote",
        videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        likes: "89K",
        comments: "890",
        audio: "Lofi Study Beats"
    }
];

const CareerReels = () => {
    const navigate = useNavigate();
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        // Autoplay the video currently in view, pause others
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            
            if (index === currentReelIndex) {
                video.play().catch(e => console.log("Autoplay blocked:", e));
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [currentReelIndex]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollPosition = container.scrollTop;
        const windowHeight = container.clientHeight;
        
        // Calculate which reel is currently most visible
        const index = Math.round(scrollPosition / windowHeight);
        if (index !== currentReelIndex && index >= 0 && index < MOCK_REELS.length) {
            setCurrentReelIndex(index);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const togglePlayPause = () => {
        const currentVideo = videoRefs.current[currentReelIndex];
        if (!currentVideo) return;

        if (currentVideo.paused) {
            currentVideo.play();
        } else {
            currentVideo.pause();
        }
    };
    
    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Added to your liked reels!");
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="bg-black min-h-screen text-white fixed inset-0 z-50 flex flex-col">
            <PageSEO
                title="Career Reels - A Day in the Life"
                description="Watch short videos about different career paths. Experience a day in the life of Software Engineers, Doctors, Designers and more."
                keywords="career discovery, day in the life, career videos, job insights, profession reels"
                canonical="/career-reels"
                customSchema={{
                    "@type": "ItemList",
                    "itemListElement": MOCK_REELS.map((reel, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "VideoObject",
                            "name": reel.career,
                            "description": reel.description,
                            "thumbnailUrl": "https://www.zertainity.in/logo.svg",
                            "contentUrl": reel.videoUrl,
                            "uploadDate": "2024-03-06T08:00:00Z"
                        }
                    }))
                }}
            />

            {/* Top Navigation */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:bg-white/20 rounded-full h-10 w-10">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="font-bold text-lg tracking-wide uppercase">Shorts / Reels</div>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Video Feed Container (Snap Scrolling) */}
            <div 
                className="flex-1 overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative"
                onScroll={handleScroll}
                style={{ scrollBehavior: 'smooth' }}
            >
                {/* AdSense Sponsored Item at position #1 */}
                <div className="h-full w-full snap-start snap-always flex items-center justify-center bg-zinc-950 relative">
                    <div className="text-center p-8 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-bold tracking-widest uppercase">
                            Sponsored
                        </div>
                        {/* Google AdSense Unit Placeholder */}
                        <div className="aspect-[9/16] w-[280px] max-h-[500px] bg-zinc-900/50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-zinc-800 mx-auto shadow-2xl">
                             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Share2 className="h-8 w-8 text-primary/40" />
                             </div>
                             <span className="text-zinc-500 text-[10px] font-mono mb-2">ADSENSE_VERTICAL_REEL_UNIT</span>
                             <div className="w-32 h-2 bg-zinc-800 rounded-full mb-2"></div>
                             <div className="w-24 h-2 bg-zinc-800 rounded-full"></div>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-[200px] mx-auto leading-relaxed italic">
                            Help us keep Zertainity free for every Indian student.
                        </p>
                        <Button 
                            variant="ghost" 
                            className="mt-4 text-primary animate-bounce" 
                            onClick={() => {
                                const container = document.querySelector('.overflow-y-scroll');
                                if (container) container.scrollTop += container.clientHeight;
                            }}
                        >
                            Swipe to Discover <Music2 className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {MOCK_REELS.map((reel, index) => (
                    <div 
                        key={reel.id} 
                        className="h-full w-full snap-start snap-always relative flex items-center justify-center bg-zinc-900"
                        onClick={togglePlayPause}
                    >
                        {/* Video Element */}
                        <video
                            ref={(el) => {
                                videoRefs.current[index] = el;
                            }}
                            src={reel.videoUrl}
                            className="h-full w-full object-cover"
                            loop
                            muted={isMuted}
                            playsInline
                        />

                        {/* Mute/Unmute Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full opacity-0 pointer-events-none transition-opacity duration-300">
                            {isMuted ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
                        </div>

                        {/* Mute Toggle Button */}
                        <button 
                            onClick={toggleMute}
                            className="absolute top-20 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-full"
                        >
                            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>

                        {/* Right Action Bar */}
                        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
                            <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
                                <div className="p-3 rounded-full bg-black/20 backdrop-blur-md group-hover:bg-white/20 transition-colors">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-semibold">{reel.likes}</span>
                            </button>
                            
                            <button className="flex flex-col items-center gap-1 group" onClick={(e) => { e.stopPropagation(); toast("Comments coming soon!"); }}>
                                <div className="p-3 rounded-full bg-black/20 backdrop-blur-md group-hover:bg-white/20 transition-colors">
                                    <MessageCircle className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-semibold">{reel.comments}</span>
                            </button>

                            <button onClick={handleShare} className="flex flex-col items-center gap-1 group">
                                <div className="p-3 rounded-full bg-black/20 backdrop-blur-md group-hover:bg-white/20 transition-colors">
                                    <Share2 className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-semibold">Share</span>
                            </button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-4 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm font-semibold text-xs rounded-sm">
                                    {reel.career}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg drop-shadow-md">{reel.creator}</h3>
                            <p className="text-sm text-white/90 drop-shadow-sm max-w-[80%] line-clamp-2">
                                {reel.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-2 text-white/80">
                                <Music2 className="h-4 w-4 animate-pulse" />
                                <span className="text-xs font-medium marquee-text overflow-hidden whitespace-nowrap">
                                    {reel.audio}
                                </span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default CareerReels;
