// ── ADMIN CONFIGURATION ──────────────────────────────────────
// Only this email can access the admin dashboard
// Change this to YOUR email address
export const ADMIN_EMAIL = 'admin@asquareco.com'; // ← Replace with your email

export const isAdmin = (user) => {
  if (!user) return false;
  return user.email === ADMIN_EMAIL;
};
