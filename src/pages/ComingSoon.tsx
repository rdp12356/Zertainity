import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Rocket, Star, Zap, Calendar, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { theme } = useTheme();

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    initial: { boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" },
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.5)",
        "0 0 40px rgba(59, 130, 246, 0.8)",
        "0 0 60px rgba(59, 130, 246, 0.5)",
        "0 0 20px rgba(59, 130, 246, 0.5)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-screen opacity-70"
            style={{
              background: `radial-gradient(circle, ${['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][i]} 0%, transparent 70%)`,
              width: `${Math.random() * 400 + 100}px`,
              height: `${Math.random() * 400 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Rocket Icon */}
        <motion.div
          variants={floatVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <motion.div
            variants={glowVariants}
            initial="initial"
            animate="animate"
            className="p-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Rocket className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
        >
          Zertainity
        </motion.h1>

        {/* Subtitle with Typing Effect */}
        <motion.div
          variants={itemVariants}
          className="text-2xl md:text-3xl text-center mb-8"
        >
          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            Something amazing is
          </span>
          <motion.span
            className="ml-2 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            coming soon
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className={`text-center max-w-2xl mb-12 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          We're building the future of education and career guidance. Get ready to embark on a transformative journey that will shape your path to success.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-4 gap-4 mb-12"
        >
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white/50 backdrop-blur-md border border-gray-200'}`}
            >
              <motion.div
                key={item.value}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                {item.value}
              </motion.div>
              <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Email Subscription */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubscribe}
          className="w-full max-w-md mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/50 border-gray-200'} backdrop-blur-md focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            />
            <Button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </div>
          {isSubscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-green-500 text-center"
            >
              🎉 Thanks for subscribing!
            </motion.p>
          )}
        </motion.form>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12"
        >
          {[
            { icon: Target, title: "Precision Learning", description: "AI-powered personalized education paths" },
            { icon: Users, title: "Expert Guidance", description: "Connect with industry professionals" },
            { icon: Star, title: "Career Success", description: "Land your dream job with confidence" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
              }}
              className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white/50 backdrop-blur-md border border-gray-200'} transition-all duration-300`}
            >
              <feature.icon className="w-8 h-8 mb-4 text-blue-500" />
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4"
        >
          {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
            <motion.button
              key={social}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-white/50 border border-gray-200'} backdrop-blur-md hover:bg-blue-500/20 transition-all duration-300`}
            >
              <Zap className="w-5 h-5" />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
