'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import LoginModal from './LoginModal';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check login status on component mount
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (loginStatus === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setIsMenuOpen(false);
    // Redirect to homepage after logout
    window.location.href = '/';
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(true);
      setUsername(storedUsername || '');
      setShowLoginModal(false);
    }
  };

  // Hide navbar on dashboard page
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BH</span>
              </div>
              <span className="font-bold text-xl text-gray-900">BoneHealth AI</span>
            </Link>
            
            {/* Auth Section - visible on all screen sizes */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiUser className="w-4 h-4" />
                    <span>Welcome, {username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors px-3 py-2 rounded-lg"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="hidden xs:inline">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
          </div>

          {/* Mobile Navigation Menu */}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
} 