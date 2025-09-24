import React from 'react';
import './FilterSidebar.css';

const GiftFilterSidebar = ({ filters, setFilters }) => {
    
    const handleAgeChange = (e) => {
        setFilters({ ...filters, age: e.target.value, occasion: false });
    };

    const handleOccasionChange = (e) => {
      
        setFilters({ ...filters, occasion: e.target.checked, age: '' });
    };

    const handleSortChange = (e) => {
        setFilters({ ...filters, sortBy: e.target.value });
    };

   
    const clearFilters = () => {
        setFilters({ sortBy: 'popularity', age: '', occasion: false });
    };

    return (
        <div className="filter-sidebar">
            <h3 className="filter-title">Filter Gifts</h3>
            <div className="filter-group">
                <label htmlFor="age">Filter by Age</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={filters.age}
                    onChange={handleAgeChange}
                    placeholder="Enter an age (e.g., 8)"
                />
            </div>
            <div className="filter-separator">OR</div>
            <div className="filter-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="occasion"
                        checked={filters.occasion}
                        onChange={handleOccasionChange}
                    />
                    Show Only Occasion Gifts
                </label>
            </div>
            <hr />
            <div className="filter-group">
                <label htmlFor="sort-by">Sort By</label>
                <select id="sort-by" name="sortBy" value={filters.sortBy} onChange={handleSortChange}>
                    <option value="popularity">Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>
            <div className="filter-group">
                <button className="apply-filters-btn" onClick={clearFilters}>Clear Filters</button>
            </div>
        </div>
    );
};

export default GiftFilterSidebar;