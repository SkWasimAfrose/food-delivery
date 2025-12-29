import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Hero() {
  const { currentUser } = useAuth();
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mesh-gradient">
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 glass-orb animate-float-slow z-0" />
      <div className="absolute bottom-20 right-20 w-96 h-96 glass-orb animate-float-medium z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glass-orb animate-float-fast opacity-50 z-0" />
      <div className="absolute top-40 right-1/3 w-40 h-40 glass-orb animate-float-slow z-0 delay-700" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight mb-6 md:mb-8 text-white drop-shadow-lg tracking-tight px-2">
            Taste the Best at <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-white">Hotel Lee</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-50 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Experience the liquid harmony of premium flavors. <br className="hidden md:block"/>
            Mesmerizing taste served with elegance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
            <Link 
              to={currentUser ? "/menu" : "/login"} 
              className="group bg-primary hover:bg-white hover:text-primary text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl shadow-primary/40 border border-transparent hover:border-primary/20 backdrop-blur-sm w-full sm:w-auto"
            >
              Order Now <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </Link>
            <Link 
              to="/menu" 
              className="px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              View Menu
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur Overlay for smoothness */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/20 pointer-events-none" />
    </section>
  );
}
