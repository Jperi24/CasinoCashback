import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default function EmailPreferences() {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState({
    marketing: true,
    updates: true,
    monthlyReport: true,
    payouts: true // Always true, non-editable
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, [currentUser]);

  const fetchPreferences = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists() && userDoc.data().emailPreferences) {
        setPreferences({
          ...preferences,
          ...userDoc.data().emailPreferences,
          payouts: true // Always true
        });
      }
    } catch (error) {
      console.error('Error fetching email preferences:', error);
    }
  };

  const handleToggle = (key) => {
    if (key === 'payouts') return; // Can't toggle payouts
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await updateDoc(doc(db, 'users', currentUser.uid), {
        emailPreferences: preferences
      });

      setSuccess('Email preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update preferences: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Preferences</h2>
        <p className="text-gray-600">Choose what emails you'd like to receive from us</p>
      </div>

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

      <div className="space-y-6">
        {/* Payout Notifications - Always On */}
        <div className="flex items-start justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              💰 Payout Notifications
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Required</span>
            </h3>
            <p className="text-sm text-gray-600">
              Important updates about your cashback payouts and transactions
            </p>
          </div>
          <div className="ml-4">
            <div className="relative inline-block w-12 h-6 bg-green-600 rounded-full cursor-not-allowed opacity-70">
              <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
            </div>
          </div>
        </div>

        {/* Marketing Emails */}
        <div className="flex items-start justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">📧 Marketing & Promotions</h3>
            <p className="text-sm text-gray-600">
              Weekly newsletters, special offers, and exclusive casino promotions
            </p>
          </div>
          <div className="ml-4">
            <button
              onClick={() => handleToggle('marketing')}
              className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  preferences.marketing ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Product Updates */}
        <div className="flex items-start justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">🔔 Product Updates</h3>
            <p className="text-sm text-gray-600">
              New casino additions, feature announcements, and platform improvements
            </p>
          </div>
          <div className="ml-4">
            <button
              onClick={() => handleToggle('updates')}
              className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                preferences.updates ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  preferences.updates ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Monthly Reports */}
        <div className="flex items-start justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">📊 Monthly Earnings Report</h3>
            <p className="text-sm text-gray-600">
              Detailed breakdown of your monthly cashback earnings and statistics
            </p>
          </div>
          <div className="ml-4">
            <button
              onClick={() => handleToggle('monthlyReport')}
              className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                preferences.monthlyReport ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  preferences.monthlyReport ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-gray-100">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Saving...' : '💾 Save Preferences'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          You can update your preferences at any time. We respect your privacy and will never share your email.
        </p>
      </div>
    </div>
  );
}

