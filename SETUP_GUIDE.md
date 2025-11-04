# Quick Setup Guide

Follow these steps to get your Stakeback platform up and running:

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Once created, click on the web icon (</>) to add a web app
5. Register your app and copy the configuration object

## Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and paste your Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click Save

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode** (we'll add rules next)
4. Select your location
5. Click Enable

## Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Copy the content from `firestore.rules` file in your project
3. Paste it into the rules editor
4. Click **Publish**

## Step 7: Start the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Step 8: Create Your Admin Account

1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create your first account (this will be your admin account)
3. **Important**: Check your email and verify your email address by clicking the link
4. After verifying, go to Firebase Console → Firestore Database
5. Find the `users` collection
6. Click on your user document
7. Edit the `role` field from `"user"` to `"admin"`
8. Save the changes
9. Log out and log back in to see the Admin Panel option

**Note**: Email verification is required for all users (including admins) to submit referrals or update information.

## Step 9: Add Your First Casino

1. Log in with your admin account
2. Click "Admin Panel" in the navigation
3. Go to "Casino Management" tab
4. Fill in the casino details:
   - Casino Name (e.g., "Stake.com")
   - Referral Code (your actual referral code)
   - Casino URL (optional)
5. Click "Add Casino"

## You're All Set! 🎉

Your platform is now ready to use:

- **Users** can sign up, submit referrals, and add crypto addresses
- **Admins** can verify referrals and manage casinos
- All data is securely stored in Firestore

## Next Steps

### For Production Deployment:

1. **Build the app**: `npm run build`
2. **Deploy to Firebase Hosting** (recommended):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

3. **Or deploy to any static hosting service** (Netlify, Vercel, etc.)

### Security Considerations:

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Keep your Firebase API keys secure
- Review Firestore security rules before going to production
- Consider adding rate limiting for form submissions

### Future Enhancements:

- Add email notifications using Firebase Cloud Functions
- Implement automated crypto payment tracking
- Create a payment history dashboard
- Add analytics to track referral performance
- Implement user-to-user referral system

## Troubleshooting

### Firebase initialization error
- Make sure all environment variables in `.env` are correct
- Check that there are no extra spaces or quotes around values

### Can't see Admin Panel
- Verify your user's `role` is set to `"admin"` in Firestore
- Log out and log back in after changing the role

### "Missing or insufficient permissions" error
- Check that Firestore security rules are properly configured
- Make sure you're logged in

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Support

For any issues or questions, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

