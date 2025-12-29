import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMenuModal({ isOpen, onClose, itemToEdit = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isAvailable: true
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (itemToEdit) {
        setFormData({
          name: itemToEdit.name || '',
          description: itemToEdit.description || '',
          price: itemToEdit.price || '',
          image: itemToEdit.image || '',
          category: itemToEdit.categories?.[0] || '',
          isAvailable: itemToEdit.isAvailable !== undefined ? itemToEdit.isAvailable : true
        });
      } else {
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            isAvailable: true
        });
      }
    }
  }, [isOpen, itemToEdit]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
    }

    setLoading(true);
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        categories: [formData.category],
        isAvailable: formData.isAvailable,
        updatedAt: serverTimestamp()
      };

      if (itemToEdit) {
        // Update existing item
        await updateDoc(doc(db, 'menuItems', itemToEdit.id), itemData);
        toast.success('Menu item updated successfully');
      } else {
        // Add new item
        await addDoc(collection(db, 'menuItems'), {
          ...itemData,
          createdAt: serverTimestamp()
        });
        toast.success('Menu item added successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(itemToEdit ? 'Failed to update menu item' : 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-midnight">
            {itemToEdit ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Chicken Biryani"
                required
              />
            </div>

            {/* Price */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              {fetchingCategories ? (
                <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Image URL */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Link
              </label>
              <div className="relative">
                <div className="absolute opacity-0 hidden inset-y-0 left-0 pl-3 md:flex items-center pointer-events-none">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Product details..."
              />
            </div>

            {/* Availability */}
            <div className="col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors ${formData.isAvailable ? 'bg-secondary' : ''}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.isAvailable ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Available (In Stock)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {itemToEdit ? 'Updating Item...' : 'Add to Menu'}
                </>
              ) : (
                itemToEdit ? 'Update Menu Item' : 'Add to Menu'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
