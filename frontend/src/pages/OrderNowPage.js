import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Container, Alert, Spinner } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { createOrderRequest } from '../actions/orderActions'
import { ORDER_REQUEST_RESET } from '../constants'

function OrderNowPage() {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    district: '',
    ward: '',
    street: '',
    product_details: ''
  })

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const orderRequest = useSelector(state => state.orderRequest)
  const { loading, error, success } = orderRequest

  const { userInfo } = useSelector(state => state.userLogin || {})

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // Set product details from URL
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search)
      const productId = params.get('product')
      if (productId) {
        setFormData(prev => ({
          ...prev,
          product_details: `Order for product ID: ${productId}`
        }))
      }
    }
  }, [location])

  // Handle redirects
  useEffect(() => {
    if (!userInfo) {
      history.push('/login?redirect=/order-now' + location.search)
      return
    }

    if (success) {
      const timer = setTimeout(() => {
        dispatch({ type: ORDER_REQUEST_RESET })
        history.push('/')
      }, 2000) // Redirect after 2 seconds to show success message
      return () => clearTimeout(timer)
    }
  }, [dispatch, history, userInfo, success, location.search])

  const submitHandler = (e) => {
    e.preventDefault()
    
    if (!userInfo) {
      history.push('/login?redirect=/order-now' + location.search)
      return
    }

    dispatch(createOrderRequest({
      ...formData,
      user: userInfo.id
    }))
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="my-4 text-center">Place Your Order</h2>
          
          {success && (
            <Alert variant="success" className="text-center">
              Order submitted successfully! Redirecting...
            </Alert>
          )}
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={submitHandler}>
            {['name', 'region', 'district', 'ward', 'street'].map((field) => (
              <Form.Group key={field} controlId={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  placeholder={`Enter your ${field.replace('_', ' ')}`}
                />
              </Form.Group>
            ))}

            <Form.Group controlId="product_details">
              <Form.Label>Product Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.product_details}
                onChange={handleChange}
                required
                placeholder="Describe what you want to order"
              />
            </Form.Group>

            <div className="text-center mt-4">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mr-2"
                    />
                    Processing...
                  </>
                ) : 'Submit Order'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderNowPage