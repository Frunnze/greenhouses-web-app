import React, { useState } from 'react';
import './Pagination.css';

function Pagination(props) {
    const totalPages = Math.ceil(props.totalItems / 6);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    const [activePage, setActivePage] = useState(1);

    const handlePageClick = (pageNumber) => {
        setActivePage(pageNumber);
        props.getGreenhouses(pageNumber);
    };

    return (
        <div className="pagination">
            <div className="page-buttons-container">
                {pageNumbers.map(pageNumber => (
                    <button
                        className={`page-button ${pageNumber === activePage ? 'active-page-button' : ''}`}
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Pagination;
