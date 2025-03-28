import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { FaAd, FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import './css/AdvertisePage.css' // Create this CSS file

function AdvertisePage() {
  return (
    <Container className="advertise-page py-5">
      <Row className="justify-content-center mb-5">
        <Col lg={8} className="text-center">
          <h1 className="display-4 mb-4">
            <FaAd className="text-primary mr-2" />
            Advertise With Us
          </h1>
          <p className="lead text-muted">
            Reach thousands of potential customers and grow your business
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6} lg={5} className="mb-4">
          <Card className="pricing-card h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <div className="pricing-badge bg-light text-primary mb-3">POPULAR</div>
              <h3 className="mb-3">Daily Promotion</h3>
              <h2 className="display-4 mb-3">
                <span className="text-primary">Tsh 500</span>/day
              </h2>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />24-hour visibility</li>
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />Featured placement</li>
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />Detailed analytics</li>
              </ul>
              <Button 
                as={Link} 
                to="/ad-submission" 
                variant="primary" 
                size="lg"
                className="w-100 py-3"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={5} className="mb-4">
          <Card className="pricing-card h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <h3 className="mb-3">Monthly Package</h3>
              <h2 className="display-4 mb-3">
                <span className="text-primary">Tsh 5000</span>/month
              </h2>
              <ul className="list-unstyled mb-4">
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />30-day visibility</li>
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />Premium placement</li>
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />Detailed analytics</li>
                <li className="mb-2"><FaCheckCircle className="text-success mr-2" />24/7 support</li>
              </ul>
              <Button 
                as={Link} 
                to="/ad-submission" 
                variant="outline-primary" 
                size="lg"
                className="w-100 py-3"
              >
                Get Started <FaArrowRight className="ml-2" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col lg={8} className="text-center">
          <div className="bg-light p-4 rounded">
            <h4 className="mb-3">Have questions?</h4>
            <p className="mb-0">
              Contact our advertising team at <a href="mailto:ads@brkluxe.com">ads@brkluxe.com</a> 
              or call <a href="tel:+255613509299">+255 613 509 299</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AdvertisePage