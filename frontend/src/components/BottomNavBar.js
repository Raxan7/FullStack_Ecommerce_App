import React from 'react';
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
                <FaHome size={24} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Home</p>
            </div>
            <div className="text-center">
                <FaSearch size={24} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Search</p>
            </div>
            <div className="text-center">
                <FaCompass size={24} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Explore</p>
            </div>
            <div className="text-center">
                <FaBullhorn size={24} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Advertise</p>
            </div>
            <div className="text-center">
                <FaUser size={24} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Profile</p>
            </div>
        </div>
    );
}

export default BottomNavBar;
