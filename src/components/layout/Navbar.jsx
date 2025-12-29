import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu as MenuIcon, X, User, LogOut, Loader, LayoutDashboard } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300",
        isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      )}>
        {Icon && <Icon size={18} />}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hotel Lee
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" icon={null}>Home</NavLink>
            <NavLink to="/menu" icon={MenuIcon}>Menu</NavLink>
            
            {currentUser ? (
              <>
                {!isAdmin && (
                  <>
                    <NavLink to="/orders" icon={null}>My Orders</NavLink>
                    <NavLink to="/profile" icon={User}>Profile</NavLink>
                  </>
                )}
                {isAdmin && (
                   <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                )}
                
                {/* Removed duplicate User icon */}
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
               <Link to="/login" className="px-6 py-2 rounded-full bg-primary text-white hover:bg-red-600 transition-all shadow-md">
                 Login
               </Link>
            )}

            {/* Cart Icon (Always visible if not admin, or even if admin) */}
            {!isAdmin && (
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center gap-4">
             {!isAdmin && (
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </Link>
             )}
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
               {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t mt-2 rounded-b-2xl overflow-hidden"
          >
             <div className="px-4 pt-4 pb-6 space-y-2">
                <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-white/50 hover:text-primary transition-all" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/menu" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-white/50 hover:text-primary transition-all" onClick={() => setIsOpen(false)}>Menu</Link>
                 {currentUser && (
                     <>
                     <Link to="/orders" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-white/50 hover:text-primary transition-all" onClick={() => setIsOpen(false)}>My Orders</Link>
                     <Link to="/profile" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-white/50 hover:text-primary transition-all" onClick={() => setIsOpen(false)}>My Profile</Link>
                     <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all">Logout</button>
                     </>
                 )}
                 {!currentUser && (
                     <Link to="/login" className="block px-4 py-3 rounded-xl text-base font-medium text-primary font-bold hover:bg-white/50 transition-all" onClick={() => setIsOpen(false)}>Login</Link>
                 )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
