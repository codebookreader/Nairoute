import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/register': 'http://localhost:5000',
      '/driverlogin': 'http://localhost:5000',
      '/driverregister': 'http://localhost:5000',
      '/dashboard': 'http://localhost:5000',
      '/driverdashboard': 'http://localhost:5000',
      '/adminlogin': 'http://localhost:5000',
      '/adminpage': 'http://localhost:5000',
      '/logout': 'http://localhost:5000',
      '/resetpassword': 'http://localhost:5000',
      '/profile': 'http://localhost:5000',
      '/payment': 'http://localhost:5000',
      '/send-otp': 'http://localhost:5000',
      '/verify-otp': 'http://localhost:5000',
    },
  },
  define: {
    'process.env': {},
  },
});