import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeverNavbar from './components/navbar/FeverNavbar';
import Footer from './components/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthService } from './services/authService';
import ScrollTop from './components/utils/ScrollTop';
import './App.css';

function App() {

  useEffect(() => {
    AuthService.isAuthenticated();

    const tokenCheckInterval = setInterval(() => {
      AuthService.isAuthenticated();
    }, 3000);

    return () => {
      clearInterval(tokenCheckInterval);
    }
  }, []);
  return (
    <Router>
      <ScrollTop />
      <FeverNavbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}
export default App;
