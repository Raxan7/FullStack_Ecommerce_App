import React, { useEffect, useState, useCallback } from 'react'  // Added useCallback
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { listActiveAds } from '../actions/adActions'
import { Link } from 'react-router-dom'

function FullScreenAd() {
  const [showAd, setShowAd] = useState(false)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  
  const dispatch = useDispatch()
  
  const activeAdsList = useSelector(state => state.activeAdsList || {})
  const { loading, activeAds } = activeAdsList  // Removed unused 'error'

  // Using useCallback to memoize the function
  const rotateAd = useCallback(() => {
    if (activeAds && activeAds.length > 0) {
      setCurrentAdIndex(prevIndex => (prevIndex + 1) % activeAds.length)
    }
  }, [activeAds])  // Added dependency

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      dispatch(listActiveAds());
    }

    const initialTimer = setTimeout(() => {
      if (activeAds && activeAds.length > 0) {
        setShowAd(true);
      }
    }, 5000);

    const interval = setInterval(rotateAd, 10000);

    return () => {
      isMounted = false; // Cleanup on unmount
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dispatch, activeAds, rotateAd]);  // Added dependencies

  if (loading || !activeAds || activeAds.length === 0) {
    return null
  }

  const currentAd = activeAds[currentAdIndex]

  return (
    <Modal 
      show={showAd} 
      onHide={() => setShowAd(false)} 
      size="lg" 
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{currentAd.ad_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentAd.ad_type === 'image' ? (
          <img 
            src={currentAd.ad_file_url} 
            alt={currentAd.ad_title} 
            style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
          />
        ) : (
          <video 
            controls 
            style={{ width: '100%', maxHeight: '60vh' }}
            autoPlay
          >
            <source src={currentAd.ad_file_url} type="video/mp4" />
          </video>
        )}
        <p className="mt-3">{currentAd.ad_description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button as={Link} to={`/order-now?ad=${currentAd.id}`} variant="primary">
          Order Now
        </Button>
        <Button variant="secondary" onClick={() => setShowAd(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FullScreenAd