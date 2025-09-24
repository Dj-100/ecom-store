import React from 'react';
import './FilterSidebar.css';


const FilterSidebar = ({ filters, setFilters, showAgeFilter = false }) => {

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">Sort & Filter</h3>
      

      {showAgeFilter && (
        <div className="filter-group">
          <label htmlFor="age">Filter by Age</label>
          <input
              type="number"
              id="age"
              name="age"
              value={filters.age || ''}
              onChange={handleFilterChange}
              placeholder="Enter an age"
          />
        </div>
      )}
      
      <div className="filter-group">
        <label htmlFor="sort-by">Sort By</label>
        <select id="sort-by" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="price-range">Max Price: ₹{filters.price_max || 5000}</label>
        <input 
          type="range" 
          id="price-range" 
          name="price_max"
          min="100" 
          max="5000" 
          step="100"
          value={filters.price_max || 5000}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;