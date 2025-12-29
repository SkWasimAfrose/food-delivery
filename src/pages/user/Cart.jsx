import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(userData?.address || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const navigate = useNavigate();

  // Update fields if userData becomes available
  React.useEffect(() => {
    if (userData) {
      if (!address) setAddress(userData.address || '');
      if (!phone) setPhone(userData.phone || '');
    }
  }, [userData]);

  const handleCheckout = async () => {
    if (!currentUser) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
    }
    
    if (!phone || phone.length < 10) {
        toast.error('Please add your contact number in Profile first');
        navigate('/profile');
        return;
    }

    if (!address.trim() || address.length < 10) {
        toast.error('Please provide a complete delivery address');
        return;
    }

    setLoading(true);
    try {
        const orderData = {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            userName: userData?.displayName || currentUser.displayName,
            userPhone: phone,
            items: cart,
            totalAmount: totalPrice,
            deliveryAddress: address,
            status: 'pending',
            createdAt: serverTimestamp(),
            paymentMethod: 'COD'
        };

        await addDoc(collection(db, 'orders'), orderData);
        clearCart();
        toast.success('Order placed successfully! We are preparing it now.');
        navigate('/orders');
    } catch (error) {
        toast.error('Failed to place order: ' + error.message);
    } finally {
        setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-midnight mb-8">Your Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="glass rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 border-b border-gray-100 flex gap-3 sm:gap-6 items-center">
                <img 
                  src={item.image || item.imageUrl || 'https://via.placeholder.com/100'} 
                  alt={item.name} 
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-gray-800 line-clamp-2">{item.name}</h3>
                  <p className="text-primary font-bold text-sm sm:text-base">₹{item.price * item.quantity}</p>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                  >
                    <Minus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <span className="font-semibold w-5 sm:w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="glass rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
               <input 
                 type="tel"
                 value={phone} 
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                 placeholder="Enter 10-digit number..."
                 required
               />
            </div>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
               <textarea 
                 value={address} 
                 onChange={(e) => setAddress(e.target.value)}
                 className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none"
                 rows="3"
                 placeholder="Enter your full address..."
                 required
               />
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : <>Place Order (COD) <ArrowRight size={20} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
