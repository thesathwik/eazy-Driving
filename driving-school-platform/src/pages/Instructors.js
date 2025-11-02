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

  return (
    <div className="instructors-page">
      <div className="instructors-hero">
        <div className="container">
          <h1>Find Your Perfect Instructor</h1>
          <p>Browse through {instructors.length}+ verified professional instructors across Australia</p>
        </div>
      </div>

      <div className="container">
        <div className="instructors-layout">
          <aside className="filters-sidebar">
            <div className="filter-card">
              <h3>Refine Your Search</h3>
              <form onSubmit={handleSearch} className="filter-form">
                <div className="filter-group">
                  <label htmlFor="location-filter">Location</label>
                  <LocationAutocomplete
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g. Sydney, Melbourne, Brisbane"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="transmission-filter">Transmission</label>
                  <select
                    id="transmission-filter"
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="filter-checkbox">
                  <input
                    type="checkbox"
                    id="test-filter"
                    name="testRequired"
                    checked={filters.testRequired}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor="test-filter">Test package needed</label>
                </div>

                <button type="submit" className="btn btn-filter">
                  Apply Filters
                </button>
              </form>

              <div className="filter-info">
                <h4>Why Choose EAZYDRIVING?</h4>
                <ul>
                  <li>All instructors verified</li>
                  <li>Instant online booking</li>
                  <li>Flexible scheduling</li>
                  <li>Transparent pricing</li>
                  <li>Real reviews from learners</li>
                </ul>
              </div>
            </div>
          </aside>

          <main className="instructors-main">
            <div className="results-header">
              <h2>
                {filteredInstructors.length} Instructor{filteredInstructors.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="sort-options">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort">
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="instructors-list">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Instructors;
