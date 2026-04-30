# ✈️ WanderLux Travel Agency — v2.0

A **stunning, production-ready travel agency website** built with React.js.
Vibrant coral + teal + cream light theme, Firebase authentication & Firestore database, chatbot, booking system, and admin dashboard.

---

## 🎨 Design Highlights

- **Color Palette:** Coral (#FF6B35) · Teal (#00A896) · Warm Sand · Cream White
- **Fonts:** Fraunces (display) · Syne (UI) · Nunito (body)
- **Animations:** Hero crossfade, bento grid cards, floating chips, marquee strip, counter animations, chatbot typing, smooth page transitions
- **Fully Responsive** — Mobile, tablet, and desktop

---

## 🚀 Features

| Feature | Details |
|---|---|
| 🏠 **Home Page** | Animated hero slider, smart search, marquee strip, bento destination grid, packages, testimonials, CTA |
| 🌍 **Destinations** | Filter by category, live search, sort, 9 destinations with highlights & wishlist |
| 📦 **Packages** | Featured all-inclusive packages + individual destinations |
| ✈️ **Booking** | 4-step wizard: Choose → Details → Payment → Confirmation |
| 💬 **AI Chatbot** | "Luxe" — smart keyword chatbot with quick replies & typing animation |
| 🔐 **Auth** | Google Sign-In + Email/Password via Firebase Authentication |
| 🗄️ **Database** | Firebase Firestore stores registrations & bookings |
| ⚙️ **Admin Dashboard** | Live KPIs, booking table, user registry, revenue stats, Firebase data |

---

## ⚡ Quick Start

```bash
# 1. Unzip and enter directory
cd WanderLux-v2

# 2. Install dependencies
npm install

# 3. Configure Firebase (see below!)

# 4. Start development server
npm start

# 5. Open http://localhost:3000
```

---

## 🔥 Firebase Setup (REQUIRED)

### Step 1 — Create Firebase Project

1. Go to **[https://console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"** → Name it `wanderlux-travel`
3. Disable Google Analytics (optional) → **Create project**

### Step 2 — Add Web App

1. Click the **Web icon** `</>`
2. Register app as `wanderlux-web`
3. **Copy the firebaseConfig object** — you'll need it next

### Step 3 — Update Config File

Open **`src/firebase/config.js`** and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← Your API Key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",     // ← Your Project ID
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc"
};
```

### Step 4 — Enable Authentication

1. Firebase Console → **Authentication** → **Get Started**
2. **Sign-in method** tab → Enable:
   - ✅ **Google** (set project support email)
   - ✅ **Email/Password**
3. **Authorized domains** → Add `localhost`

### Step 5 — Enable Firestore

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (for development)
3. Select a region → **Done**

### Step 6 — Firestore Security Rules (for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📁 Project Structure

```
src/
├── firebase/
│   └── config.js          ← Firebase init + all helpers
├── context/
│   ├── AuthContext.js      ← Authentication state
│   └── BookingContext.js   ← Booking state + Firestore
├── data/
│   └── travelData.js       ← Destinations, packages, testimonials
├── components/
│   ├── Navbar.js/.css
│   ├── AuthModal.js/.css   ← Google + Email sign-in
│   └── ChatBot.js/.css     ← Luxe AI travel assistant
├── pages/
│   ├── Home.js/.css        ← Landing page
│   ├── Destinations.js/.css
│   ├── Packages.js/.css
│   ├── BookingPage.js/.css ← 4-step booking wizard
│   └── AdminDashboard.js/.css ← Firebase-powered admin
└── styles/
    └── global.css          ← Design system + CSS variables
```

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **React Router 6** — Client-side routing
- **Firebase 10** — Auth + Firestore database
- **Lucide React** — Icons
- **React Hot Toast** — Notifications
- **Google Fonts** — Fraunces, Syne, Nunito

---

## 🌍 Adding Real Google OAuth (Production)

For production deployment, add your domain to Firebase → Authentication → Authorized domains.

For a custom domain with Google OAuth:
```
https://console.firebase.google.com → Authentication → Settings → Authorized domains → Add domain
```

---

## 📊 Admin Dashboard

The admin dashboard at `/admin` shows:
- **Live Firebase data** — real user registrations from Firestore `users/` collection
- **Booking management** — view, filter, cancel bookings from `bookings/` collection
- **Revenue stats** — total revenue, conversion rate, avg booking value
- **User registry** — all registered users with provider info (Google/Email)

Access: Sign in → click your avatar → **Dashboard**

---

## 🎯 Customization

### Change colors
Edit `src/styles/global.css` — all colors are CSS variables:
```css
:root {
  --coral: #FF6B35;    /* Primary */
  --teal:  #00A896;    /* Secondary */
  --cream: #FFF9F5;    /* Background */
}
```

### Add destinations
Edit `src/data/travelData.js` — add to the `destinations` array.

### Add packages
Edit `src/data/travelData.js` — add to the `packages` array.

---

## 📦 Build for Production

```bash
npm run build
```

Deploys to `build/` — upload to Netlify, Vercel, or Firebase Hosting.

```bash
# Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🙌 Credits

Built with ❤️ by WanderLux Dev Team
Images: [Unsplash](https://unsplash.com) | Icons: [Lucide](https://lucide.dev) | Database: [Firebase](https://firebase.google.com)
