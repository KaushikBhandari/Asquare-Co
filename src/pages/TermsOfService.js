import React from 'react';
import './StaticPage.css';

export default function TermsOfService() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Terms of Service</h1>
      <div className="static-content">
        <p>By using the Asquaretravelgoa website and booking our services, you agree to the following terms and conditions:</p>
        
        <h2>1. User Agreement</h2>
        <p>By using our website, you agree to comply with and be legally bound by these terms. This includes our Privacy Policy and any other guidelines we provide. If you do not agree, please do not use our services.</p>

        <h2>2. Bookings and Payments</h2>
        <ul>
          <li>All bookings are subject to availability and confirmation from our suppliers.</li>
          <li>A deposit is required to secure your booking. Full payment must be made before departure as per the payment schedule provided at the time of booking.</li>
          <li>Fares and rates are subject to change until the booking is confirmed and ticketed.</li>
        </ul>

        <h2>3. Cancellations and Refunds</h2>
        <ul>
          <li><strong>If the trip is cancelled by the user, you will be eligible for a refund. However, any cancellation fees imposed by airlines, hotels, transport operators, and other third-party vendors will be deducted from your final refund amount.</strong></li>
          <li>Cancellation requests must be submitted to us in writing.</li>
          <li>Refund processing times may vary based on third-party vendor policies.</li>
        </ul>

        <h2>4. Modifications to Bookings</h2>
        <p>Any changes to a confirmed booking (e.g., dates, names, or itinerary) may incur additional amendment charges and difference in fare, subject to supplier policies.</p>

        <h2>5. Third-Party Liability</h2>
        <p>Asquaretravelgoa acts merely as an agent for airlines, hotels, and other service providers. We are not liable for any delays, defaults, accidents, or service failures on the part of these independent contractors.</p>

        <h2>6. Travel Documents</h2>
        <p>It is the passenger's responsibility to ensure they have valid travel documents, including passports, visas, and necessary health requirements. We are not responsible if you are denied entry or boarding due to inadequate documentation.</p>

      </div>
    </div>
  );
}
