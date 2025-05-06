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
  const [videoMuted, setVideoMuted] = useState({}); // ✅ NEW: Track mute state
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ads/active/`);
        setAds(data);

        const initialLoadingStates = {};
        const initialAutoplayStates = {};
        const initialMuteStates = {};

        data.forEach((ad, index) => {
          if (ad.ad_type === 'video') {
            initialLoadingStates[index] = true;
            initialAutoplayStates[index] = false;
            initialMuteStates[index] = true; // Start muted
          }
        });

        setVideoLoading(initialLoadingStates);
        setAutoplayBlocked(initialAutoplayStates);
        setVideoMuted(initialMuteStates); // ✅ Set initial mute state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const handleVideoEnd = (index) => {
    if (index < ads.length - 1) {
      carouselRef.current.next();
    }
  };

  const handleVideoPlay = (index) => {
    setAutoplayBlocked(prev => ({ ...prev, [index]: false }));
  };

  const handleVideoPause = (index, e) => {
    if (e.target.currentTime === 0) {
      setAutoplayBlocked(prev => ({ ...prev, [index]: true }));
    }
  };

  useEffect(() => {
    if (ads.length > 0) {
      videoRefs.current = videoRefs.current.slice(0, ads.length);

      ads.forEach((ad, index) => {
        if (ad.ad_type === 'video' && videoRefs.current[index]) {
          const video = videoRefs.current[index];

          video.onended = () => handleVideoEnd(index);
          video.onplay = () => handleVideoPlay(index);
          video.onpause = (e) => handleVideoPause(index, e);
          video.oncanplay = () => {
            setVideoLoading(prev => ({ ...prev, [index]: false }));
          };
          video.onerror = () => {
            console.error(`Failed to load video at index ${index}: ${ad.ad_file_url}`);
            setVideoLoading(prev => ({ ...prev, [index]: false }));
          };

          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setAutoplayBlocked(prev => ({ ...prev, [index]: true }));
              setVideoLoading(prev => ({ ...prev, [index]: false }));
            });
          }
        }
      });

      updateVideoPlayback(0);
    }
  }, [ads]);

  const handlePlayClick = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false;
      video.play();
      setVideoMuted(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      const newMuteState = !videoMuted[index];
      video.muted = newMuteState;
      setVideoMuted(prev => ({ ...prev, [index]: newMuteState }));
    }
  };

  const updateVideoPlayback = (selectedIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        const isMuted = videoMuted[index] ?? true;
        if (index === selectedIndex) {
          video.muted = isMuted;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setAutoplayBlocked(prev => ({ ...prev, [index]: true }));
            });
          }
        } else {
          video.pause();
          video.muted = true;
        }
      }
    });
  };

  if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center py-4 text-danger">Error loading ads: {error}</div>;
  if (ads.length === 0) return null;

  return (
    <Carousel
      ref={carouselRef}
      activeIndex={activeIndex}
      onSelect={(selectedIndex) => {
        setActiveIndex(selectedIndex);
        updateVideoPlayback(selectedIndex);
      }}
      indicators={false}
      controls={ads.length > 1}
      interval={10000}
      className="mb-4"
      style={{
        width: '100%',
        height: 'auto',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
            display: 'inline-block',
            width: '100%'
          }}>
            <Card.Body className="p-0">
              {ad.ad_type === 'image' ? (
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${ad.ad_file_url}`}
                  alt={ad.ad_title}
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '50vh',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              ) : (
                <div style={{ position: 'relative' }}>
                  <video
                    ref={el => videoRefs.current[index] = el}
                    src={`${process.env.REACT_APP_API_BASE_URL}${ad.ad_file_url}`}
                    playsInline
                    preload="auto"
                    className="img-fluid"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '50vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onClick={() => handlePlayClick(index)}
                    muted={videoMuted[index] ?? true}
                  />
                  
                  {/* ✅ Mute/Unmute Button */}
                  <Button
                    variant="light"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      opacity: 0.9
                    }}
                    onClick={() => toggleMute(index)}
                  >
                    {videoMuted[index] ? 'Unmute' : 'Mute'}
                  </Button>
                </div>
              )}

              {/* WhatsApp Shadow Section */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: '0.5rem',
                  textAlign: 'center',
                  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
                  zIndex: 2,
                  cursor: 'pointer'
                }}
                onClick={() =>
                  window.open(
                    `https://wa.me/${ad.phone_number}?text=I%20saw%20an%20ad%20on%20Luxe%20Free%20Market%20system%20and%20I%20am%20interested%20in%20your%20product%20(${ad.ad_title})`,
                    '_blank'
                  )
                }
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
