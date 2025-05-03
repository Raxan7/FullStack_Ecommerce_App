import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Container, Spinner, Alert, Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { submitAd } from '../actions/adActions'
import { AD_SUBMISSION_RESET } from '../constants'
import paymentInstructions from '../assets/lipa_namba.jpeg'
import BottomNavBar from '../components/BottomNavBar'

function AdSubmissionPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+255')
  const [adTitle, setAdTitle] = useState('')
  const [adDescription, setAdDescription] = useState('')
  const [adType, setAdType] = useState('image')
  const [adFile, setAdFile] = useState(null)
  const [paymentProof, setPaymentProof] = useState(null)
  const [agreement, setAgreement] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('lipa_namba')
  
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [modalVariant, setModalVariant] = useState('success')

  const dispatch = useDispatch()
  const history = useHistory()

  // Get state from Redux store with proper fallbacks
  const { userInfo } = useSelector(state => state.userLoginReducer) || {}
  const { 
    loading: adLoading = false, 
    error: adError = null, 
    success: adSuccess = false 
  } = useSelector(state => state.adSubmission || {})

  // Debug state changes
  useEffect(() => {
    console.log('Redux State:', { adLoading, adError, adSuccess })
  }, [adLoading, adError, adSuccess])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userInfo) {
      history.push('/login?redirect=submit-ad')
    }
  }, [userInfo, history])

  // Handle success state
  useEffect(() => {
    if (adSuccess) {
      setModalMessage('Your ad has been successfully submitted! Redirecting to home page...')
      setModalVariant('success')
      setShowModal(true)
      
      const timer = setTimeout(() => {
        dispatch({ type: AD_SUBMISSION_RESET })
        history.push('/')
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [adSuccess, history, dispatch])

  // Handle error state
  useEffect(() => {
    if (adError) {
      setModalMessage(adError)
      setModalVariant('danger')
      setShowModal(true)
    }
  }, [adError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch({ type: AD_SUBMISSION_RESET })
    }
  }, [dispatch])

  const submitHandler = async (e) => {
    e.preventDefault()
    
    if (!userInfo) {
      setModalMessage('Please login to submit an ad')
      setModalVariant('danger')
      setShowModal(true)
      return
    }

    // Validate phone number
    let sanitizedPhone = phone
    if (sanitizedPhone.startsWith('0')) {
      sanitizedPhone = sanitizedPhone.slice(1)
    }

    if (sanitizedPhone.length !== 9 || !/^\d+$/.test(sanitizedPhone)) {
      setModalMessage('Phone number must have exactly 9 digits (excluding the country code).')
      setModalVariant('danger')
      setShowModal(true)
      return
    }

    const fullPhoneNumber = `${countryCode}${sanitizedPhone}`

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone_number', fullPhoneNumber)
    formData.append('ad_title', adTitle)
    formData.append('ad_description', adDescription)
    formData.append('ad_type', adType)
    formData.append('payment_method', paymentMethod)
    formData.append('duration_days', 30)
    formData.append('ad_file', adFile)
    formData.append('payment_proof', paymentProof)

    try {
      await dispatch(submitAd(formData))
    } catch (err) {
      console.error('Submission error:', err)
    }
  }

  if (!userInfo) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Redirecting to login...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8}>
            <h2 className="my-4">Submit Your Ad</h2>
            
            {adSuccess && (
              <Alert variant="success">
                Your ad has been successfully submitted! Redirecting to home page...
              </Alert>
            )}
            
            {adError && (
              <Alert variant="danger">
                {adError}
              </Alert>
            )}
            
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Label>Phone Number</Form.Label>
                <Row>
                  <Col xs={4}>
                    <Form.Control
                      as="select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+255">+255 (Tanzania)</option>
                      <option value="+254">+254 (Kenya)</option>
                      <option value="+256">+256 (Uganda)</option>
                    </Form.Control>
                  </Col>
                  <Col xs={8}>
                    <Form.Control
                      type="text"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="adTitle">
                <Form.Label>Ad Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ad title"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="adDescription">
                <Form.Label>Ad Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter ad description"
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="adType">
                <Form.Label>Ad Type</Form.Label>
                <Form.Control
                  as="select"
                  value={adType}
                  onChange={(e) => setAdType(e.target.value)}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="adFile">
                <Form.Label>Upload Ad File</Form.Label>
                <small className="text-muted">Advertisement should not Exceed More than 10 seconds and 15 MB</small>
                <Form.File
                  onChange={(e) => setAdFile(e.target.files[0])}
                  accept={adType === 'image' ? 'image/*' : 'video/*'}
                  required
                />
              </Form.Group>

              <Form.Group controlId="paymentInstructions">
                <Form.Label>Payment Instructions</Form.Label>
                <div className="text-center">
                  <img 
                    src={paymentInstructions} 
                    alt="Payment Instructions" 
                    className="img-fluid" 
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="paymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="lipa_namba">Lipa Namba</option>
                  <option value="other">Other</option>
                </Form.Control>
                {paymentMethod === 'lipa_namba' && (
                  <small className="text-muted">
                    Please send payment to: 0712345678 (Example number)
                  </small>
                )}
              </Form.Group>

              <Form.Group controlId="paymentProof">
                <Form.Label>Payment Proof (Screenshot)</Form.Label>
                <Form.File
                  onChange={(e) => setPaymentProof(e.target.files[0])}
                  accept="image/*"
                  required
                />
              </Form.Group>

              <Form.Group controlId="agreement">
                <Form.Check
                  type="checkbox"
                  label="I confirm that I have made the payment and the details above are correct."
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  required
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                disabled={adLoading || !agreement}
                className="mb-5"
              >
                {adLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {' Submitting...'}
                  </>
                ) : 'Submit Ad'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton={modalVariant !== 'success'}>
          <Modal.Title>{modalVariant === 'success' ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant={modalVariant}>{modalMessage}</Alert>
          {modalVariant === 'success' && (
            <div className="text-center mt-2">
              <Spinner animation="border" size="sm" />
              <p>Redirecting to home page...</p>
            </div>
          )}
        </Modal.Body>
        {modalVariant !== 'success' && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      <BottomNavBar />
    </>
  )
}

export default AdSubmissionPage