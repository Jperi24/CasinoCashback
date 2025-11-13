import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  orderBy 
} from 'firebase/firestore';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import CryptoWalletManager from '../components/CryptoWalletManager';
import EmailPreferences from '../components/EmailPreferences';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [casinos, setCasinos] = useState([]);
  const [myReferrals, setMyReferrals] = useState([]);
  const [editingReferral, setEditingReferral] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCasinos();
    fetchMyReferrals();
  }, [userProfile]);

  const fetchCasinos = async () => {
    try {
      const casinosQuery = query(collection(db, 'casinos'), orderBy('name'));
      const snapshot = await getDocs(casinosQuery);
      const casinosList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCasinos(casinosList);
    } catch (error) {
      console.error('Error fetching casinos:', error);
    }
  };

  const fetchMyReferrals = async () => {
    try {
      const referralsQuery = query(
        collection(db, 'referrals'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(referralsQuery);
      const referralsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyReferrals(referralsList);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleEditReferral = (referral) => {
    setEditingReferral(referral.id);
    setEditUsername(referral.casinoUsername === 'N/A' ? '' : referral.casinoUsername);
    setEditEmail(referral.casinoEmail);
  };

  const handleSaveEdit = async (referralId) => {
    try {
      setLoading(true);
      setError('');
      
      await updateDoc(doc(db, 'referrals', referralId), {
        casinoUsername: editUsername.trim() || 'N/A',
        casinoEmail: editEmail.trim()
      });

      setSuccess('Details updated successfully!');
      setEditingReferral(null);
      fetchMyReferrals();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReferral(null);
    setEditUsername('');
    setEditEmail('');
  };

  const getStatusBadge = (status) => {
    // Treat pending as active (legacy support)
    const displayStatus = status === 'pending' ? 'active' : status;
    const styles = {
      active: 'bg-green-100 text-green-800',
      verified: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[displayStatus] || 'bg-gray-100 text-gray-800'}`}>
        ✅ Active
      </span>
    );
  };

  return (
    <>
      <SEO
        title="Dashboard - Manage Your Casino Cashback | StakeBack"
        description="View and manage your casino cashback accounts, track monthly rewards, and update your crypto wallet information on your StakeBack dashboard."
        canonicalUrl="https://stakeback.xyz/dashboard"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-2">
            Welcome back, {userProfile?.displayName}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Manage your referrals and track your cashback earnings</p>
        </div>

        <EmailVerificationBanner />

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

        {/* Getting Started Section for New Users OR Earnings Banner */}
        {myReferrals.length === 0 ? (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎉</span>
              <div>
                <h2 className="text-3xl font-black">Welcome to Stakeback!</h2>
                <p className="text-purple-100">Let's get you started earning up to 40% cashback on your casino play</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📋</span> Quick Setup Checklist
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <span className={`text-2xl ${currentUser.emailVerified ? '' : 'opacity-50'}`}>
                    {currentUser.emailVerified ? '✅' : '⏳'}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">Verify Your Email</p>
                    <p className="text-sm text-purple-100">
                      {currentUser.emailVerified ? 'Complete! Email verified' : 'Check your inbox for verification email'}
                    </p>
                  </div>
        </div>

                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <span className={`text-2xl ${userProfile?.wallets?.some(w => w.priority === 1) ? '' : 'opacity-50'}`}>
                    {userProfile?.wallets?.some(w => w.priority === 1) ? '✅' : '⏳'}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">Set Up Crypto Wallet</p>
                    <p className="text-sm text-purple-100">
                      {userProfile?.wallets?.some(w => w.priority === 1) 
                        ? 'Complete! Wallet configured for payouts' 
                        : 'Add your wallet address below to receive cashback'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <span className="text-2xl opacity-50">⏳</span>
                  <div className="flex-1">
                    <p className="font-bold">Join Your First Casino</p>
                    <p className="text-sm text-purple-100">Click the button below to get started!</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/join-casino"
              className="block w-full text-center bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition shadow-lg text-lg"
            >
              🎰 Join Your First Casino & Start Earning →
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-black mb-2">Your Total Earnings</h2>
                <p className="text-green-100">Cashback from all verified referrals</p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-black">
                  ${myReferrals
                    .filter(r => r.status === 'active' || r.status === 'verified' || r.status === 'pending')
                    .reduce((total, referral) => {
                      const payouts = referral.monthlyPayouts || [];
                      return total + payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
                    }, 0)
                    .toFixed(2)}
                </p>
                <p className="text-green-100 text-sm mt-1">
                  {myReferrals.filter(r => r.status === 'active' || r.status === 'verified' || r.status === 'pending').length} Active Referrals
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <Link
                to="/join-casino"
                className="inline-flex items-center gap-2 text-white hover:text-green-100 font-semibold transition"
              >
                <span>➕</span> Add Another Casino
              </Link>
            </div>
          </div>
        )}

        {/* Monthly Payouts by Casino */}
        {myReferrals.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Your Casino Accounts</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your casino registrations and track earnings</p>
              </div>
              <Link
                to="/join-casino"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition text-sm"
              >
                ➕ Add Casino
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {myReferrals.map(referral => {
                const casino = casinos.find(c => c.id === referral.casinoId);
                const payouts = referral.monthlyPayouts || [];
                const totalEarned = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
                const isEditing = editingReferral === referral.id;

                return (
                  <div key={referral.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition">
                    <div className="flex flex-col md:flex-row items-stretch">
                      {/* Casino Banner - Left Side */}
                      {casino?.bannerUrl && (
                        <div className="md:w-64 bg-gray-50 flex justify-center items-center p-4">
                          {casino.bannerUrl.trim().startsWith('<script') ? (
                            <div className="text-gray-400 text-sm italic text-center">
                              🎰 {casino.name}
                            </div>
                          ) : (
                            <img 
                              src={casino.bannerUrl} 
                              alt={`${casino.name} banner`}
                              className="max-w-full h-auto object-contain"
                              style={{ maxHeight: '200px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-gray-400 text-sm text-center">🎰 ' + casino.name + '</p>';
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Casino Info - Center */}
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{casino?.name || 'Unknown Casino'}</h3>
                          {casino?.signupUrl && (
                            <a
                              href={casino.signupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 transition"
                              title="Visit Casino"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                        {casino?.signupUrl && (
                          <a
                            href={casino.signupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:text-purple-700 underline mb-2 inline-block"
                          >
                            🔗 Visit {casino.name}
                          </a>
                        )}
                        <div className="mb-3">{getStatusBadge(referral.status)}</div>
                        
                        {/* Editable Username and Email */}
                        {isEditing ? (
                          <div className="space-y-3 mt-4 bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                            <p className="text-sm text-purple-800 font-medium mb-2">
                              💡 <strong>Tip:</strong> Keep your details up-to-date to ensure we can verify your referral and track your cashback accurately.
                            </p>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Username:</label>
                              <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="Enter username or leave empty for N/A"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Email:</label>
                              <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder="Enter email"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(referral.id)}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition disabled:opacity-50"
                              >
                                ✅ Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-lg transition"
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm space-y-1 mt-4">
                            <p className="text-gray-700">
                              <span className="font-bold">👤 Username:</span>{' '}
                              <span className={referral.casinoUsername === 'N/A' ? 'text-gray-400 italic' : 'font-medium'}>
                                {referral.casinoUsername}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              <span className="font-bold">📧 Email:</span> <span className="font-medium">{referral.casinoEmail}</span>
                            </p>
                            <button
                              onClick={() => handleEditReferral(referral)}
                              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition text-sm"
                            >
                              ✏️ Edit Details
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Total Earnings - Right Side */}
                      <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:w-48 border-l-2 border-gray-100">
                        <div className="text-center">
                          <p className="text-4xl font-black text-green-600 mb-1">
                            ${totalEarned.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total Earned</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment History Section */}
                    {payouts.length > 0 ? (
                      <div className="px-6 pb-6 border-t-2 border-gray-100 pt-4">
                        <p className="text-sm font-bold text-gray-700 mb-3">💰 Payment History:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                          {payouts.slice().reverse().map((payout, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                              <span className="text-sm text-gray-600 font-medium">{payout.month}</span>
                              <span className="text-sm font-bold text-green-600">
                                ${payout.amount?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 pb-6 border-t-2 border-gray-100 pt-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 font-medium">
                            🎰 Account active! Your payouts will appear here at the end of each month.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
            </div>
          </div>
        ) : null}

        {/* Crypto Wallet Manager */}
        <div className="mb-8">
          {myReferrals.length === 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Important: Set Up Your Crypto Wallet</h4>
                  <p className="text-sm text-blue-800">
                    Before you can receive cashback payments, you need to add at least one crypto wallet below. 
                    Make sure to set one as your <strong>priority wallet</strong> to receive automatic monthly payouts!
                  </p>
                </div>
              </div>
            </div>
          )}
          <CryptoWalletManager />
        </div>

        {/* Email Preferences */}
        <div className="mb-8">
          <EmailPreferences />
        </div>
      </div>
    </div>
    </>
  );
}
