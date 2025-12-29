import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, Truck } from 'lucide-react';
import Hero from '../../components/ui/Hero';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Star className="text-yellow-400" size={32} />}
              title="Top Rated Quality"
              description="Rated 4.6/5 by over 100+ satisfied customers for our exceptional taste."
            />
            <FeatureCard 
              icon={<Clock className="text-primary" size={32} />}
              title="30 Min Delivery"
              description="We promise to deliver your food piping hot within 30 minutes."
            />
            <FeatureCard 
              icon={<Truck className="text-secondary" size={32} />}
              title="Free Shipping"
              description="Enjoy free delivery on all orders. No hidden charges."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-2xl glass hover:shadow-xl transition-all"
    >
      <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-midnight">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
