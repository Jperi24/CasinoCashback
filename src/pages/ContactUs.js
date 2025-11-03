import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ContactUs() {
  const { currentUser, userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create mailto link as fallback
      const mailtoLink = `mailto:support@casinocashback.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSuccess('Opening your email client... If it doesn\'t open automatically, please email us at support@casinocashback.com');
      
      // Clear form
      if (!currentUser) {
        setName('');
        setEmail('');
      }
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Failed to open email client. Please email us directly at support@casinocashback.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg">
            Have a question or need help? We're here for you!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="What's this about?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="6"
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              {loading ? '📧 Sending...' : '📧 Send Message'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <p className="text-center text-gray-600 text-sm">
              Or email us directly at:{' '}
              <a
                href="mailto:support@casinocashback.com"
                className="text-purple-600 hover:text-purple-700 font-bold"
              >
                support@casinocashback.com
              </a>
            </p>
          </div>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600">support@casinocashback.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="font-bold text-gray-900 mb-2">Response Time</h3>
            <p className="text-sm text-gray-600">Within 24-48 hours</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-2">Support Hours</h3>
            <p className="text-sm text-gray-600">24/7 Email Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

