import React from 'react';
import './StaticPage.css';

export default function Cancellations() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Cancellations & Refunds</h1>
      <div className="static-content">
        <p>We understand that plans can change. Our cancellation policy is designed to be as flexible as possible.</p>
        <ul>
          <li><strong>30+ Days before departure:</strong> 100% full refund (excluding flight cancellation charges if applicable).</li>
          <li><strong>15-30 Days before departure:</strong> 50% refund on the package cost.</li>
          <li><strong>Less than 15 Days:</strong> Non-refundable.</li>
        </ul>
        <p>Please contact our support team at info@asquaretravelgoa.com to process any cancellations.</p>
      </div>
    </div>
  );
}
