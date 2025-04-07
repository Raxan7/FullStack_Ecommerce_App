import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaCompass, FaBullhorn, FaUser } from 'react-icons/fa';

function BottomNavBar() {
    return (
        <>
            <div style={{ height: '4rem' }}></div> {/* Spacer to account for the navbar height */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    zIndex: 1000,
                    height: '4rem', // Fixed height for the navbar
                }}
            >
                <div className="text-center">
                    <Link to="/">
                        <FaHome size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Home</p>
                    </Link>
                </div>
                <div className="text-center">
                    <button
                        className="nav-link"
                        onClick={() => {
                            // Handle click event
                        }}
                        style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer' }}
                    >
                        <FaSearch size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Search</p>
                    </button>
                </div>
                <div className="text-center">
                    <Link to="/">
                        <FaCompass size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Explore</p>
                    </Link>
                </div>
                <div className="text-center">
                    <Link to="/advertise">
                        <FaBullhorn size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Advertise</p>
                    </Link>
                </div>
                <div className="text-center">
                    <Link to="/account">
                        <FaUser size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Profile</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default BottomNavBar;
