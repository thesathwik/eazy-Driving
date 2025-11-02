import React from 'react';
import { Link } from 'react-router-dom';
import './InstructorCard.css';

const InstructorCard = ({ instructor }) => {
  return (
    <div className="instructor-card">
      <div className="instructor-badge">
        {instructor.verified && <span className="badge verified">✓ Verified</span>}
        {instructor.topRated && <span className="badge top-rated">Top Rated</span>}
      </div>

      <div className="instructor-header">
        <div className="instructor-avatar">
          {instructor.avatar || instructor.name.charAt(0)}
        </div>
        <div className="instructor-info">
          <h3>{instructor.name}</h3>
          <div className="instructor-rating">
            <span className="rating-stars">★ {instructor.rating}</span>
            <span className="rating-count">({instructor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="instructor-details">
        <div className="detail-item">
          <span className="detail-label">Experience:</span>
          <span className="detail-value">{instructor.experience} years</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Transmission:</span>
          <span className="detail-value">{instructor.transmission}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{instructor.location}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Vehicle:</span>
          <span className="detail-value">{instructor.vehicle}</span>
        </div>
      </div>

      <div className="instructor-specialties">
        {instructor.specialties.map((specialty, index) => (
          <span key={index} className="specialty-tag">
            {specialty}
          </span>
        ))}
      </div>

      <div className="instructor-price">
        <span className="price-label">From</span>
        <span className="price-amount">${instructor.pricePerHour}</span>
        <span className="price-unit">/hour</span>
      </div>

      <div className="instructor-actions">
        <Link to={`/instructor/${instructor.id}`} className="btn btn-view">
          View Profile
        </Link>
        <Link to={`/book/${instructor.id}`} className="btn btn-book">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default InstructorCard;
