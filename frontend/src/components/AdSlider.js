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
      interval={10000} // Set interval to 10 seconds
      className="mb-4"
      style={{
        width: '100%', // Make the width full
        height: 'auto', // Maintain aspect ratio for responsiveness
        margin: '0 auto', // Center horizontally
        display: 'flex', // Enable flexbox
        alignItems: 'center', // Center vertically
        justifyContent: 'center', // Center horizontally
        overflow: 'hidden'
      }}
    >
      {ads.map((ad, index) => (
        <Carousel.Item key={index}>
          <Card style={{ 
            position: 'relative',
            border: 'none',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'inline-block', // Ensure the container adjusts to the content size
            width: '100%' // Make the card width full
          }}>
            <Card.Body className="p-0">
              <a 
                href={`https://wa.me/${ad.phone_number}?text=I%20saw%20an%20ad%20on%20Luxe%20Free%20Market%20system%20and%20I%20am%20interested%20in%20your%20product%20(${ad.ad_title})`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                {ad.ad_type === 'image' ? (
                  <img 
                    src={`${process.env.REACT_APP_API_BASE_URL}${ad.ad_file_url}`} 
                    alt={ad.ad_title} 
                    className="img-fluid" 
                    style={{ 
                      width: '100%', // Make the image width full
                      height: 'auto', // Maintain aspect ratio
                      maxHeight: '50vh', // Limit the height to 50% of the viewport height in desktop view
                      objectFit: 'contain', // Ensure the image fits without distortion
                      display: 'block' 
                    }}
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
                      className="img-fluid"
                      style={{ 
                        width: '100%', // Make the video width full
                        height: 'auto', // Maintain aspect ratio
                        display: videoLoading[index] ? 'none' : 'block'
                      }}
                    />
                  </div>
                )}
              </a>
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0, // Move to the bottom
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: '0.5rem',
                  textAlign: 'center',
                  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)', // Shadow only around the title and description
                  zIndex: 2
                }}
              >
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem', textShadow: '0 2px 5px rgba(0, 0, 0, 0.7)' }}>
                  {ad.ad_title}
                </h3>
                <p style={{ fontSize: '1rem', textShadow: '0 2px 5px rgba(0, 0, 0, 0.7)' }}>
                  {ad.ad_description}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default AdSlider;