import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoryModal({ isOpen, onClose, categoryToEdit = null }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setDescription(categoryToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (categoryToEdit) {
        // Update existing category
        await updateDoc(doc(db, 'categories', categoryToEdit.id), {
          name,
          description,
          updatedAt: serverTimestamp()
        });
        toast.success('Category updated successfully');
      } else {
        // Add new category
        await addDoc(collection(db, 'categories'), {
          name,
          description,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success('Category added successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(categoryToEdit ? 'Failed to update category' : 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl mx-4 sm:mx-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-midnight">
            {categoryToEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Briyani"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Short description of the category..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {categoryToEdit ? 'Updating...' : 'Create Category'}
              </>
            ) : (
              categoryToEdit ? 'Update Category' : 'Create Category'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
