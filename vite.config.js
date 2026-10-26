import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pageBypass  = (req)=>{
    if(req.headers.accept && req.headers.accept.includes('text/html')){
      return '/index.html'}
    };
export default defineConfig({
  
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/login': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/register': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/driverlogin': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/driverregister': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/dashboard': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/driverdashboard': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/adminlogin': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/adminpage': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/logout': 'http://localhost:5000',
      '/resetpassword': {'target': 'http://localhost:5000', bypass: pageBypass},
      '/profile':  'http://localhost:5000',
      '/payment':  'http://localhost:5000', 
      '/send-otp': 'http://localhost:5000', 
      '/verify-otp':  'http://localhost:5000',
    },
  },
  define: {
    'process.env': {},
  },
});