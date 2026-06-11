import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveFeedback } from '../firebase/config';
import './FeedbackForm.css';

export default function FeedbackForm() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [ratings, setRatings] = useState({
    overall: 0,
    guide: 0,
    accommodation: 0,
    transport: 0,
    value: 0
  });
  
  const [hoveredRatings, setHoveredRatings] = useState({
    overall: 0,
    guide: 0,
    accommodation: 0,
    transport: 0,
    value: 0
  });

  const [highlight, setHighlight] = useState('');
  const [improvement, setImprovement] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleHover = (category, value) => {
    setHoveredRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ratings.overall === 0) {
      toast.error('Please select an overall rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    const feedbackData = {
      bookingId: bookingId || 'unknown',
      rating: ratings.overall,
      guideRating: ratings.guide,
      accommodationRating: ratings.accommodation,
      transportRating: ratings.transport,
      valueRating: ratings.value,
      comments,
      highlight,
      improvement
    };

    const { error } = await saveFeedback(feedbackData);
    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to submit feedback. Please try again later.');
    } else {
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    }
  };

  if (submitted) {
    return (
      <div className="feedback-page">
        <div className="feedback-container success-container">
          <CheckCircle className="success-icon" />
          <h2 className="success-title">Thank You!</h2>
          <p className="success-desc">
            Your feedback means the world to us. We use it to continually improve our travel experiences. We hope to see you on another adventure soon!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="home-btn"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (category) => (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRatings[category] || ratings[category]);
        return (
          <button
            type="button"
            key={star}
            onClick={() => handleRating(category, star)}
            onMouseEnter={() => handleHover(category, star)}
            onMouseLeave={() => handleHover(category, 0)}
            className={`star-btn ${isActive ? 'active' : 'inactive'}`}
          >
            <Star />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        
        <div className="feedback-header">
          <h1 className="feedback-title">How was your trip?</h1>
          <p className="feedback-subtitle">We'd love to hear about your experience with Asquare & Co.</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          
          <div className="rating-grid">
            <div className="rating-item rating-overall">
              <label className="rating-label">Overall Experience <span>*</span></label>
              {renderStars('overall')}
            </div>
            
            <div className="rating-item">
              <label className="rating-label">Tour Guide</label>
              {renderStars('guide')}
            </div>

            <div className="rating-item">
              <label className="rating-label">Accommodation</label>
              {renderStars('accommodation')}
            </div>

            <div className="rating-item">
              <label className="rating-label">Transport & Logistics</label>
              {renderStars('transport')}
            </div>

            <div className="rating-item">
              <label className="rating-label">Value for Money</label>
              {renderStars('value')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">What did you like the most?</label>
            <input 
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="e.g. The tour guide, the hotel, the food..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">What could be improved?</label>
            <textarea 
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              placeholder="Tell us what we can do better next time..."
              className="form-input"
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Any other comments?</label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share any other thoughts about your experience..."
              className="form-input"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                Submit Feedback
                <Send className="icon" size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
