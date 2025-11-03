# Casino Cashback Platform

A web application for managing casino referral cashback programs. Users sign up using casino referral codes and receive monthly crypto cashback on their losses.

## Features

- **User Authentication**: Secure signup and login with Firebase Authentication
- **Email Verification**: Required email verification before users can submit referrals or update information
- **Multi-Casino Support**: Support for multiple casinos with different referral codes
- **Referral Tracking**: Users submit their casino username for verification
- **Admin Panel**: Admins can verify referrals and manage casino listings
- **Crypto Payouts**: Users provide crypto addresses for monthly cashback payments
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

## Project Structure

```
casino-cashback/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar
│   │   └── PrivateRoute.js    # Protected route wrapper
│   ├── contexts/
│   │   └── AuthContext.js     # Authentication context
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── Signup.js          # User registration
│   │   ├── Login.js           # User login
│   │   ├── Dashboard.js       # User dashboard
│   │   └── Admin.js           # Admin panel
│   ├── App.js                 # Main app component
│   ├── index.js               # Entry point
│   ├── index.css              # Global styles
│   └── firebase.js            # Firebase configuration
├── package.json
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Get your Firebase configuration

### 3. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Configure Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Casinos collection
    match /casinos/{casinoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Referrals collection
    match /referrals/{referralId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Create Admin User

After creating your first user account:

1. Go to Firestore Database in Firebase Console
2. Find your user document in the `users` collection
3. Edit the document and change `role` from `"user"` to `"admin"`

### 6. Run the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Firestore Data Structure

### Collections

#### `users`
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  role: "user" | "admin",
  cryptoAddress: "0x...",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### `casinos`
```javascript
{
  name: "Stake.com",
  referralCode: "CASHBACK123",
  url: "https://stake.com",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

#### `referrals`
```javascript
{
  userId: "user_uid",
  userEmail: "user@example.com",
  userName: "John Doe",
  casinoId: "casino_id",
  casinoUsername: "johndoe123",
  status: "pending" | "verified" | "rejected",
  createdAt: "2024-01-01T00:00:00.000Z",
  verifiedAt: "2024-01-02T00:00:00.000Z" | null
}
```

## Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Verify Email**: Check your email and click the verification link
3. **Submit Referral**: Select a casino, enter your casino username, and submit
4. **Add Crypto Address**: Enter your wallet address for payouts
5. **Wait for Verification**: Admin will verify your referral
6. **Receive Cashback**: Get 20% monthly cashback on your losses

### For Admins

1. **Add Casinos**: Add new casino listings with referral codes
2. **Verify Referrals**: Review and verify user referral submissions
3. **Manage Users**: View all user referrals and their status
4. **Process Payouts**: Use user crypto addresses to send monthly payments (manual)

## Cashback Structure

- **Total Cashback**: 40% on user losses
- **User Receives**: 20%
- **Platform Keeps**: 20%
- **Payment Frequency**: Monthly
- **Payment Method**: Crypto (manual transfers)

## Email Verification

The platform requires email verification before users can:
- Submit casino referrals
- Update their crypto wallet address

This security measure helps prevent spam accounts and ensures legitimate users. See `EMAIL_VERIFICATION_GUIDE.md` for detailed information about the implementation and troubleshooting.

## Future Enhancements

- Automated crypto payments integration
- Loss tracking dashboard
- Payment history
- Email notifications
- Multi-crypto support
- Referral analytics
- User referral links (users can refer other users)

## Support

For issues or questions, please contact the administrator.

## License

Private - All Rights Reserved

