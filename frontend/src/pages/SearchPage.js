// src/pages/SearchPage.js
import React from 'react';
import SearchBarForProducts from '../components/SearchBarForProducts';

function SearchPage() {
    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="mb-4">Search Products</h2>
                    <SearchBarForProducts />
                </div>
            </div>
        </div>
    );
}

export default SearchPage;