import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-black mb-3">Casino Cashback</h3>
            <p className="text-purple-200 text-sm">
              Earn 20% cashback on your casino play. Simple, transparent, and automatic.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-purple-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-purple-200 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/join-casino" className="text-purple-200 hover:text-white transition">
                  Join Casino
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-purple-200 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-purple-200 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-3">Get In Touch</h4>
            <div className="space-y-2 text-sm text-purple-200">
              <p>Have questions? We're here to help!</p>
              <Link 
                to="/contact" 
                className="inline-block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
              >
                📧 Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple-700 text-center text-sm text-purple-300">
          <p>&copy; {new Date().getFullYear()} Casino Cashback. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

