import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Pencil, Trash2, Plus, UtensilsCrossed, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminMenuModal from './AdminMenuModal';

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'menuItems'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(menuData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'menuItems', id));
        toast.success('Menu item deleted successfully');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'menuItems', id), {
        isAvailable: !currentStatus
      });
      toast.success(`Item marked as ${!currentStatus ? 'Available' : 'Unavailable'}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update status');
    }
  };

  const openAddModal = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categories?.[0]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-midnight">Menu Items</h2>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm shadow-primary/30 whitespace-nowrap"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-4">
           {loading ? (
             [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-50 rounded-xl animate-pulse"/>)
           ) : filteredItems.length === 0 ? (
             <div className="text-center py-10 text-gray-500">No items found</div>
           ) : (
             filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                       <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                           <span className="font-bold text-gray-800">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{item.categories?.[0]}</p>
                        
                        <div className="flex justify-between items-center mt-2">
                            <button 
                                onClick={() => toggleAvailability(item.id, item.isAvailable)}
                                className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {item.isAvailable ? 'In Stock' : 'Out'}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(item)} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
             ))
           )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/5 text-midnight font-medium">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="w-12 h-12 bg-gray-100 rounded-lg"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                    <td className="p-4"></td>
                  </tr>
                 ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-20" />
                    No menu items found. {searchTerm && 'Try a different search.'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <UtensilsCrossed size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{item.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        {item.categories?.[0] || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">₹{item.price}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleAvailability(item.id, item.isAvailable)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-colors ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <ToggleRight size={16} /> In Stock
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={16} /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminMenuModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        itemToEdit={itemToEdit}
      />
    </div>
  );
}
