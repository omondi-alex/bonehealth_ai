'use client';

import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import DataPreloader from '../services/dataPreloader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedirectLoader, setShowRedirectLoader] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setShowLoginModal(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Show redirect loader immediately
      setShowRedirectLoader(true);
      // Hide loader after a short delay and show content
      setTimeout(() => {
        setShowRedirectLoader(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setShowLoginModal(true);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('localStorageChange'));
    // Clear cache
    DataPreloader.getInstance().clearCache();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show full-screen redirect loader after successful login
  if (showRedirectLoader) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Welcome to BoneHealth AI</h2>
          <p className="text-blue-100">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to homepage if not logged in
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  return (
    <>
      {children}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
} 