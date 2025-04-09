import React, { useEffect, useState } from 'react';
import { Card, Carousel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdSlider = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ads/active/`);
        setAds(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center py-4 text-danger">Error loading ads: {error}</div>;
  if (ads.length === 0) return null;

  return (
    <Carousel 
      indicators={false} 
      controls={ads.length > 1}
      interval={5000}
      className="mb-4 shadow-sm"
    >
      {ads.map((ad, index) => (
        <Carousel.Item key={index}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: 'none',
            borderRadius: '10px'
          }}>
            <Card.Body className="text-center py-4">
              {ad.ad_type === 'image' ? (
                <img 
                  src={ad.ad_file_url} 
                  alt={ad.ad_title} 
                  className="img-fluid mb-3" 
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              ) : (
                <video 
                  src={ad.ad_file_url} 
                  controls
                  className="img-fluid mb-3"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              )}
              <h3 style={{ color: '#2c3e50', fontWeight: 'bold', marginBottom: '1rem' }}>
                {ad.ad_title}
              </h3>
              <p className="lead mb-4" style={{ color: '#34495e', fontSize: '1.25rem' }}>
                {ad.ad_description}
              </p>
              <div className="d-flex justify-content-center">
                <Link to="/advertise" className="btn btn-primary btn-lg"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'black',
                    borderColor: 'black'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}>
                  Advertise With Us →
                </Link>
              </div>
              <div className="mt-3 text-muted">
                <small>Sponsored Ad</small>
              </div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AdSlider;