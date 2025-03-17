import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeverNavbar from './components/navbar/FeverNavbar';
import Footer from './components/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {

  return (
    <Router>
      <FeverNavbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}
export default App;
