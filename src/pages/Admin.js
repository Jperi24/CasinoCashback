import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc,
  updateDoc,
  doc,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import PayoutManager from '../components/PayoutManager';

export default function Admin() {
  const [casinos, setCasinos] = useState([]);
  const [allReferrals, setAllReferrals] = useState([]);
  const [newCasinoName, setNewCasinoName] = useState('');
  const [newCasinoCode, setNewCasinoCode] = useState('');
  const [newCasinoUrl, setNewCasinoUrl] = useState('');
  const [newCasinoBanner, setNewCasinoBanner] = useState('');
  const [newCasinoSignupUrl, setNewCasinoSignupUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('referrals'); // referrals, casinos, emails
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchCasinos(), fetchReferrals(), fetchUsers()]);
  };

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const snapshot = await getDocs(usersQuery);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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

  const fetchReferrals = async () => {
    try {
      const referralsQuery = query(
        collection(db, 'referrals'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(referralsQuery);
      const referralsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllReferrals(referralsList);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleAddCasino = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await addDoc(collection(db, 'casinos'), {
        name: newCasinoName,
        referralCode: newCasinoCode,
        url: newCasinoUrl,
        bannerUrl: newCasinoBanner,
        signupUrl: newCasinoSignupUrl,
        createdAt: new Date().toISOString()
      });

      setSuccess('Casino added successfully!');
      setNewCasinoName('');
      setNewCasinoCode('');
      setNewCasinoUrl('');
      setNewCasinoBanner('');
      setNewCasinoSignupUrl('');
      fetchCasinos();
    } catch (error) {
      setError('Failed to add casino: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCasino = async (casinoId) => {
    if (!window.confirm('Are you sure you want to delete this casino?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'casinos', casinoId));
      setSuccess('Casino deleted successfully!');
      fetchCasinos();
    } catch (error) {
      setError('Failed to delete casino: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      verified: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'active' ? '✅ Active' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportEmailsToCSV = (filterType = 'all') => {
    let exportData = [];

    // Build export data based on filter type
    users.forEach(user => {
      const userReferrals = allReferrals.filter(r => r.userId === user.id);
      const totalEarnings = userReferrals.reduce((total, ref) => {
        const payouts = ref.monthlyPayouts || [];
        return total + payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
      }, 0);

      const hasActiveReferrals = userReferrals.some(r => r.status === 'active' || r.status === 'verified' || r.status === 'pending');
      const hasPaidOut = totalEarnings > 0;

      // Apply filters
      if (filterType === 'active' && !hasActiveReferrals) return;
      if (filterType === 'paid' && !hasPaidOut) return;
      if (filterType === 'marketing' && user.emailPreferences?.marketing === false) return;

      exportData.push({
        email: user.email || '',
        displayName: user.displayName || '',
        activeCasinos: userReferrals.filter(r => r.status === 'active' || r.status === 'verified' || r.status === 'pending').length,
        totalEarnings: totalEarnings.toFixed(2),
        marketingOptIn: user.emailPreferences?.marketing !== false ? 'Yes' : 'No',
        updatesOptIn: user.emailPreferences?.updates !== false ? 'Yes' : 'No',
        monthlyReportOptIn: user.emailPreferences?.monthlyReport !== false ? 'Yes' : 'No',
        createdAt: user.createdAt || ''
      });
    });

    // Create CSV content
    const headers = ['Email', 'Name', 'Active Casinos', 'Total Earnings', 'Marketing', 'Updates', 'Monthly Report', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        `${row.email},"${row.displayName}",${row.activeCasinos},${row.totalEarnings},${row.marketingOptIn},${row.updatesOptIn},${row.monthlyReportOptIn},${row.createdAt}`
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stakeback-emails-${filterType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setSuccess(`Exported ${exportData.length} email addresses!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Admin Panel
        </h1>

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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'referrals'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Referral & Payout Management
            </button>
            <button
              onClick={() => setActiveTab('casinos')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'casinos'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Casino Management
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'emails'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📧 Email Management
            </button>
          </div>
        </div>

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="space-y-8">
            {/* All Referrals with Payout Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">All Referrals & Payouts</h2>
              
              {allReferrals.length === 0 ? (
                <p className="text-gray-500 italic">No referrals yet.</p>
              ) : (
                <div className="space-y-4">
                  {allReferrals.map(referral => {
                    const casino = casinos.find(c => c.id === referral.casinoId);
                    return (
                      <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{referral.userName}</h3>
                            <p className="text-sm text-gray-600">{referral.userEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm"><span className="font-medium">Casino:</span> {casino?.name || 'Unknown'}</p>
                            <p className="text-sm"><span className="font-medium">Username:</span> {referral.casinoUsername}</p>
                            <p className="text-sm">{getStatusBadge(referral.status)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <PayoutManager 
                          referral={referral} 
                          casino={casino}
                          onUpdate={fetchReferrals}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detailed Table View */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
              
              {allReferrals.length === 0 ? (
                <p className="text-gray-500 italic">No referrals yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Casino
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Casino Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Casino Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allReferrals.map(referral => {
                        const casino = casinos.find(c => c.id === referral.casinoId);
                        return (
                          <tr key={referral.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {referral.userName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {referral.userEmail}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {casino?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={referral.casinoUsername === 'N/A' ? 'text-gray-400 italic' : ''}>
                                {referral.casinoUsername}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {referral.casinoEmail || referral.userEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(referral.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Casinos Tab */}
        {activeTab === 'casinos' && (
          <div className="space-y-8">
            {/* Add Casino Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Casino</h2>
              
              <form onSubmit={handleAddCasino} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Casino Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCasinoName}
                    onChange={(e) => setNewCasinoName(e.target.value)}
                    required
                    placeholder="e.g. Stake.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCasinoCode}
                    onChange={(e) => setNewCasinoCode(e.target.value)}
                    required
                    placeholder="e.g. CASHBACK123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sign-Up Link (optional)
                  </label>
                  <input
                    type="url"
                    value={newCasinoSignupUrl}
                    onChange={(e) => setNewCasinoSignupUrl(e.target.value)}
                    placeholder="https://casino.com/register?ref=yourcode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Direct affiliate/referral sign-up link for users</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner (optional)
                  </label>
                  <textarea
                    value={newCasinoBanner}
                    onChange={(e) => setNewCasinoBanner(e.target.value)}
                    placeholder='Script tag: <script type="text/javascript" src="..."></script>&#10;OR&#10;Image URL: https://example.com/banner.jpg'
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste either a <strong>script tag</strong> (from affiliate network) OR a direct <strong>image URL</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Casino URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newCasinoUrl}
                    onChange={(e) => setNewCasinoUrl(e.target.value)}
                    placeholder="https://casino.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">General casino website URL</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Casino'}
                </button>
              </form>
            </div>

            {/* Existing Casinos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Existing Casinos</h2>
              
              {casinos.length === 0 ? (
                <p className="text-gray-500 italic">No casinos added yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {casinos.map(casino => (
                    <div key={casino.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{casino.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Referral Code:</span> <code className="bg-yellow-100 px-2 py-1 rounded text-purple-600">{casino.referralCode}</code>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCasino(casino.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {casino.signupUrl && (
                          <p className="text-gray-600">
                            <span className="font-medium">Sign-Up Link:</span>{' '}
                            <a
                              href={casino.signupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 underline break-all"
                            >
                              {casino.signupUrl}
                            </a>
                          </p>
                        )}
                        
                        {casino.bannerUrl && (
                          <div className="text-gray-600">
                            <span className="font-medium">Banner:</span>
                            <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto break-all">
                              {casino.bannerUrl.trim().startsWith('<script') 
                                ? casino.bannerUrl 
                                : `Image URL: ${casino.bannerUrl}`}
                            </div>
                            {!casino.bannerUrl.trim().startsWith('<script') && (
                              <div className="mt-2">
                                <img 
                                  src={casino.bannerUrl} 
                                  alt={`${casino.name} banner preview`}
                                  className="max-w-xs h-auto rounded border border-gray-300"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const errorMsg = document.createElement('p');
                                    errorMsg.className = 'text-red-600 text-xs mt-1';
                                    errorMsg.textContent = '⚠️ Invalid image URL';
                                    e.target.parentElement.appendChild(errorMsg);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {casino.url && (
                          <p className="text-gray-600">
                            <span className="font-medium">Website:</span>{' '}
                            <a
                              href={casino.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 underline"
                            >
                              {casino.url}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Management Tab */}
        {activeTab === 'emails' && (
          <div className="space-y-8">
            {/* Email Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-purple-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.emailPreferences?.marketing !== false).length}
                </div>
                <div className="text-sm text-gray-600">Marketing Opt-In</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-2">🎰</div>
                <div className="text-3xl font-bold text-blue-600">
                  {users.filter(u => allReferrals.some(r => r.userId === u.id && (r.status === 'active' || r.status === 'verified' || r.status === 'pending'))).length}
                </div>
                <div className="text-sm text-gray-600">Active Players</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-3xl font-bold text-emerald-600">
                  {users.filter(u => {
                    const userReferrals = allReferrals.filter(r => r.userId === u.id);
                    return userReferrals.some(ref => (ref.monthlyPayouts || []).length > 0);
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Paid Users</div>
              </div>
            </div>

            {/* Export Emails Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Export Email Lists</h2>
              <p className="text-gray-600 mb-6">
                Download email lists for use with Mailchimp, SendGrid, or other email marketing platforms
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => exportEmailsToCSV('all')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">📧</span>
                  <span>All Users</span>
                  <span className="text-xs opacity-75">({users.length} users)</span>
                </button>
                
                <button
                  onClick={() => exportEmailsToCSV('marketing')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">✅</span>
                  <span>Marketing Opt-In</span>
                  <span className="text-xs opacity-75">
                    ({users.filter(u => u.emailPreferences?.marketing !== false).length} users)
                  </span>
                </button>
                
                <button
                  onClick={() => exportEmailsToCSV('active')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">🎰</span>
                  <span>Active Players</span>
                  <span className="text-xs opacity-75">
                    ({users.filter(u => allReferrals.some(r => r.userId === u.id && (r.status === 'active' || r.status === 'verified' || r.status === 'pending'))).length} users)
                  </span>
                </button>
                
                <button
                  onClick={() => exportEmailsToCSV('paid')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">💰</span>
                  <span>Paid Users</span>
                  <span className="text-xs opacity-75">
                    ({users.filter(u => {
                      const userReferrals = allReferrals.filter(r => r.userId === u.id);
                      return userReferrals.some(ref => (ref.monthlyPayouts || []).length > 0);
                    }).length} users)
                  </span>
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">📋 CSV Includes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Email Address</li>
                  <li>• Display Name</li>
                  <li>• Number of Active Casinos</li>
                  <li>• Total Earnings</li>
                  <li>• Email Preferences (Marketing, Updates, Monthly Report)</li>
                  <li>• Account Creation Date</li>
                </ul>
              </div>
            </div>

            {/* Email Preferences Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Email Preferences Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-bold text-gray-900">📧 Marketing & Promotions</h3>
                    <p className="text-sm text-gray-600">Weekly newsletters and special offers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.emailPreferences?.marketing !== false).length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {users.length > 0 ? Math.round((users.filter(u => u.emailPreferences?.marketing !== false).length / users.length) * 100) : 0}% opted in
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-bold text-gray-900">🔔 Product Updates</h3>
                    <p className="text-sm text-gray-600">New casinos and features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.emailPreferences?.updates !== false).length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {users.length > 0 ? Math.round((users.filter(u => u.emailPreferences?.updates !== false).length / users.length) * 100) : 0}% opted in
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-bold text-gray-900">📊 Monthly Reports</h3>
                    <p className="text-sm text-gray-600">Earnings summaries and stats</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.emailPreferences?.monthlyReport !== false).length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {users.length > 0 ? Math.round((users.filter(u => u.emailPreferences?.monthlyReport !== false).length / users.length) * 100) : 0}% opted in
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

