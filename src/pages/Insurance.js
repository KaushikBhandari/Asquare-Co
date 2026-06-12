import React from 'react';
import './StaticPage.css';

export default function Insurance() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Travel Insurance</h1>
      <div className="static-content">
        <p>We strongly recommend all our travelers to be fully insured. While some of our premium packages include basic coverage, we advise purchasing comprehensive travel insurance for:</p>
        <ul>
          <li>Medical Emergencies & Evacuation</li>
          <li>Trip Cancellations or Delays</li>
          <li>Lost Baggage</li>
          <li>Personal Accidents</li>
        </ul>
        <p>Speak to our travel experts during your booking process to add insurance to your package.</p>
      </div>
    </div>
  );
}
