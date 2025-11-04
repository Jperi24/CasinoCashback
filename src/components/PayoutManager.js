import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function PayoutManager({ referral, casino, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddPayout = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payout = {
        month,
        amount: parseFloat(amount),
        currency,
        paidAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'referrals', referral.id), {
        monthlyPayouts: arrayUnion(payout)
      });

      setAmount('');
      setShowForm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      setError('Failed to add payout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const payouts = referral.monthlyPayouts || [];
  const totalPaid = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="border-t mt-3 pt-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Payouts:</p>
          <p className="text-lg font-bold text-green-600">${totalPaid.toFixed(2)} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
        >
          {showForm ? 'Cancel' : '+ Add Payout'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPayout} className="bg-gray-50 p-3 rounded mt-2 space-y-2">
          {error && (
            <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Month
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-600"
              >
                <option value="USD">USD</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
                <option value="BASE">BASE</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Payout'}
          </button>
        </form>
      )}

      {payouts.length > 0 && (
        <div className="mt-2 space-y-1">
          {payouts.slice(-3).reverse().map((payout, idx) => (
            <div key={idx} className="flex justify-between text-xs text-gray-600">
              <span>{payout.month}</span>
              <span className="font-medium">${payout.amount?.toFixed(2)} {payout.currency}</span>
            </div>
          ))}
          {payouts.length > 3 && (
            <p className="text-xs text-gray-500 italic">+{payouts.length - 3} more...</p>
          )}
        </div>
      )}
    </div>
  );
}






