import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InstructorCard from '../components/instructors/InstructorCard';
import LocationAutocomplete from '../components/common/LocationAutocomplete';
import { instructors, filterInstructors } from '../data/instructors';
import './Instructors.css';

const Instructors = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    location: '',
    transmission: 'automatic',
    testRequired: false
  });
  const [filteredInstructors, setFilteredInstructors] = useState(instructors);

  useEffect(() => {
    if (location.state) {
      setFilters(location.state);
      applyFilters(location.state);
    }
  }, [location.state]);

  const applyFilters = (filterData) => {
    const filtered = filterInstructors(filterData);
    setFilteredInstructors(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(filters);
  };

  const [sortBy, setSortBy] = useState('rating');
  const [quickFilter, setQuickFilter] = useState('');
  const minPrice = filteredInstructors.length > 0
    ? Math.min(...filteredInstructors.map(i => i.pricePerHour))
    : 0;

  return (
    <div className="instructors-page-ez">
      <div className="container-ez">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-item">🏠</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item">Search</span>
          {filters.location && (
            <>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item">{filters.location}</span>
            </>
          )}
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <button
            className={`filter-btn ${quickFilter === 'rating' ? 'active' : ''}`}
            onClick={() => setQuickFilter('rating')}
          >
            ⭐ Highest Rated
          </button>
          <button
            className={`filter-btn ${quickFilter === 'available' ? 'active' : ''}`}
            onClick={() => setQuickFilter('available')}
          >
            📅 Next Available
          </button>
          <button
            className={`filter-btn ${quickFilter === 'price' ? 'active' : ''}`}
            onClick={() => setQuickFilter('price')}
          >
            💰 Lowest Price
          </button>
          <button
            className={`filter-btn ${quickFilter === 'soon' ? 'active' : ''}`}
            onClick={() => setQuickFilter('soon')}
          >
            ⚡ Available Next 4 Days
          </button>
          <button
            className={`filter-btn ${quickFilter === 'female' ? 'active' : ''}`}
            onClick={() => setQuickFilter('female')}
          >
            👤 Female Instructor
          </button>

          <div className="filters-right">
            <button className="btn-filters">
              🔧 Filters
            </button>
            <button className="btn-sort">
              ↕️ Sort
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="results-heading">
          <h1>{filteredInstructors.length} {filters.transmission === 'automatic' ? 'Auto' : filters.transmission === 'manual' ? 'Manual' : ''} Instructors Available</h1>
          <p className="results-price">from ${minPrice.toFixed(2)}/hr</p>
        </div>

        {/* Instructors Grid */}
        <div className="instructors-grid">
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map(instructor => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))
          ) : (
            <div className="no-results">
              <h3>No instructors found</h3>
              <p>Try adjusting your filters or search in a different area.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructors;
