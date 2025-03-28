import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Card } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'
import { Link } from 'react-router-dom'

function ProductsListPage() {
    let history = useHistory()
    let searchTerm = history.location.search ? history.location.search.split("=")[1].toLowerCase() : "";
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer

    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }, [dispatch])

    const showNothingMessage = () => {
        return (
            <div>
                {!loading ? <Message variant='info'>Nothing to show</Message> : ""}                
            </div>
        )
    }

    return (
        <div>
            {/* Prominent Advertise Section */}
            <Card className="mb-4 shadow-sm" style={{ 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: 'none',
                borderRadius: '10px'
            }}>
                <Card.Body className="text-center py-4">
                    <h2 style={{ 
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}>
                        Want More Customers For Your Products?
                    </h2>
                    <p className="lead mb-4" style={{ 
                        color: '#34495e',
                        fontSize: '1.25rem'
                    }}>
                        Advertise with us and reach thousands of potential buyers!
                    </p>
                    <div className="d-flex justify-content-center">
                        <Link 
                            to="/advertise" 
                            className="btn btn-primary btn-lg"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                borderRadius: '50px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)'
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Advertise With Us →
                        </Link>
                    </div>
                    <div className="mt-3 text-muted">
                        <small>Only Tsh 500 per day or Tsh 5000 per month</small>
                    </div>
                </Card.Body>
            </Card>

            {/* Existing Product Listing */}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Products</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            <div>
                <Row>
                    {products.filter((item) => item.name.toLowerCase().includes(searchTerm)).length === 0 
                        ? showNothingMessage() 
                        : products.filter((item) => item.name.toLowerCase().includes(searchTerm))
                            .map((product, idx) => (
                                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                                    <div className="mx-2"> 
                                        <Product product={product} />
                                    </div>
                                </Col>
                            ))
                    }
                </Row>
            </div>
        </div>
    )
}

export default ProductsListPage