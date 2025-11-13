import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How does Stakeback work?",
          a: "Stakeback is simple: sign up for participating casinos through our referral links, play as you normally would, and receive up to 40% cashback on your net losses every month. We track your activity and automatically send payouts to your crypto wallet."
        },
        {
          q: "How do I get started?",
          a: "Getting started is easy! First, create an account and verify your email. Then, add your crypto wallet for payouts. Finally, visit the 'Join Casino' page to select a casino, sign up using our referral link and code, and submit your casino account details to us."
        },
        {
          q: "Is there a fee to use Stakeback?",
          a: "No! Stakeback is completely free to use. There are no signup fees, monthly charges, or hidden costs. You simply receive cashback on your net losses every month."
        }
      ]
    },
    {
      category: "Payouts",
      questions: [
        {
          q: "When do I receive my cashback?",
          a: "Cashback is calculated and paid out monthly, typically within the first week of each month for the previous month's activity. For example, cashback earned in January will be paid out in early February."
        },
        {
          q: "How is cashback calculated?",
          a: "Cashback is calculated based on your net losses for the month. Net losses = total wagered - total winnings. You receive a percentage of this amount (varies by casino and region, up to 40%). For example, if you receive 20% and wagered $1,000 and won $700, your net loss is $300, and you'd receive $60 cashback."
        },
        {
          q: "What cryptocurrencies do you support?",
          a: "We support all major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and many others. You can manage multiple wallet addresses in your dashboard and set a priority wallet for automatic payouts."
        },
        {
          q: "What if I don't have any losses for a month?",
          a: "If you break even or have net winnings for a month, there won't be any cashback for that period. Cashback is only calculated on net losses. Your account remains active and eligible for future months."
        }
      ]
    },
    {
      category: "Casino Accounts",
      questions: [
        {
          q: "Can I join multiple casinos?",
          a: "Absolutely! You can join as many participating casinos as you like. Each casino will be tracked separately, and you'll receive cashback for each one independently."
        },
        {
          q: "Do I need to use a referral code?",
          a: "Some casinos require a referral code, while others track automatically through the referral link. When you select a casino on the 'Join Casino' page, we'll show you if a referral code is needed and provide it for easy copying."
        },
        {
          q: "What if I already have an account at a casino?",
          a: "Unfortunately, cashback only applies to new accounts created through our referral links. Existing accounts cannot be retroactively linked to our cashback program."
        },
        {
          q: "Can I update my casino account details?",
          a: "Yes! You can edit your username and email address for each casino directly from your dashboard. Just click the 'Edit Details' button on any casino card."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "Is my information secure?",
          a: "Yes! We take security seriously. All data is encrypted and stored securely using industry-standard practices. We only collect information necessary to track your cashback and process payouts."
        },
        {
          q: "Why do I need to verify my email?",
          a: "Email verification ensures account security and allows us to send you important notifications about payouts and account activity. You must verify your email before submitting casino referrals."
        },
        {
          q: "Can I change my crypto wallet address?",
          a: "Yes, you can add, remove, or update your crypto wallet addresses at any time from your dashboard. Make sure your priority wallet is always up to date to receive automatic payouts."
        },
        {
          q: "How do I delete my account?",
          a: "If you wish to delete your account, please contact us through the Contact page. We'll process your request and remove all personal information in accordance with our privacy policy."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          q: "I signed up for a casino but don't see it in my dashboard",
          a: "Make sure you submitted your casino details through the 'Join Casino' page after creating your casino account. If you did and still don't see it, check that you're logged into the correct account, or contact support."
        },
        {
          q: "My cashback amount seems incorrect",
          a: "Cashback is calculated by the casino and verified by our team. If you believe there's an error, please contact us with your casino username and the specific month in question, and we'll investigate."
        },
        {
          q: "I didn't receive my payout",
          a: "Payouts are typically processed in the first week of each month. Make sure you have a valid crypto wallet set as your priority wallet. If it's been more than 10 days, please contact support with your transaction details."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  // Create structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category =>
      category.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  return (
    <>
      <SEO
        title="FAQ - Frequently Asked Questions | StakeBack Casino Cashback"
        description="Get answers to common questions about StakeBack casino cashback program. Learn how to earn up to 40% monthly crypto rewards, payout schedules, supported cryptocurrencies, and more."
        keywords="casino cashback faq, stakeback help, casino rewards questions, crypto cashback help, casino bonus questions, how does casino cashback work"
        canonicalUrl="https://stakeback.xyz/faq"
        structuredData={faqStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about Stakeback
          </p>
        </div>

        {/* Quick Help Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">Can't find what you're looking for?</h3>
                <p className="text-sm text-blue-800">Our support team is here to help you!</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-lg whitespace-nowrap"
            >
              📧 Contact Support
            </Link>
          </div>
        </div>

        {/* FAQ Categories */}
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600">📌</span>
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, questionIndex) => {
                const index = `${categoryIndex}-${questionIndex}`;
                const isOpen = openIndex === index;
                
                return (
                  <div
                    key={questionIndex}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                  >
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-purple-50 transition"
                    >
                      <span className="font-bold text-gray-900 flex-1">{item.q}</span>
                      <svg
                        className={`w-5 h-5 text-purple-600 transition-transform ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-700 border-t border-gray-100 pt-4 animate-fade-in">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center mt-12">
          <h2 className="text-3xl font-black mb-3">Ready to Start Earning Cashback?</h2>
          <p className="text-purple-100 mb-6">Join Stakeback today and get up to 40% back on your casino play!</p>
          <Link
            to="/signup"
            className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition shadow-lg text-lg"
          >
            🚀 Sign Up Now
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

