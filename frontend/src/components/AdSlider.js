import React, { useEffect, useState, useRef } from 'react';
import { Card, Carousel, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdSlider = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoLoading, setVideoLoading] = useState({});
  const [autoplayBlocked, setAutoplayBlocked] = useState({});
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ads/active/`);
        setAds(data);
        
        // Initialize loading and autoplay states for each video ad
        const initialLoadingStates = {};
        const initialAutoplayStates = {};
        data.forEach((ad, index) => {
          if (ad.ad_type === 'video') {
            initialLoadingStates[index] = true;
            initialAutoplayStates[index] = false;
          }
        });
        
        setVideoLoading(initialLoadingStates);
        setAutoplayBlocked(initialAutoplayStates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Handle video ended event
  const handleVideoEnd = (index) => {
    // Only auto-advance if there are more ads
    if (index < ads.length - 1) {
      carouselRef.current.next();
    }
  };

  // Handle video play/pause events for autoplay detection
  const handleVideoPlay = (index) => {
    setAutoplayBlocked(prev => ({ ...prev, [index]: false }));
  };

  const handleVideoPause = (index, e) => {
    if (e.target.currentTime === 0) {
      setAutoplayBlocked(prev => ({ ...prev, [index]: true }));
    }
  };

  // Set up video event listeners when ads load
  useEffect(() => {
    if (ads.length > 0) {
      videoRefs.current = videoRefs.current.slice(0, ads.length);
      
      ads.forEach((ad, index) => {
        if (ad.ad_type === 'video' && videoRefs.current[index]) {
          const video = videoRefs.current[index];
          video.onended = () => handleVideoEnd(index);
          video.onplay = () => handleVideoPlay(index);
          video.onpause = (e) => handleVideoPause(index, e);
          video.onloadeddata = () => {
            setVideoLoading(prev => ({ ...prev, [index]: false }));
          };
        }
      });
    }
  }, [ads]);

  // Manual play function for when autoplay is blocked
  const handlePlayClick = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center py-4 text-danger">Error loading ads: {error}</div>;
  if (ads.length === 0) return null;

  return (
    <Carousel 
      ref={carouselRef}
      activeIndex={activeIndex}
      onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
      indicators={false} 
      controls={ads.length > 1}
      interval={null} // Disable auto-rotation since we'll handle it manually
      className="mb-4 shadow-sm"
    >
      {ads.map((ad, index) => (
        <Carousel.Item key={index}>
          <Card style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: 'none',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <Card.Body className="text-center py-4">
              {ad.ad_type === 'image' ? (
                <img 
                  src={`${process.env.REACT_APP_API_BASE_URL}${ad.ad_file_url}`} 
                  alt={ad.ad_title} 
                  className="img-fluid mb-3" 
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ position: 'relative' }}>
                  {videoLoading[index] && (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  )}
                  <video 
                    ref={el => videoRefs.current[index] = el}
                    src={`${process.env.REACT_APP_API_BASE_URL}${ad.ad_file_url}`}
                    autoPlay
                    muted
                    playsInline
                    className="img-fluid mb-3"
                    style={{ 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      display: videoLoading[index] ? 'none' : 'block'
                    }}
                  />
                  {autoplayBlocked[index] && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                      }}
                    >
                      <Button 
                        variant="primary" 
                        onClick={() => handlePlayClick(index)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          borderRadius: '50px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        Play Video
                      </Button>
                    </div>
                  )}
                </div>
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