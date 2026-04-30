// Firebase Configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// Get them from: https://console.firebase.google.com → Your Project → Settings → General → Your Apps
// Steps to set up:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g., "wanderlux-travel")
// 3. Add a Web App to the project
// 4. Copy the firebaseConfig object and paste it here
// 5. Enable Authentication → Sign-in Method → Google and Email/Password
// 6. Enable Firestore Database (start in test mode)

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

// ⚠️  REPLACE WITH YOUR FIREBASE CONFIG ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyCDgSr61HeKel0nXzgTzfdj9ovRTSAQdKI",
  authDomain: "tourism-963ea.firebaseapp.com",
  projectId: "tourism-963ea",
  storageBucket: "tourism-963ea.firebasestorage.app",
  messagingSenderId: "547490649442",
  appId: "1:547490649442:web:b277bcd8d1580f66ab483b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── AUTH HELPERS ──────────────────────────────────────────────
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user, 'google');
    return { user: result.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
};

export const registerWithEmail = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await saveUserToFirestore(result.user, 'email', name);
    return { user: result.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
};

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// ── FIRESTORE HELPERS ─────────────────────────────────────────
const saveUserToFirestore = async (user, provider, displayName) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: displayName || user.displayName || user.email.split('@')[0],
      email: user.email,
      photo: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email)}&background=FF6B35&color=fff`,
      provider,
      createdAt: serverTimestamp(),
      role: 'user'
    });
  }
};

export const saveBooking = async (booking) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: serverTimestamp(),
      status: 'confirmed'
    });
    return { id: docRef.id, error: null };
  } catch (err) {
    return { id: null, error: err.message };
  }
};

export const getBookings = async () => {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const getUsers = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, 'bookings', id), { status });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

// ── ENQUIRY HELPERS ───────────────────────────────────────────
export const saveEnquiry = async (enquiry) => {
  try {
    const docRef = await addDoc(collection(db, 'enquiries'), {
      ...enquiry,
      createdAt: serverTimestamp(),
      status: 'new',
    });
    return { id: docRef.id, error: null };
  } catch (err) {
    return { id: null, error: err.message };
  }
};

export const getEnquiries = async () => {
  try {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const updateEnquiryStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, 'enquiries', id), { status });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

// ── ADMIN DESTINATIONS HELPERS ────────────────────────────────
export const saveAdminDestination = async (dest) => {
  try {
    const docRef = await addDoc(collection(db, 'adminDestinations'), {
      ...dest,
      createdAt: serverTimestamp(),
      active: true,
    });
    return { id: docRef.id, error: null };
  } catch (err) {
    return { id: null, error: err.message };
  }
};

export const getAdminDestinations = async () => {
  try {
    const snap = await getDocs(collection(db, 'adminDestinations'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const deleteAdminDestination = async (id) => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'adminDestinations', id));
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

// ── ADMIN PACKAGES HELPERS ────────────────────────────────────
export const saveAdminPackage = async (pkg) => {
  try {
    const docRef = await addDoc(collection(db, 'adminPackages'), {
      ...pkg,
      createdAt: serverTimestamp(),
      active: true,
    });
    return { id: docRef.id, error: null };
  } catch (err) {
    return { id: null, error: err.message };
  }
};

export const updateAdminPackage = async (id, data) => {
  try {
    await updateDoc(doc(db, 'adminPackages', id), data);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

export const getAdminPackages = async () => {
  try {
    const snap = await getDocs(collection(db, 'adminPackages'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
};

export const deleteAdminPackage = async (id) => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'adminPackages', id));
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

export const updateAdminDestination = async (id, data) => {
  try {
    await updateDoc(doc(db, 'adminDestinations', id), data);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};
