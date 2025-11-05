import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getInstructorById } from '../data/instructors';
import './BookingFlow.css';

const BookingFlow = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = getInstructorById(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('10hours');
  const [customHoursExpanded, setCustomHoursExpanded] = useState(false);
  const [customHours, setCustomHours] = useState(10);

  // Step 3: Book your lessons state
  const [bookings, setBookings] = useState([{
    id: 1,
    bookingType: '1hour',
    selectedDate: '',
    selectedTime: '',
    pickupLocation: ''
  }]);

  // Step 4: Learner Registration state
  const [registrationFor, setRegistrationFor] = useState('myself');
  const [learnerDetails, setLearnerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
    pickupAddress: '',
    suburb: '',
    state: 'Queensland',
    postcode: ''
  });

  const steps = [
    { number: 1, label: 'Instructor' },
    { number: 2, label: 'Amount' },
    { number: 3, label: 'Book your lessons' },
    { number: 4, label: 'Learner Registration' },
    { number: 5, label: 'Payment' }
  ];

  // Pricing calculations
  const hourlyRate = instructor?.pricePerHour || 80;

  const getPackageDetails = () => {
    if (selectedPackage === '10hours') {
      return {
        hours: 10,
        discount: 0.10,
        total: hourlyRate * 10,
        label: '10 hours'
      };
    } else if (selectedPackage === '6hours') {
      return {
        hours: 6,
        discount: 0.05,
        total: hourlyRate * 6,
        label: '6 hours'
      };
    } else {
      return {
        hours: customHours,
        discount: customHours >= 10 ? 0.10 : customHours >= 6 ? 0.05 : 0,
        total: hourlyRate * customHours,
        label: `${customHours} hours`
      };
    }
  };

  const packageDetails = getPackageDetails();
  const subtotal = packageDetails.total;
  const discount = subtotal * packageDetails.discount;
  const processingFee = (subtotal - discount) * 0.03; // 3% processing fee
  const totalDue = subtotal - discount + processingFee;

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Step 3: Booking handlers
  const handleBookingChange = (bookingId, field, value) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, [field]: value } : booking
    ));
  };

  const handleAddBooking = () => {
    const newBooking = {
      id: bookings.length + 1,
      bookingType: '1hour',
      selectedDate: '',
      selectedTime: '',
      pickupLocation: ''
    };
    setBookings([...bookings, newBooking]);
  };

  const handleRemoveBooking = (bookingId) => {
    if (bookings.length > 1) {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    }
  };

  // Step 4: Learner details handler
  const handleLearnerDetailsChange = (field, value) => {
    setLearnerDetails({ ...learnerDetails, [field]: value });
  };

  if (!instructor) {
    return (
      <div className="booking-flow">
        <div className="container">
          <h2>Instructor not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-flow">
      <div className="container">
        {/* Progress Steps */}
        <div className="booking-progress">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}>
                <div className="step-circle">
                  {currentStep > step.number ? <FaCheck /> : step.number}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`progress-line ${currentStep > step.number ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="booking-content">
          {/* Step 1: Instructor */}
          {currentStep === 1 && (
            <div className="booking-step">
              <h1>Choose your instructor</h1>
              <p className="step-subtitle">You've selected {instructor.name}</p>

              <div className="instructor-card-booking">
                <div className="instructor-header-booking">
                  <div className="instructor-avatar-booking">
                    {instructor.avatar}
                  </div>
                  <div className="instructor-info-booking">
                    <h3>{instructor.name}</h3>
                    <div className="rating-booking">
                      ⭐ {instructor.rating} · {instructor.reviewCount} ratings
                    </div>
                    <p className="location-booking">{instructor.location}</p>
                  </div>
                </div>
                <div className="instructor-details-booking">
                  <p><strong>Vehicle:</strong> {instructor.vehicle}</p>
                  <p><strong>Transmission:</strong> {instructor.transmission}</p>
                  <p><strong>Experience:</strong> {instructor.experience} years</p>
                </div>
              </div>

              <button className="btn-continue" onClick={handleContinue}>
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Amount */}
          {currentStep === 2 && (
            <div className="booking-step">
              <div className="booking-main-content">
                <h1>Choose lesson amount</h1>
                <p className="step-subtitle">Buy more and save!</p>

                <div className="lesson-packages">
                  {/* 10 Hours Package */}
                  <div
                    className={`package-card ${selectedPackage === '10hours' ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage('10hours')}
                  >
                    <div className="package-header">
                      <div className="radio-button">
                        <div className={`radio-inner ${selectedPackage === '10hours' ? 'checked' : ''}`}></div>
                      </div>
                      <div className="package-info">
                        <h3>10 hours</h3>
                        <p>Perfect for new learners starting their driving journey from scratch</p>
                      </div>
                      <span className="discount-badge green">10% OFF</span>
                    </div>
                  </div>

                  {/* 6 Hours Package */}
                  <div
                    className={`package-card ${selectedPackage === '6hours' ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage('6hours')}
                  >
                    <div className="package-header">
                      <div className="radio-button">
                        <div className={`radio-inner ${selectedPackage === '6hours' ? 'checked' : ''}`}></div>
                      </div>
                      <div className="package-info">
                        <h3>6 hours</h3>
                        <p>Ideal for new learners, overseas license holders, or anyone needing a driving skill refresh.</p>
                      </div>
                      <span className="discount-badge green">5% OFF</span>
                    </div>
                  </div>

                  {/* Custom Hours */}
                  <div
                    className={`package-card ${selectedPackage === 'custom' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedPackage('custom');
                      setCustomHoursExpanded(!customHoursExpanded);
                    }}
                  >
                    <div className="package-header">
                      <div className="radio-button">
                        <div className={`radio-inner ${selectedPackage === 'custom' ? 'checked' : ''}`}></div>
                      </div>
                      <div className="package-info">
                        <h3>Select custom hours</h3>
                      </div>
                      {customHoursExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {customHoursExpanded && (
                      <div className="custom-hours-selector">
                        <label>Number of hours:</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={customHours}
                          onChange={(e) => setCustomHours(parseInt(e.target.value) || 1)}
                          className="hours-input"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* How many lessons info box */}
                <div className="lessons-info-box">
                  <div className="info-illustration">
                    <div className="instructor-illustration">
                      <span className="tip-badge">Tip</span>
                    </div>
                  </div>
                  <div className="info-content">
                    <h3>How many lessons do I need?</h3>
                    <div className="lesson-recommendations">
                      <div className="recommendation">
                        <strong>10-15hrs</strong>
                        <span className="category">New Learners</span>
                        <span className="description">Beginners starting their driving journey from scratch.</span>
                        <span className="best-value-badge">BEST VALUE</span>
                      </div>
                      <div className="recommendation">
                        <strong>3-6hrs</strong>
                        <span className="category">Overseas Licence</span>
                        <span className="description">Perfect for those looking to learn our local driving rules.</span>
                      </div>
                      <div className="recommendation">
                        <strong>4-7hrs</strong>
                        <span className="category">Refresher Drivers</span>
                        <span className="description">Ideal for those needing a confidence boost or skill refresh.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="order-summary">
                <h2>Order Summary</h2>

                <div className="summary-item">
                  <span className="summary-label">
                    🎫 {packageDetails.hours} hrs Booking Credit
                  </span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>

                {packageDetails.discount > 0 && (
                  <div className="summary-item discount">
                    <span className="summary-label">
                      Credit Discount <span className="discount-tag">{(packageDetails.discount * 100).toFixed(0)}% OFF</span>
                    </span>
                    <span className="summary-value green">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-item">
                  <span className="summary-label">
                    Platform Processing Fee <FaInfoCircle className="info-icon" />
                  </span>
                  <span className="summary-value">${processingFee.toFixed(2)}</span>
                </div>

                <div className="summary-total">
                  <span className="total-label">Total Payment Due</span>
                  <span className="total-value">${totalDue.toFixed(2)}</span>
                </div>

                <p className="payment-plan">Or 4 payments of ${(totalDue / 4).toFixed(2)}</p>

                <button className="btn-continue-summary" onClick={handleContinue}>
                  Continue ›
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Book your lessons */}
          {currentStep === 3 && (
            <div className="booking-step booking-main-content">
              <div>
                <h1>Book your lessons</h1>
                <p className="step-subtitle">Book now or later from your dashboard.</p>

                {bookings.map((booking, index) => (
                  <div key={booking.id} className="new-booking-section">
                    <div className="booking-section-header">
                      <h3>New Booking {bookings.length > 1 ? `#${index + 1}` : ''}</h3>
                      {bookings.length > 1 && (
                        <button
                          className="btn-remove-booking"
                          onClick={() => handleRemoveBooking(booking.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Booking Type */}
                    <div className="form-group">
                      <label>Booking Type</label>
                      <div className="booking-type-tabs">
                        <button
                          className={`booking-type-tab ${booking.bookingType === '1hour' ? 'active' : ''}`}
                          onClick={() => handleBookingChange(booking.id, 'bookingType', '1hour')}
                        >
                          {booking.bookingType === '1hour' && <FaCheck />} 1-Hour Lesson
                        </button>
                        <button
                          className={`booking-type-tab ${booking.bookingType === '2hour' ? 'active' : ''}`}
                          onClick={() => handleBookingChange(booking.id, 'bookingType', '2hour')}
                        >
                          {booking.bookingType === '2hour' && <FaCheck />} 2-Hour Lesson
                        </button>
                        <button
                          className={`booking-type-tab ${booking.bookingType === 'test' ? 'active' : ''}`}
                          onClick={() => handleBookingChange(booking.id, 'bookingType', 'test')}
                        >
                          {booking.bookingType === 'test' && <FaCheck />} Driving Test Package
                        </button>
                      </div>
                    </div>

                    {/* Date and Time Selection */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Available Dates</label>
                        <div className="input-with-icon">
                          <FaChevronDown className="input-icon" />
                          <input
                            type="date"
                            value={booking.selectedDate}
                            onChange={(e) => handleBookingChange(booking.id, 'selectedDate', e.target.value)}
                            className="date-input"
                            placeholder="Select a day"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Available Times</label>
                        <div className="input-with-icon">
                          <FaChevronDown className="input-icon" />
                          <select
                            value={booking.selectedTime}
                            onChange={(e) => handleBookingChange(booking.id, 'selectedTime', e.target.value)}
                            className="time-select"
                          >
                            <option value="">Select a time</option>
                            <option value="5:00 AM">5:00 AM</option>
                            <option value="6:00 AM">6:00 AM</option>
                            <option value="7:00 AM">7:00 AM</option>
                            <option value="8:00 AM">8:00 AM</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="9:00 PM">9:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Location */}
                    <div className="form-group">
                      <label>Lesson Pick Up Location</label>
                      <div className="location-input-group">
                        <input
                          type="text"
                          value={booking.pickupLocation}
                          onChange={(e) => handleBookingChange(booking.id, 'pickupLocation', e.target.value)}
                          className="location-input"
                          placeholder="123 Placeholder Street, Sydney NSW 2000"
                        />
                        <button className="btn-edit-location">Edit</button>
                      </div>
                    </div>

                    <button className="btn-save-booking">Save</button>
                  </div>
                ))}

                <button className="btn-add-booking" onClick={handleAddBooking}>
                  <FaInfoCircle /> Add Another Booking
                </button>
              </div>

              {/* Order Summary Sidebar */}
              <div className="order-summary">
                <h2>Order Summary</h2>

                <div className="summary-item">
                  <span className="summary-label">
                    🎫 {packageDetails.hours} hrs Booking Credit
                  </span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>

                {packageDetails.discount > 0 && (
                  <div className="summary-item discount">
                    <span className="summary-label">
                      Credit Discount <span className="discount-tag">{(packageDetails.discount * 100).toFixed(0)}% OFF</span>
                    </span>
                    <span className="summary-value green">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-item">
                  <span className="summary-label">
                    Platform Processing Fee <FaInfoCircle className="info-icon" />
                  </span>
                  <span className="summary-value">${processingFee.toFixed(2)}</span>
                </div>

                <div className="summary-total">
                  <span className="total-label">Total Payment Due</span>
                  <span className="total-value">${totalDue.toFixed(2)}</span>
                </div>

                <p className="payment-plan">Or 4 payments of ${(totalDue / 4).toFixed(2)}</p>

                <button className="btn-continue-summary" onClick={handleContinue}>
                  Continue ›
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="booking-step">
              <h1>Learner Registration</h1>
              <p>Step 4 content will go here</p>
              <button className="btn-continue" onClick={handleContinue}>Continue</button>
            </div>
          )}

          {currentStep === 5 && (
            <div className="booking-step">
              <h1>Payment</h1>
              <p>Step 5 content will go here</p>
              <button className="btn-continue">Complete Booking</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
