// Hero.jsx – Fixed subtext placement & design adapter look
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-10 pt-4 pb-8">
      <div className="relative w-full h-[calc(100vh-140px)] min-h-[600px] bg-[#e8e8e8] rounded-2xl overflow-hidden flex justify-center">
        
        {/* Model Image */}
        <div className="absolute bottom-0 h-full w-full max-w-[1000px] flex justify-center items-end z-10">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" 
            alt="Model" 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        {/* Huge Typography Overlay */}
        <div className="absolute top-1/4 left-0 w-full flex justify-center z-20 pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-black text-[clamp(100px,14vw,200px)] leading-[0.8] tracking-tighter text-center text-primary uppercase select-none"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
          >
             TIMELESS<br />
             EST<span className="text-transparent" style={{ WebkitTextStroke: '2px #111' }}>E</span>NTIAL
          </motion.h1>
        </div>

        {/* Designer Adapter Badge (Floating Sidebar Style) */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
           className="absolute bottom-16 right-0 z-30 flex items-start gap-4 pr-10 md:pr-16"
        >
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2">Design Adapter v1.2</span>
            <p className="text-sm font-semibold leading-tight text-primary font-sans max-w-[180px] bg-white/40 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-white/20">
              Timeless essentials designed to adapt, layer, and last through every season.
            </p>
          </div>
          <div className="w-[2px] h-32 bg-primary origin-top scale-y-100 mt-2" />
        </motion.div>

        {/* Spinning Badge */}
        <motion.div 
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
           <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center relative shadow-[0_15px_40px_rgba(0,0,0,0.15)] ring-8 ring-white/10">
             <span className="text-3xl text-primary">✺</span>
             <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]">
                <defs>
                   <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                </defs>
                <text fontSize="8.5" fontWeight="800" letterSpacing="2px" fill="#111">
                  <textPath href="#circlePath">
                    DR⋆P.CODE — ALWAYS KEEP THE TREND — 
                  </textPath>
                </text>
             </svg>
           </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default Hero;
