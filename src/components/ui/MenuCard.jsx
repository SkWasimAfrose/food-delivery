import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const isAvailable = item.isAvailable !== false; // Default to true if undefined

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(item);
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: isAvailable ? -5 : 0 }}
      className={`glass rounded-2xl shadow-sm transition-all overflow-hidden border border-gray-100 group ${
        isAvailable ? 'hover:shadow-xl' : 'opacity-75 grayscale-[0.5]'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image || item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-110' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
           {/* Overlay content/badge if needed */}
        </div>
        
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-gray-900 text-red-500 border border-red-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transform -rotate-12">
              Sold Out
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <h3 className={`text-lg font-bold text-gray-800 line-clamp-1 transition-colors ${
             isAvailable ? 'group-hover:text-primary' : ''
           }`}>{item.name}</h3>
           <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg text-sm">₹{item.price}</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
        
        <div className="flex flex-col gap-3 mt-4">
           
           <div className="flex justify-between items-center sm:hidden">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                {item.category || item.categories?.[0]}
              </span>
           </div>

           <div className="hidden sm:flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                {item.category || item.categories?.[0]}
              </span>
              <button 
                onClick={handleAdd}
                disabled={!isAvailable}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isAvailable 
                    ? 'bg-gray-100 hover:bg-primary text-gray-600 hover:text-white hover:shadow-lg active:scale-95' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                title={isAvailable ? "Add to Cart" : "Out of Stock"}
              >
                <Plus size={20} />
              </button>
           </div>
           
           {/* Mobile Full Width Button */}
           <button 
             onClick={handleAdd}
             disabled={!isAvailable}
             className={`sm:hidden w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
               isAvailable 
                 ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-95' 
                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
             }`}
           >
              {isAvailable ? 'Add to Cart' : 'Out of Stock'} <Plus size={18} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
