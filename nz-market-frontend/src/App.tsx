import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellPage from './pages/SellPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/globals.css';

function App() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'zh';
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (newLanguage: 'en' | 'zh') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar 
          currentLanguage={language} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  language={language} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <SearchPage 
                  language={language} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProductDetailPage 
                  language={language} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              } 
            />
            <Route 
              path="/sell" 
              element={<SellPage language={language} />} 
            />
            <Route 
              path="/chat" 
              element={<ChatPage language={language} />} 
            />
            <Route 
              path="/me" 
              element={
                <DashboardPage 
                  language={language} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              } 
            />
            <Route 
              path="/login" 
              element={<LoginPage language={language} />} 
            />
            <Route 
              path="/register" 
              element={<RegisterPage language={language} />} 
            />
            <Route 
              path="/favorites" 
              element={
                <SearchPage 
                  language={language} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              } 
            />
            {/* Catch all route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">
                      {language === 'en' 
                        ? 'Page not found' 
                        : '页面未找到'
                      }
                    </p>
                    <a 
                      href="/" 
                      className="btn-primary"
                    >
                      {language === 'en' ? 'Go Home' : '返回首页'}
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
        
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
