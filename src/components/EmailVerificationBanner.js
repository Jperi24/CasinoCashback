import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerificationBanner() {
  const { currentUser, resendVerificationEmail, refreshUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
    try {
      setSending(true);
      setMessage('');
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshUser();
      if (currentUser.emailVerified) {
        window.location.reload();
      } else {
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      setMessage('Failed to refresh: ' + error.message);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address to submit referrals and update your information.
              A verification email has been sent to <strong>{currentUser.email}</strong>
            </p>
          </div>
          {message && (
            <div className={`mt-2 text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleResendEmail}
              disabled={sending}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={handleRefresh}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              I've Verified - Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




