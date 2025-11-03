import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send reset email: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100 animate-fade-in">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
                  <span className="text-3xl">🔑</span>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Reset Link...
                    </span>
                  ) : (
                    '📧 Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce-subtle">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Check Your Email!
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                We've sent password reset instructions to:
              </p>
              <p className="text-purple-600 font-bold text-xl mb-8">
                {email}
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200 text-left">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">ℹ️</span>
                  Next Steps:
                </h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Check your inbox (and spam folder)</li>
                  <li>Click the reset link in the email</li>
                  <li>Create your new password</li>
                  <li>Login with your new password</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  Back to Login
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all border-2 border-gray-300"
                >
                  Send to Different Email
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-purple-200 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}




