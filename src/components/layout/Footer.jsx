import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Hotel Lee
            </h3>
            <p className="text-gray-400">
              Experience the taste of luxury and tradition in every bite. Delivering happiness to your doorstep.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/menu" className="hover:text-primary transition-colors">Menu</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <a 
                  href="https://maps.app.goo.gl/gMw8wxzcTtRKaPug9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors hover:underline"
                >
                  NH-12 Simhat, Nadia 741249, WB
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                <span>+91 83910 93124</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <span>hotellee2004@gmail.com</span>
              </li>
            </ul>
          </div>


        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Hotel Lee. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Built & Designed by <a href="https://whoiswasim.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Sk Wasim Afrose</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
