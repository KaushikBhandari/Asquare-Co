import React from 'react';
import { Mail, Phone } from 'lucide-react';
import './StaticPage.css';

export default function HelpCenter() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Help Center</h1>
      <p className="section-lead" style={{textAlign: 'center', marginBottom: '30px'}}>How can we help you today?</p>
      <div className="static-content">
        <h3>Frequently Asked Questions</h3>
        <p><strong>Q: How do I book a trip?</strong><br/>A: You can book a trip by clicking on "Plan My Trip" or selecting "Enquire Now" on any package.</p>
        <p><strong>Q: Can I customise my package?</strong><br/>A: Absolutely! All our packages are 100% customisable to suit your preferences.</p>
        
        <h3>Contact Support</h3>
        <p style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Phone size={14}/> Support: +91 87671 17090 / +91 86685 60390</p>
        <p style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Phone size={14}/> Company: +91 95293 38747</p>
        <p style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={14}/> info@asquaretravelgoa.com</p>
      </div>
    </div>
  );
}
