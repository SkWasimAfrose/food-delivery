import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, Clock, Truck, XCircle, ShoppingBag, UtensilsCrossed, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminCategories from './AdminCategories';
import AdminMenu from './AdminMenu';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-midnight">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-gray-100">
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
            icon={<ShoppingBag size={18} />} 
            label="Live Orders" 
          />
          <TabButton 
            active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')} 
            icon={<UtensilsCrossed size={18} />} 
            label="Menu Management" 
          />
          <TabButton 
            active={activeTab === 'categories'} 
            onClick={() => setActiveTab('categories')} 
            icon={<LayoutGrid size={18} />} 
            label="Categoris" 
          />
        </div>

        {/* Content */}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'categories' && <AdminCategories />}

      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          active 
            ? 'bg-primary text-white shadow-md shadow-primary/30' 
            : 'text-gray-500 hover:text-midnight hover:bg-gray-50'
        }`}
      >
        {icon}
        {label}
      </button>
  );
}

function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Removed orderBy to ensure legacy orders without 'createdAt' key still appear
    const q = query(collection(db, 'orders'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        // Log data to debug legacy fields
// Log data to debug legacy fields
        
        return {
            id: doc.id,
            ...data,
            // Normalize userName: check various common legacy field names
            userName: data.userName || data.user_name || data.name || data.customerName || data.customer_name || 'Guest',
            // Normalize createdAt: check various common legacy field names
            createdAt: data.createdAt || data.created_at || data.timestamp || data.date || data.orderDate || null
        };
      });
      
      // Client-side sort to handle missing createdAt gracefully
      ordersData.sort((a, b) => {
        const getDate = (item) => {
            if (!item.createdAt) return new Date(0);
            return item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
        };
        const dateA = getDate(a);
        const dateB = getDate(b);
        return dateB - dateA;
      });

      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
        toast.error('Failed to update status');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return 'N/A';
        
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'N/A';
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const revenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`₹${revenue}`} color="bg-green-500" />
        <StatCard title="Pending Orders" value={pendingOrders.length} color="bg-primary" />
        <StatCard title="Total Orders" value={orders.length} color="bg-blue-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-midnight">Live Orders</h2>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {orders.map((order) => (
             <div key={order.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <span className="text-xs font-mono text-gray-500">#{order.id.slice(0, 8)}</span>
                      <div className="flex items-center gap-2 mt-1">
                          <h3 
                            className="font-bold text-gray-900 cursor-pointer hover:text-primary border-b border-dashed border-gray-400 hover:border-primary transition-colors"
                            onClick={() => setSelectedOrder(order)}
                          >
                            {order.userName || 'Guest'}
                          </h3>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</div>
                   </div>
                   <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'pending' ? 'bg-primary/10 text-primary' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                   <div className="line-clamp-2">{order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
                   <div className="font-bold text-gray-800">Total: ₹{order.totalAmount}</div>
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'preparing')} className="p-2 bg-blue-100 text-blue-600 rounded-lg" title="Preparing">
                          <Clock size={20} />
                        </button>
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="p-2 bg-green-100 text-green-600 rounded-lg" title="Delivered">
                          <Check size={20} />
                        </button>
                        <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-2 bg-red-100 text-red-600 rounded-lg" title="Cancel">
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg font-medium text-sm">
                           <Truck size={18} /> Mark Delivered
                        </button>
                    )}
                </div>
             </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/5 text-midnight font-medium">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}...</td>
                  <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-4">
                    <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-left group"
                    >
                        <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{order.userName || 'Guest'}</div>
                        <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Details</div>
                    </button>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="p-4 font-bold">₹{order.totalAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'pending' ? 'bg-primary/10 text-primary' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'preparing')} className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Preparing">
                          <Clock size={18} />
                        </button>
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Delivered">
                          <Check size={18} />
                        </button>
                        <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Cancel">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => updateStatus(order.id, 'delivered')} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Delivered">
                        <Truck size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
              <div className="p-10 text-center text-gray-500">No orders yet.</div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-midnight">Customer Details</h2>
                    <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <XCircle size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedOrder.userName || 'Guest'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Number</label>
                        <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            {selectedOrder.userPhone || 'N/A'}
                        </p>
                    </div>
                     <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                        <p className="text-base text-gray-600">{selectedOrder.userEmail || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Address</label>
                        <p className="text-base text-gray-600 mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {selectedOrder.deliveryAddress || 'No address provided'}
                        </p>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full ${color} opacity-20`} />
    </div>
  );
}
