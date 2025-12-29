import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Pencil, Trash2, Plus, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminCategoryModal from './AdminCategoryModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const openAddModal = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-midnight">Categories</h2>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm shadow-primary/30"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
           [...Array(3)].map((_, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
           ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-2xl border border-gray-100">
            <LayoutGrid size={48} className="mx-auto mb-4 opacity-20" />
            <p>No categories found.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {category.description || 'No description'}
                </p>
              </div>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => openEditModal(category)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
