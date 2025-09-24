import React from 'react';
import './ContactPage.css'; 
const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <p>We're here to help! Please feel free to reach out to us.</p>
        <div className="contact-details">
          <h2>Our Phone Numbers:</h2>
          <p className="phone-number">📞 123-456-7890</p>
          <p className="phone-number">📞 987-654-3210</p>
          <p className="phone-number">📞 555-555-5555</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;