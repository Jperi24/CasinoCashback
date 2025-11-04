import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300 animate-bounce-subtle">
              🎰
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Stakeback
              </span>
              <p className="text-xs text-purple-200 font-medium">Earn while you play</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 mr-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-semibold">
                    {userProfile?.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>
                
                {userProfile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      isActive('/admin')
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    ⚡ Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    isActive('/dashboard')
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/join-casino"
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    isActive('/join-casino')
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  🎰 Add Casino
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  👋 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 ${
                    isActive('/login')
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  🔐 Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  ✨ Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {currentUser ? (
                <>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg mb-2">
                    <p className="text-sm font-semibold">{userProfile?.displayName || currentUser.email}</p>
                  </div>
                  {userProfile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⚡ Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    to="/join-casino"
                    className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎰 Join Casino
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition font-medium text-left"
                  >
                    👋 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✨ Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

