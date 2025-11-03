# Troubleshooting Guide

## Signup Error: 400 Bad Request

### Error Message:
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=... 400 (Bad Request)
```

### Most Common Cause: Email/Password Authentication Not Enabled

This is the #1 reason for this error. Here's how to fix it:

#### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in the left sidebar
4. If you see "Get Started", click it
5. Click the **Sign-in method** tab at the top
6. Look for **Email/Password** in the Native providers list
7. Click on **Email/Password**
8. Toggle **Enable** ON (the first toggle switch)
9. Click **Save**

**Screenshot guide:**
```
Firebase Console
└── Authentication
    └── Sign-in method
        └── Native providers
            └── Email/Password [Click here]
                └── Enable [Toggle this ON] ⚪ → 🟢
                └── Save [Click]
```

#### Step 2: Verify Your .env File

Make sure you have a `.env` file in the root directory:

```
CasinoCashback/
├── .env          ← Must be here!
├── package.json
├── src/
└── ...
```

Your `.env` should look like this:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Important:** 
- NO quotes around values
- NO spaces around the `=` sign
- Each line should be a single environment variable

#### Step 3: Restart Your Development Server

After creating or modifying the `.env` file, you MUST restart:

```bash
# Stop the server (Ctrl+C)
# Then start it again:
npm start
```

React only loads environment variables on startup!

---

## Other Possible Issues

### Issue: "Firebase API Key is missing" in Console

**Solution:** 
1. Check that your `.env` file exists in the root directory
2. Restart your development server (`npm start`)
3. Open browser console (F12) and check for the debug messages

### Issue: "Invalid API Key"

**Solution:**
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps"
3. Copy the `apiKey` value exactly
4. Paste it into your `.env` file
5. Make sure there are no extra spaces or quotes
6. Restart the dev server

### Issue: Project Not Found / Does Not Exist

**Solution:**
1. Make sure you've created a Firebase project
2. Verify the Project ID matches in your `.env` file
3. Check that the project is active in Firebase Console

### Issue: "Quota Exceeded" or "Too Many Requests"

**Solution:**
This means you've hit Firebase's free tier limits:
- **Email sends:** 100/day on free tier
- **Sign-ups:** Unlimited, but rate-limited

Wait a few hours or upgrade to the Blaze plan.

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Firebase project created
- [ ] Email/Password authentication **enabled** in Firebase Console
- [ ] `.env` file exists in root directory
- [ ] `.env` file has all 6 required variables
- [ ] No quotes around environment variable values
- [ ] Development server restarted after creating/modifying `.env`
- [ ] Browser console shows Firebase config (check F12 → Console)
- [ ] No console errors about missing API keys

---

## Testing Your Firebase Connection

Add this to any page to test if Firebase is configured correctly:

```javascript
// In src/pages/Home.js or Dashboard.js, add to useEffect:
useEffect(() => {
  console.log('Firebase Auth:', auth);
  console.log('Firebase DB:', db);
}, []);
```

If you see proper objects (not undefined), Firebase is configured correctly.

---

## Still Having Issues?

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for the Firebase debug messages
4. Check if API Key exists
5. Look for any error messages

### Check Firebase Console

1. Go to Firebase Console → Authentication
2. Check if there are any error messages or warnings
3. Go to Usage tab to check if you've hit any limits

### Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `API key not valid` | Copy the correct API key from Firebase Console |
| `PROJECT_NOT_FOUND` | Check your Project ID in .env file |
| `CONFIGURATION_NOT_FOUND` | Enable Authentication in Firebase Console |
| `EMAIL_EXISTS` | This email is already registered (try logging in) |
| `WEAK_PASSWORD` | Password must be at least 6 characters |
| `INVALID_EMAIL` | Check the email format |

---

## Need More Help?

1. Check the Firebase Console logs
2. Check browser console for detailed error messages
3. Make sure you're using the latest Firebase SDK version
4. Try creating a new Firebase project and starting fresh
5. Check Firebase Status page: https://status.firebase.google.com/

---

## Pro Tip: Enable Debug Mode

To see more detailed Firebase errors, add this to `src/firebase.js`:

```javascript
import { getAuth, connectAuthEmulator } from 'firebase/auth';

export const auth = getAuth(app);

// Enable detailed error logging in development
if (process.env.NODE_ENV === 'development') {
  // This will show more detailed error messages
  auth.settings.appVerificationDisabledForTesting = false;
}
```




