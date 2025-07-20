'use client';

import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setShowLoginModal(true);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('localStorageChange'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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