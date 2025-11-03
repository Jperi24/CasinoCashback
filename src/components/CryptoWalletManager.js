import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const CRYPTO_TYPES = [
  { key: 'btc', label: 'Bitcoin (BTC)', placeholder: 'bc1q... or 1A1z...', icon: '₿' },
  { key: 'eth', label: 'Ethereum (ETH)', placeholder: '0x...', icon: 'Ξ' },
  { key: 'solana', label: 'Solana (SOL)', placeholder: 'So1a...', icon: '◎' },
  { key: 'base', label: 'Base', placeholder: '0x...', icon: '🔵' }
];

export default function CryptoWalletManager() {
  const { currentUser } = useAuth();
  const [wallets, setWallets] = useState({
    btc: { address: '', priority: 0 },
    eth: { address: '', priority: 0 },
    solana: { address: '', priority: 0 },
    base: { address: '', priority: 0 }
  });
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallets();
  }, [currentUser]);

  const fetchWallets = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.cryptoWallets) {
          setWallets(data.cryptoWallets);
        }
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const handleAddressChange = (crypto, value) => {
    setWallets(prev => ({
      ...prev,
      [crypto]: { ...prev[crypto], address: value }
    }));
  };

  const handlePriorityChange = (crypto, priority) => {
    // If setting priority 1 or 2, clear that priority from other wallets
    if (priority > 0) {
      const updatedWallets = { ...wallets };
      Object.keys(updatedWallets).forEach(key => {
        if (key !== crypto && updatedWallets[key].priority === priority) {
          updatedWallets[key].priority = 0;
        }
      });
      updatedWallets[crypto].priority = priority;
      setWallets(updatedWallets);
    } else {
      setWallets(prev => ({
        ...prev,
        [crypto]: { ...prev[crypto], priority: 0 }
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser.emailVerified) {
      setError('Please verify your email address before updating wallet information.');
      return;
    }

    // Validate that at least one address is provided
    const hasAddress = Object.values(wallets).some(w => w.address.trim());
    if (!hasAddress) {
      setError('Please provide at least one wallet address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await updateDoc(doc(db, 'users', currentUser.uid), {
        cryptoWallets: wallets
      });

      setSuccess('Crypto wallets updated successfully!');
    } catch (error) {
      setError('Failed to update wallets: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCryptoData = CRYPTO_TYPES.find(c => c.key === selectedCrypto);
  const currentWallet = wallets[selectedCrypto];

  const getPriorityBadge = (priority) => {
    if (priority === 1) return <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-sm">⭐ Priority #1</span>;
    if (priority === 2) return <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">🥈 Priority #2</span>;
    return null;
  };

  const getWalletSummary = () => {
    return CRYPTO_TYPES.map(crypto => {
      const wallet = wallets[crypto.key];
      if (wallet.address) {
        return {
          ...crypto,
          ...wallet
        };
      }
      return null;
    }).filter(Boolean);
  };

  const walletSummary = getWalletSummary();

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            💰 Crypto Wallets
          </h2>
          <p className="text-gray-600">
            Manage your payout addresses and priorities
          </p>
        </div>
        {walletSummary.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Active Wallets</p>
            <p className="text-2xl font-bold text-purple-600">{walletSummary.length}</p>
          </div>
        )}
      </div>

      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4 animate-fade-in">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Wallet Summary Cards */}
        {walletSummary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {walletSummary.map(wallet => (
              <div
                key={wallet.key}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-4 shadow-lg transform hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{wallet.icon}</span>
                    <div>
                      <p className="font-bold">{wallet.label}</p>
                      <p className="text-xs text-purple-100 truncate max-w-[150px]">
                        {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                      </p>
                    </div>
                  </div>
                  {wallet.priority > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                      #{wallet.priority}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crypto Selector Dropdown */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Cryptocurrency
          </label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            disabled={!currentUser?.emailVerified}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium bg-gradient-to-r from-gray-50 to-white"
          >
            {CRYPTO_TYPES.map(crypto => (
              <option key={crypto.key} value={crypto.key}>
                {crypto.icon} {crypto.label}
              </option>
            ))}
          </select>

          {/* Selected Wallet Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                {selectedCryptoData?.icon} {selectedCryptoData?.label} Address
              </label>
              {getPriorityBadge(currentWallet.priority)}
            </div>
            
            <input
              type="text"
              value={currentWallet.address}
              onChange={(e) => handleAddressChange(selectedCrypto, e.target.value)}
              disabled={!currentUser?.emailVerified}
              placeholder={currentUser?.emailVerified ? selectedCryptoData?.placeholder : 'Verify email to enable'}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
            />

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">⚡ Payout Priority</p>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={`priority-${selectedCrypto}`}
                    checked={currentWallet.priority === 0}
                    onChange={() => handlePriorityChange(selectedCrypto, 0)}
                    disabled={!currentUser?.emailVerified}
                    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition">None</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={`priority-${selectedCrypto}`}
                    checked={currentWallet.priority === 1}
                    onChange={() => handlePriorityChange(selectedCrypto, 1)}
                    disabled={!currentUser?.emailVerified}
                    className="w-5 h-5 text-yellow-500 border-gray-300 focus:ring-yellow-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition">⭐ Priority #1</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={`priority-${selectedCrypto}`}
                    checked={currentWallet.priority === 2}
                    onChange={() => handlePriorityChange(selectedCrypto, 2)}
                    disabled={!currentUser?.emailVerified}
                    className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition">🥈 Priority #2</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !currentUser?.emailVerified}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : !currentUser?.emailVerified ? (
            '🔒 Verify Email First'
          ) : (
            '💾 Save Wallet Addresses'
          )}
        </button>
      </form>

      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center text-lg">
          <span className="text-2xl mr-2">ℹ️</span>
          How Priority Works
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="text-yellow-500 mr-2">⭐</span>
            <span><strong>Priority #1:</strong> Your primary payout wallet - payments are sent here first</span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">🥈</span>
            <span><strong>Priority #2:</strong> Backup wallet used if Priority #1 fails</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">💡</span>
            <span>Only one wallet can have each priority level at a time</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

