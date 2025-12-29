import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login'; 
import Signup from './pages/auth/Signup';
import Home from './pages/user/Home';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import Layout from './components/layout/Layout';

import ProtectedRoute from './components/layout/ProtectedRoute';
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Toaster position="top-center" />
        <InstallPrompt />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Admin...</div>}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
