import { GraduationCap, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const ComingSoon = () => {


  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden" role="main">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Professional Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <GraduationCap className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Zertainity
              </h1>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Professional Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Coming Soon</span>
        </motion.div>

        {/* Professional Title */}
        <motion.h2 
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Revolutionizing
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Career Guidance
          </span>
        </motion.h2>

        {/* Professional Description */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Harnessing the power of AI to transform how students discover their perfect career path. 
          <br className="hidden md:block" />
          <span className="text-primary font-medium">The future of education is coming.</span>
        </motion.p>

        {/* Professional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: TrendingUp, title: "AI-Driven", description: "Advanced algorithms for personalized career matching" },
            { icon: Sparkles, title: "Smart Analytics", description: "Comprehensive assessment of skills and interests" },
            { icon: GraduationCap, title: "Expert Guidance", description: "Professional insights for educational pathways" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/20 hover:border-primary/30 transition-all duration-300"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default ComingSoon;
