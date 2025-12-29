import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, userData: initialUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (initialUserData) {
      setFormData({
        displayName: initialUserData.displayName || currentUser?.displayName || '',
        phone: initialUserData.phone || '',
        address: initialUserData.address || ''
      });
    }
  }, [initialUserData, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid contact number');
      return;
    }
    if (!formData.address || formData.address.length < 10) {
      toast.error('Please enter a complete delivery address');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        ...formData,
        email: currentUser.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-primary px-8 py-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <p className="text-white/80">Manage your contact details and delivery address</p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <User size={120} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={18} className="text-primary" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-gray-50"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={18} className="text-primary" /> Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-gray-50"
                  placeholder="Enter 10-digit mobile number"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Delivery Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-gray-50 resize-none"
                  placeholder="Street name, landmark, city, and pincode..."
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} /> Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
