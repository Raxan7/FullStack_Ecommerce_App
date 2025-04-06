import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaShoppingBag, FaThumbsUp, FaHeadset } from 'react-icons/fa'
import teamPhoto from '../assets/logo.jpeg' // Add your team photo
import './css/AboutPage.css' // Create this CSS file
import BottomNavBar from '../components/BottomNavBar'; // Import the component

function AboutPage() {
  return (
    <Container className="about-page py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-4">About BRK_LUXE</h1>
          <p className="lead text-muted">
            Redefining your shopping experience with quality and convenience
          </p>
        </Col>
      </Row>

      <Row className="mb-5 align-items-center">
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="about-image rounded-lg overflow-hidden shadow">
            <img 
              src={teamPhoto} 
              alt="BRK_LUXE Team" 
              className="img-fluid"
            />
          </div>
        </Col>
        <Col lg={6}>
          <h2 className="mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2023, BRK_LUXE Free Market began with a simple mission: to make shopping 
            easy, convenient, and enjoyable for everyone in Tanzania. We believe in offering 
            top-quality items at fair prices, with a focus on customer satisfaction and excellent service.
          </p>
          <div className="d-flex align-items-center mb-3">
            <FaShoppingBag className="text-primary mr-3" size={24} />
            <div>
              <h5 className="mb-0">Wide Selection</h5>
              <p className="text-muted mb-0">Thousands of quality products</p>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <FaThumbsUp className="text-primary mr-3" size={24} />
            <div>
              <h5 className="mb-0">Customer First</h5>
              <p className="text-muted mb-0">Your satisfaction is our priority</p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <FaHeadset className="text-primary mr-3" size={24} />
            <div>
              <h5 className="mb-0">24/7 Support</h5>
              <p className="text-muted mb-0">We're always here to help</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col className="text-center">
          <Card className="border-0 shadow-sm py-4">
            <Card.Body>
              <h3 className="mb-4">Meet The Founders</h3>
              <Row className="justify-content-center">
                <Col md={4} className="mb-4">
                  <div className="team-member">
                    <div className="team-img mb-3 rounded-circle overflow-hidden">
                      <img 
                        src="https://via.placeholder.com/150" 
                        alt="Founder" 
                        className="img-fluid"
                      />
                    </div>
                    <h5>[Your Name]</h5>
                    <p className="text-muted">Co-Founder & [Your Profession]</p>
                  </div>
                </Col>
                <Col md={4} className="mb-4">
                  <div className="team-member">
                    <div className="team-img mb-3 rounded-circle overflow-hidden">
                      <img 
                        src="https://via.placeholder.com/150" 
                        alt="Co-Founder" 
                        className="img-fluid"
                      />
                    </div>
                    <h5>[Co-Founder Name]</h5>
                    <p className="text-muted">Co-Founder & [Profession]</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <div className="social-links">
            <h4 className="mb-4">Connect With Us</h4>
            <a href="https://instagram.com/brk_luxe_free_market" className="btn btn-outline-primary mx-2">
              <i className="fab fa-instagram"></i> @brk_luxe_free_market
            </a>
          </div>
        </Col>
      </Row>
      <BottomNavBar /> {/* Add the BottomNavBar */}
    </Container>
  )
}

export default AboutPage