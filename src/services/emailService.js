// ══════════════════════════════════════════════════════════════
// EMAIL SERVICE — Using EmailJS (free, no backend needed)
//
// SETUP STEPS (5 minutes):
// 1. Go to https://www.emailjs.com and create a FREE account
// 2. Add Email Service → Connect your Gmail
// 3. Create TWO Email Templates (see templates below)
// 4. Go to Account → API Keys → copy your Public Key
// 5. Replace the values below with your actual IDs
// ══════════════════════════════════════════════════════════════

// ⚠️ REPLACE THESE WITH YOUR EMAILJS VALUES ⚠️
const EMAILJS_PUBLIC_KEY  = 'GkyLDyJXUEa5DAbb9';       // Account → API Keys
const EMAILJS_SERVICE_ID  = 'service_nbyger4';       // Email Services → Service ID
const EMAILJS_CUSTOMER_TEMPLATE = 'template_48i04x7'; // Template 1 ID
const EMAILJS_ADMIN_TEMPLATE    = 'template_htz8aei';    // Template 2 ID

// ── Load EmailJS from CDN ──────────────────────────────────────
const loadEmailJS = () => new Promise((resolve) => {
  if (window.emailjs) { resolve(window.emailjs); return; }
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    resolve(window.emailjs);
  };
  document.head.appendChild(script);
});

// ── Send confirmation email to CUSTOMER ───────────────────────
export const sendCustomerConfirmation = async (enquiry) => {
  try {
    const ejs = await loadEmailJS();
    await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, {
      to_name:       enquiry.firstName || enquiry.customerName,
      to_email:      enquiry.email,
      ref_id:        enquiry.id || ('WL' + Date.now()),
      package_name:  enquiry.selectedPackage,
      destinations:  enquiry.packageDestinations,
      duration:      enquiry.packageDuration,
      travelers:     enquiry.travelers,
      departure:     enquiry.departureDate || 'Flexible',
      trip_type:     enquiry.tripType,
      budget:        enquiry.budget,
      est_price:     `$${Number(enquiry.packagePrice || 0).toLocaleString()}`,
      message:       enquiry.customerMessage || 'No special requests',
      company_name:  'Asquare & Co. Tours & Travels',
      company_email: 'info@asquareco.com',  // ← your company email
      company_phone: '+91 XXXXX XXXXX',     // ← your phone
    });
    console.log('✅ Customer email sent');
    return true;
  } catch (err) {
    console.warn('EmailJS not configured yet:', err.message);
    return false;
  }
};

// ── Send notification email to ADMIN ──────────────────────────
export const sendAdminNotification = async (enquiry) => {
  try {
    const ejs = await loadEmailJS();
    await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE, {
      ref_id:          enquiry.id || ('WL' + Date.now()),
      customer_name:   enquiry.customerName,
      customer_email:  enquiry.email,
      customer_phone:  enquiry.phone,
      customer_city:   enquiry.city || '—',
      package_name:    enquiry.selectedPackage,
      destinations:    enquiry.packageDestinations,
      duration:        enquiry.packageDuration,
      travelers:       enquiry.travelers,
      departure:       enquiry.departureDate || 'Flexible',
      return_date:     enquiry.returnDate || 'Flexible',
      trip_type:       enquiry.tripType,
      room_type:       enquiry.roomType,
      budget:          enquiry.budget,
      est_price:       `$${Number(enquiry.packagePrice || 0).toLocaleString()}`,
      customer_message: enquiry.customerMessage || 'No special requests',
      submitted_at:    new Date().toLocaleString('en-IN'),
      admin_email:     'info@asquareco.com', // ← your admin email
    });
    console.log('✅ Admin notification sent');
    return true;
  } catch (err) {
    console.warn('Admin email failed:', err.message);
    return false;
  }
};

// ══════════════════════════════════════════════════════════════
// EMAILJS TEMPLATE GUIDE
//
// ── TEMPLATE 1: Customer Confirmation (template_customer) ──────
// Subject: Your Trip Enquiry Confirmed — {{package_name}} | {{company_name}}
//
// Body:
// Hi {{to_name}},
//
// 🎉 Thank you for enquiring with {{company_name}}!
//
// Your enquiry has been received. Our travel expert will contact
// you within 2 hours with a personalised quote.
//
// ━━━ YOUR ENQUIRY DETAILS ━━━
// Reference ID   : {{ref_id}}
// Selected Trip  : {{package_name}}
// Destinations   : {{destinations}}
// Duration       : {{duration}}
// Travelers      : {{travelers}}
// Departure Date : {{departure}}
// Trip Type      : {{trip_type}}
// Budget         : {{budget}}
// Starting Price : {{est_price}}/person
// Your Message   : {{message}}
//
// ━━━ WHAT HAPPENS NEXT ━━━
// 1. Our expert reviews your enquiry
// 2. We call / email you within 2 hours
// 3. We send a customised itinerary & quote
// 4. You confirm and we handle everything!
//
// Questions? Reply to this email or call us at {{company_phone}}
//
// Warm regards,
// {{company_name}}
// {{company_email}} | {{company_phone}}
//
// ── TEMPLATE 2: Admin Notification (template_admin) ────────────
// Subject: 🔔 New Enquiry — {{customer_name}} | {{package_name}}
//
// Body:
// NEW ENQUIRY RECEIVED
//
// ━━━ CUSTOMER DETAILS ━━━
// Name    : {{customer_name}}
// Email   : {{customer_email}}
// Phone   : {{customer_phone}}
// City    : {{customer_city}}
//
// ━━━ TRIP DETAILS ━━━
// Package     : {{package_name}}
// Destination : {{destinations}}
// Duration    : {{duration}}
// Travelers   : {{travelers}}
// Departure   : {{departure}}
// Return      : {{return_date}}
// Trip Type   : {{trip_type}}
// Room Type   : {{room_type}}
// Budget      : {{budget}}
// Est. Price  : {{est_price}}/person
//
// Customer Message:
// "{{customer_message}}"
//
// Submitted At: {{submitted_at}}
// Ref ID: {{ref_id}}
//
// ━━━ QUICK REPLY TEMPLATE ━━━
// (Copy this to reply to the customer)
//
// Hi {{customer_name}},
//
// Thank you for your interest in {{package_name}} with
// Asquare & Co. Tours & Travels!
//
// We've reviewed your enquiry and are excited to help you plan
// this trip. Based on your preferences, here is what we suggest:
//
// [ADD YOUR ITINERARY / QUOTE HERE]
//
// To confirm your booking or discuss further, please reply to
// this email or call us directly.
//
// Looking forward to crafting your perfect trip!
//
// Warm regards,
// Asquare & Co. Tours & Travels
// ══════════════════════════════════════════════════════════════
