import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        signup: resolve(__dirname, 'signup.html'),
        setupProfile: resolve(__dirname, 'setup-profile.html'),
        // Admin pages
        admin: resolve(__dirname, 'admin/login.html'),
        adminDashboard: resolve(__dirname, 'admin/dashboard.html'),
        adminCategories: resolve(__dirname, 'admin/categories.html'),
        adminMenu: resolve(__dirname, 'admin/menu-management.html'),
        adminOrders: resolve(__dirname, 'admin/orders-management.html'),
        adminUsers: resolve(__dirname, 'admin/users.html'),
        // User pages
        userCart: resolve(__dirname, 'user/cart.html'),
        userCheckout: resolve(__dirname, 'user/checkout.html'),
        userMenu: resolve(__dirname, 'user/menu.html'),
        userOrders: resolve(__dirname, 'user/orders.html'),
        userProfile: resolve(__dirname, 'user/profile.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
