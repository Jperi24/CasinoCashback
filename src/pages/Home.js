import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Get Cashback on Your Casino Play
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Sign up using our referral codes and earn 10-40% cashback monthly on your casino losses. 
            Simple, transparent, and paid in crypto.
          </p>
          
          <div className="flex justify-center space-x-4">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg border-2 border-purple-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 mt-1">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Create Your Account</h3>
                    <p className="text-gray-600">
                      Sign up on our platform to access exclusive casino referral codes and links.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 mt-1">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Visit Casino via Our Link</h3>
                    <p className="text-gray-600">
                      Click the casino sign-up link provided in your dashboard to ensure tracking is enabled.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 mt-1">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Enter Our Referral Code</h3>
                    <p className="text-gray-600">
                      Use the referral code we provide when registering at the casino to activate cashback.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 mt-1">4</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Submit Your Casino Details</h3>
                    <p className="text-gray-600">
                      Return to your dashboard and submit the username and/or email you used to register at the casino for verification.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 mt-1">5</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">Receive 10-40% Cashback Monthly</h3>
                    <p className="text-gray-600">
                      Once verified, you'll automatically receive cashback on your net losses every month, paid directly to your crypto wallet within 5 business days of month-end.(Payout percentage is based on the casino and the country you are in and vary monthly)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Start Earning Cashback?</h3>
              <p className="text-lg mb-6">Join today and start receiving monthly cashback on your casino play!</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-lg"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <Link
                    to="/signup"
                    className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-lg"
                  >
                    Sign Up Now →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



