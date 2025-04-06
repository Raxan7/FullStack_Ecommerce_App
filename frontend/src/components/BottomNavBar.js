import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaCompass, FaBullhorn, FaUser } from 'react-icons/fa';

function BottomNavBar() {
    return (
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
            }}
        >
            <div className="text-center">
                <Link to="/">
                    <FaHome size={24} />
                    <p style={{ fontSize: '0.75rem', margin: 0 }}>Home</p>
                </Link>
            </div>
            <div className="text-center">
                <a href={null}>
                    <FaSearch size={24} />
                    <p style={{ fontSize: '0.75rem', margin: 0 }}>Search</p>
                </a>
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
    );
}

export default BottomNavBar;
