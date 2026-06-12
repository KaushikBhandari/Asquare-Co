import React from 'react';
import './StaticPage.css';

export default function TermsOfService() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Terms of Service</h1>
      <div className="static-content">
        <p>By using the Asquaretravelgoa website and booking our services, you agree to the following terms and conditions:</p>
        <ul>
          <li><strong>Bookings:</strong> All bookings are subject to availability and confirmation.</li>
          <li><strong>Payments:</strong> A deposit is required to secure your booking. Full payment must be made before departure.</li>
          <li><strong>Changes:</strong> Any changes to a confirmed booking may incur additional charges.</li>
          <li><strong>Liability:</strong> Asquaretravelgoa acts as an agent for airlines, hotels, and transport operators and is not liable for their defaults.</li>
        </ul>
      </div>
    </div>
  );
}
