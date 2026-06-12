import React from 'react';
import './StaticPage.css';

export default function CookiePolicy() {
  return (
    <div className="static-page container">
      <h1 className="display-title">Cookie Policy</h1>
      <div className="static-content">
        <p>We use cookies to enhance your browsing experience on our website.</p>
        <p>Cookies are small text files stored on your device that help us analyze site traffic and remember your preferences.</p>
        <p>You can choose to disable cookies through your browser settings, though some features of our website may not function properly as a result.</p>
      </div>
    </div>
  );
}
