import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStar, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { getInstructorById } from '../data/instructors';
import './InstructorAvailability.css';

const InstructorAvailability = () => {
  const { id } = useParams();
  const instructor = getInstructorById(id);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time availability data from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!instructor) return;

      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 14);

        const startDateStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/availability/instructor/${instructor.id}?startDate=${startDateStr}&endDate=${endDateStr}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data = await response.json();
        setAvailabilityData(data.data || []);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [instructor]);

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Get time slots for selected date
  const getTimeSlotsForDate = (date) => {
    if (!date) return [];

    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilityData.find(
      (avail) => new Date(avail.date).toISOString().split('T')[0] === dateStr
    );

    return availability ? availability.timeSlots : [];
  };

  const dates = generateDates();
  const timeSlots = getTimeSlotsForDate(selectedDate);

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (!instructor) {
    return (
      <div className="availability-page">
        <div className="container">
          <h2>Instructor not found</h2>
          <Link to="/instructors" className="btn-back">Back to Instructors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <div className="container">
        {/* Back Button */}
        <Link to="/instructors" className="btn-back-link">
          <FaArrowLeft /> Back to Search
        </Link>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Loading availability...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>Unable to load availability. Please try again later.</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        {/* Instructor Header */}
        <div className="availability-header">
          <div className="instructor-info-header">
            <div className="instructor-avatar-large">
              {instructor.avatar}
            </div>
            <div className="instructor-details-header">
              <h1>{instructor.name}</h1>
              <div className="instructor-meta">
                <span className="rating">
                  <FaStar /> {instructor.rating} ({instructor.reviewCount} reviews)
                </span>
                <span className="location">
                  <FaMapMarkerAlt /> {instructor.location}
                </span>
                <span className="vehicle">
                  {instructor.vehicle} - {instructor.transmission}
                </span>
              </div>
              <div className="price-large">
                ${instructor.pricePerHour}/hr
              </div>
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="availability-section">
          <h2><FaCalendarAlt /> Select a Date</h2>

          {/* Date Selector */}
          <div className="date-selector">
            {dates.map((date, index) => {
              const formatted = formatDate(date);
              const selected = selectedDate && date.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={index}
                  className={`date-card ${selected ? 'selected' : ''} ${isToday(date) ? 'today' : ''}`}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                >
                  <div className="date-day">{formatted.day}</div>
                  <div className="date-number">{formatted.date}</div>
                  <div className="date-month">{formatted.month}</div>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          {selectedDate && !loading && (
            <div className="time-slots-section">
              <h3><FaClock /> Available Times for {formatDate(selectedDate).full}</h3>

              {timeSlots.length > 0 ? (
                <div className="time-slots-grid">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`time-slot ${!slot.available ? 'unavailable' : ''} ${
                        selectedTime === slot.time ? 'selected' : ''
                      }`}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                      {!slot.available && <span className="booked-label">Booked</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="no-availability">
                  <p>No availability set for this date. Please check other dates or contact the instructor.</p>
                </div>
              )}
            </div>
          )}

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Instructor:</span>
                  <strong>{instructor.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Date:</span>
                  <strong>{formatDate(selectedDate).full}</strong>
                </div>
                <div className="summary-row">
                  <span>Time:</span>
                  <strong>{selectedTime}</strong>
                </div>
                <div className="summary-row">
                  <span>Duration:</span>
                  <strong>1 hour</strong>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <strong>${instructor.pricePerHour}</strong>
                </div>
              </div>

              <Link
                to={`/book/${instructor.id}`}
                state={{ date: selectedDate, time: selectedTime }}
                className="btn-continue-booking"
              >
                Continue to Booking
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorAvailability;
