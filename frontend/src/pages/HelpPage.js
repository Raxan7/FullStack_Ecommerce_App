import React from 'react'
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap'
import { FaPhone, FaWhatsapp, FaEnvelope, FaClock } from 'react-icons/fa'
import './css/HelpPage.css' // Create this CSS file
import BottomNavBar from '../components/BottomNavBar'; // Import the component

function HelpPage() {
  const contacts = [
    { number: '+255613509299', type: 'phone' },
    { number: '+255699183448', type: 'whatsapp' },
    { number: '+255767007987', type: 'phone' }
  ]

  return (
    <Container className="help-page py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-3">Help Center</h1>
          <p className="lead text-muted">
            We're here to help you with any questions or issues
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="icon-wrapper bg-primary-light mb-4">
                <FaPhone className="text-primary" size={24} />
              </div>
              <h3 className="mb-4">Contact Support</h3>
              <ListGroup variant="flush">
                {contacts.map((contact, index) => (
                  <ListGroup.Item key={index} className="border-0 px-0">
                    <div className="d-flex align-items-center">
                      {contact.type === 'whatsapp' ? (
                        <FaWhatsapp className="text-success mr-3" size={20} />
                      ) : (
                        <FaPhone className="text-primary mr-3" size={20} />
                      )}
                      <div>
                        <h5 className="mb-0">{contact.number}</h5>
                        <small className="text-muted">
                          {contact.type === 'whatsapp' ? 'WhatsApp Available' : 'Call Us'}
                        </small>
                      </div>
                      <Button 
                        variant="link" 
                        href={`tel:${contact.number}`}
                        className="ml-auto"
                      >
                        Call Now
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="icon-wrapper bg-primary-light mb-4">
                <FaEnvelope className="text-primary" size={24} />
              </div>
              <h3 className="mb-4">Technical Support</h3>
              <div className="mb-4">
                <h5 className="d-flex align-items-center">
                  <FaPhone className="text-primary mr-3" size={20} />
                  <span>+255620148031</span>
                </h5>
                <p className="text-muted">
                  Available for technical issues and platform support
                </p>
              </div>
              <div>
                <h5 className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary mr-3" size={20} />
                  <span>support@brkluxe.com</span>
                </h5>
                <Button 
                  variant="primary" 
                  href="mailto:support@brkluxe.com"
                  className="w-100"
                >
                  Email Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="icon-wrapper bg-primary-light mr-4">
                  <FaClock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="mb-2">Operating Hours</h3>
                  <p className="mb-1"><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
                  <p className="mb-1"><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                  <p className="mb-0"><strong>Sunday:</strong> 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <BottomNavBar /> {/* Add the BottomNavBar */}
    </Container>
  )
}

export default HelpPage