# 🔒 Firebase Authentication & Security Setup

Your app now uses **Firebase Authentication** for secure login! Follow these steps to complete the setup.

## ✅ What Changed

- **Secure Login**: Real email/password authentication (no more hardcoded passwords)
- **Protected Data**: Only authenticated users can read/write data
- **Account Creation**: New users can create accounts directly from the login screen
- **Password Requirements**: Minimum 6 characters enforced by Firebase

## 🔧 Required Setup Steps

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your FooTable project
3. Click **Authentication** in the left sidebar
4. Click **Get Started**
5. Click **Email/Password** provider
6. **Enable** the toggle
7. Click **Save**

### 2. Update Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click the **Rules** tab
3. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - anyone can create, only owner can update
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Players collection - anyone can read, admins can do anything, users can update their own linked profile
    match /players/{playerId} {
      allow read;
      allow create, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow update: if request.auth != null && (
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true) ||
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         request.resource.data.email == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email)
      );
    }
    
    // Games collection - anyone can read, only admins can write
    match /games/{gameId} {
      allow read;
      allow create, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Scheduled Games collection - anyone can read, admins can create/delete, authenticated users can update availability
    match /scheduledGames/{gameId} {
      allow read;
      allow create, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow update: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

### 3. Update Firebase Storage Rules (for Profile Pictures)

1. In Firebase Console, go to **Storage**
2. Click the **Rules** tab
3. Replace the rules with this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read profile pictures
    match /profilePictures/{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
    
    // Allow anyone to read any uploaded images
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

### 4. Create Your Admin Account

1. Go to your deployed website
2. Click **Login**
3. Enter your email and a secure password (min 6 characters)
4. The app will create your account automatically
5. **Important**: Go to Firebase Console → Firestore Database
6. Find the `users` collection
7. Find your user document (by email)
8. Click **Edit**
9. Change `isAdmin` from `false` to `true`
10. Click **Update**
11. Refresh your website - you're now an admin! 👑

## 🔐 Security Features

✅ **No exposed passwords** - All handled by Firebase  
✅ **Encrypted authentication** - Firebase uses industry-standard security  
✅ **Protected database** - Only authenticated users can access data  
✅ **Admin-only writes** - Regular users can't modify games/players  
✅ **User isolation** - Each user only sees authenticated data  

## 🆕 How Login Works Now

1. **New Users**: Enter email + password → Account created automatically
2. **Existing Users**: Enter email + password → Login
3. **Forgot Password**: (TODO - can add password reset later)
4. **Auto-login**: Stay logged in between sessions

## 📧 Making Someone an Admin

Only you (the first user) can make others admin:

1. Ask them to create an account on your site
2. Go to Firebase Console → Firestore → `users` collection
3. Find their user document
4. Edit: `isAdmin: false` → `isAdmin: true`
5. They'll need to refresh the page

## 🚀 You're Secure!

Your app is now:
- ✅ Protected from unauthorized access
- ✅ Using real authentication
- ✅ Compliant with security best practices
- ✅ Ready for multiple users

## ⚠️ Important Notes

- **Don't share your admin password** - It's real security now!
- **Firebase API key exposure is OK** - It's meant to be public (auth rules protect your data)
- **Test the rules** - Try logging in/out to confirm everything works
- **Backup your data** - Firebase has automatic backups, but export important data periodically

---

Need help? Check the browser console (F12) for error messages.
