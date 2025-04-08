import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaCompass, FaBullhorn, FaUser } from 'react-icons/fa';

function BottomNavBar() {
    const location = useLocation(); // Get the current route
    const [activeTab, setActiveTab] = useState(location.pathname); // Track the active tab

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
                    <Link
                        to="/"
                        onClick={() => handleTabClick('/')}
                        style={{
                            color: activeTab === '/' ? 'blue' : 'black',
                            textDecoration: 'none',
                        }}
                    >
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
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: 'black',
                            cursor: 'pointer',
                        }}
                    >
                        <FaSearch size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Search</p>
                    </button>
                </div>
                <div className="text-center">
                    <Link
                        to="/"
                        onClick={() => handleTabClick('/explore')}
                        style={{
                            color: activeTab === '/explore' ? 'blue' : 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <FaCompass size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Explore</p>
                    </Link>
                </div>
                <div className="text-center">
                    <Link
                        to="/advertise"
                        onClick={() => handleTabClick('/advertise')}
                        style={{
                            color: activeTab === '/advertise' ? 'blue' : 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <FaBullhorn size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Advertise</p>
                    </Link>
                </div>
                <div className="text-center">
                    <Link
                        to="/account"
                        onClick={() => handleTabClick('/account')}
                        style={{
                            color: activeTab === '/account' ? 'blue' : 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <FaUser size={24} />
                        <p style={{ fontSize: '0.75rem', margin: 0 }}>Profile</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default BottomNavBar;
