import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const q = query(
            collection(db, 'orders'), 
            where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Client-side sort by createdAt desc
        fetchedOrders.sort((a, b) => {
           const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return timeB - timeA;
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
      return <div className="min-h-screen flex justify-center items-center"><Loader className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                   <p className="font-bold text-lg">Order #{order.id.slice(0,8)}</p>
                   <p className="text-gray-500 text-sm">
                       {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                   </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                    {order.status}
                </span>
             </div>
             
             <div className="space-y-2 mb-4">
                {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                    </div>
                ))}
             </div>
             
             <div className="flex justify-between items-center font-bold text-lg pt-2">
                 <span>Total</span>
                 <span className="text-primary">₹{order.totalAmount}</span>
             </div>
          </div>
        ))}

        {orders.length === 0 && (
            <div className="text-center text-gray-500 py-10">You haven't placed any orders yet.</div>
        )}
      </div>
    </div>
  );
}
