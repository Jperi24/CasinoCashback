import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  orderBy 
} from 'firebase/firestore';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import { useNavigate } from 'react-router-dom';

export default function JoinCasino() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [casinos, setCasinos] = useState([]);
  const [selectedCasino, setSelectedCasino] = useState('');
  const [username, setUsername] = useState('');
  const [usernameNA, setUsernameNA] = useState(false);
  const [useSameEmail, setUseSameEmail] = useState(true);
  const [casinoEmail, setCasinoEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [bannerScriptId, setBannerScriptId] = useState('');

  useEffect(() => {
    fetchCasinos();
  }, []);

  // Load casino banner script dynamically (only for script tags)
  useEffect(() => {
    const selectedCasinoData = casinos.find(c => c.id === selectedCasino);
    
    // Clean up previous script if exists
    if (bannerScriptId) {
      const oldScript = document.getElementById(bannerScriptId);
      if (oldScript) {
        oldScript.remove();
      }
    }

    // Only process if it's a script tag (not a regular image URL)
    if (selectedCasinoData?.bannerUrl && selectedCasinoData.bannerUrl.trim().startsWith('<script')) {
      // Extract script src from the banner HTML string
      const srcMatch = selectedCasinoData.bannerUrl.match(/src=["']([^"']+)["']/);
      
      if (srcMatch && srcMatch[1]) {
        // Decode HTML entities (like &amp; to &)
        const scriptSrc = srcMatch[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
        
        const scriptId = `casino-banner-${selectedCasino}`;
        
        // Create iframe to safely load the script (avoids document.write issues)
        const bannerContainer = document.getElementById('casino-banner-container');
        if (bannerContainer) {
          // Clear previous content
          bannerContainer.innerHTML = '';
          
          // Create an iframe
          const iframe = document.createElement('iframe');
          iframe.id = scriptId;
          iframe.style.width = '100%';
          iframe.style.height = '300px';
          iframe.style.border = 'none';
          iframe.style.overflow = 'hidden';
          
          bannerContainer.appendChild(iframe);
          setBannerScriptId(scriptId);
          
          // Write the script into the iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; overflow: hidden; }
                  * { box-sizing: border-box; }
                </style>
              </head>
              <body>
                <script type="text/javascript" src="${scriptSrc}"></script>
              </body>
            </html>
          `);
          iframeDoc.close();
          
          // Adjust iframe height based on content after load
          iframe.onload = () => {
            try {
              const iframeBody = iframe.contentDocument?.body || iframe.contentWindow?.document.body;
              if (iframeBody) {
                const height = Math.max(iframeBody.scrollHeight, 250);
                iframe.style.height = height + 'px';
              }
            } catch (e) {
              console.log('Could not adjust iframe height:', e);
              iframe.style.height = '300px';
            }
          };
        }
      }
    }

    // Cleanup function
    return () => {
      if (bannerScriptId) {
        const script = document.getElementById(bannerScriptId);
        if (script) {
          script.remove();
        }
      }
    };
  }, [selectedCasino, casinos]);

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

  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    
    if (!currentUser.emailVerified) {
      setError('Please verify your email address before submitting referrals.');
      return;
    }

    if (!selectedCasino) {
      setError('Please select a casino');
      return;
    }

    if (!usernameNA && !username.trim()) {
      setError('Please enter your casino username or check N/A');
      return;
    }

    if (!useSameEmail && !casinoEmail.trim()) {
      setError('Please enter your casino email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const emailToUse = useSameEmail ? currentUser.email : casinoEmail;

      await addDoc(collection(db, 'referrals'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: userProfile.displayName,
        casinoId: selectedCasino,
        casinoUsername: usernameNA ? 'N/A' : username,
        casinoEmail: emailToUse,
        useSameEmail: useSameEmail,
        status: 'active',
        createdAt: new Date().toISOString(),
        monthlyPayouts: []
      });

      setSuccess('Referral submitted successfully! Redirecting to dashboard...');
      setUsername('');
      setUsernameNA(false);
      setUseSameEmail(true);
      setCasinoEmail('');
      setSelectedCasino('');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError('Failed to submit referral: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCasinoData = casinos.find(c => c.id === selectedCasino);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-2">
            Join a New Casino
          </h1>
          <p className="text-gray-600 text-lg">Select a casino and start earning 20% cashback</p>
        </div>

        {/* Help Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <span className="text-3xl">ℹ️</span>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">How This Works</h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li><strong>Select a casino</strong> from the dropdown below</li>
                <li><strong>Click the sign-up link</strong> we provide and register (some casinos require a referral code, others don't)</li>
                <li><strong>Come back here</strong> and submit your casino username/email so we can verify and track your cashback</li>
                <li><strong>Get paid monthly!</strong> Receive 20% cashback on your net losses automatically to your crypto wallet</li>
              </ol>
            </div>
          </div>
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

        {/* Main Referral Submission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmitReferral} className="space-y-8">
            {/* Step 1: Select Casino */}
            <div className="border-l-4 border-purple-600 pl-6">
              <div className="flex items-center mb-3">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900">Select Your Casino</h3>
              </div>
              <select
                value={selectedCasino}
                onChange={(e) => setSelectedCasino(e.target.value)}
                required
                disabled={!currentUser.emailVerified}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                <option value="">Choose a casino to get started...</option>
                {casinos.map(casino => (
                  <option key={casino.id} value={casino.id}>
                    {casino.name}
                  </option>
                ))}
              </select>
              
              {casinos.length === 0 && (
                <p className="text-gray-500 italic mt-2">
                  No casinos available yet. Contact admin to add casinos.
                </p>
              )}
            </div>

            {/* Casino Banner & Instructions - Only shown when casino selected */}
            {selectedCasinoData && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                {/* Casino Banner - Script or Image */}
                {selectedCasinoData.bannerUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-white p-4 flex justify-center items-center min-h-[200px]">
                    {selectedCasinoData.bannerUrl.trim().startsWith('<script') ? (
                      // If it's a script tag, inject it dynamically
                      <div id="casino-banner-container" className="w-full flex justify-center"></div>
                    ) : (
                      // If it's a regular image URL, display as img
                      <img 
                        src={selectedCasinoData.bannerUrl} 
                        alt={`${selectedCasinoData.name} banner`}
                        className="max-w-full h-auto max-h-[400px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<p class="text-gray-500 text-sm">Banner image unavailable</p>';
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="bg-white rounded-lg p-6 shadow-md mb-4">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    🎰 {selectedCasinoData.name}
                  </h4>
                  
                  {/* Referral Code - Only show if not "No Code" */}
                  {selectedCasinoData.referralCode !== 'No Code' && (
                    <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Use this referral code:</p>
                      <div className="flex items-center justify-between bg-white px-4 py-3 rounded border-2 border-yellow-400">
                        <code className="text-2xl font-bold text-purple-600">{selectedCasinoData.referralCode}</code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCasinoData.referralCode);
                            setSuccess('Referral code copied to clipboard!');
                            setTimeout(() => setSuccess(''), 3000);
                          }}
                          className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                        >
                          Copy Code
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sign-up Link */}
                  {selectedCasinoData.signupUrl && (
                    <div className="mb-4">
                      <a
                        href={selectedCasinoData.signupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg text-lg"
                      >
                        🔗 Sign Up at {selectedCasinoData.name} →
                      </a>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h5 className="font-bold text-blue-900 mb-2">📋 Instructions:</h5>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Click the sign-up link above to visit {selectedCasinoData.name}</li>
                      {selectedCasinoData.referralCode !== 'No Code' ? (
                        <li>Create your account and use the referral code: <strong>{selectedCasinoData.referralCode}</strong></li>
                      ) : (
                        <li>Create your account - <strong>no referral code needed</strong>, just sign up through the link above</li>
                      )}
                      <li>Complete your registration on the casino site</li>
                      <li>Return here and fill out the form below to track your cashback</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Enter Your Details */}
            {selectedCasinoData && (
              <>
                <div className="border-l-4 border-purple-600 pl-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Enter Your Casino Details</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Username on {selectedCasinoData.name}
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={!usernameNA}
                        disabled={!currentUser.emailVerified || usernameNA}
                        placeholder="Enter the username you registered with"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <label className="flex items-center mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usernameNA}
                          onChange={(e) => {
                            setUsernameNA(e.target.checked);
                            if (e.target.checked) setUsername('');
                          }}
                          disabled={!currentUser.emailVerified}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          I haven't registered yet / No username available
                        </span>
                      </label>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center mb-3 cursor-pointer p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                        <input
                          type="checkbox"
                          checked={useSameEmail}
                          onChange={(e) => {
                            setUseSameEmail(e.target.checked);
                            if (e.target.checked) setCasinoEmail('');
                          }}
                          disabled={!currentUser.emailVerified}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          I used <span className="text-purple-600 font-bold">{currentUser?.email}</span> for this casino
                        </span>
                      </label>

                      {!useSameEmail && (
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email Address Used for This Casino
                          </label>
                          <input
                            type="email"
                            value={casinoEmail}
                            onChange={(e) => setCasinoEmail(e.target.value)}
                            required={!useSameEmail}
                            disabled={!currentUser.emailVerified}
                            placeholder="Enter the email you used to register"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 3: Submit */}
                <div className="border-l-4 border-purple-600 pl-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Submit for Verification</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Once submitted, we'll verify your referral and start tracking your monthly cashback!
                  </p>
                  <button
                    type="submit"
                    disabled={loading || !currentUser.emailVerified}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
                  >
                    {loading ? '⏳ Submitting...' : !currentUser.emailVerified ? '✉️ Verify Email First' : '✅ Submit Referral'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

