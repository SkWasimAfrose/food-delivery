import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <motion.div
           animate={{
             scale: [1, 1.2, 1],
             rotate: [0, 0, 270, 270, 0],
             borderRadius: ["20%", "20%", "50%", "50%", "20%"],
           }}
           transition={{
             duration: 2,
             ease: "easeInOut",
             times: [0, 0.2, 0.5, 0.8, 1],
             repeat: Infinity,
             repeatDelay: 1
           }}
           className="w-16 h-16 bg-primary mb-4 mx-auto"
        />
        <h2 className="text-xl font-bold text-gray-800 animate-pulse">Hotel Lee</h2>
        <p className="text-gray-500 text-sm">Preparing deliciousness...</p>
      </div>
    </div>
  );
}
