import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductDetails } from '../actions/productActions';
import Message from '../components/Message';
import { Spinner, Row, Col, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants';
import BottomNavBar from '../components/BottomNavBar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './css/ProductDetailsPage.css'; // Create this CSS file for custom styles

function ProductDetailsPage({ history, match }) {
    const [show, setShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);
    const dispatch = useDispatch();
    const carouselRef = useRef(null);

    const productDetailsReducer = useSelector(state => state.productDetailsReducer);
    const { loading, error, product } = productDetailsReducer;

    const userLoginReducer = useSelector(state => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    const deleteProductReducer = useSelector(state => state.deleteProductReducer);
    const { success: productDeletionSuccess } = deleteProductReducer;

    // Combine main image with additional images
    const allImages = product?.image 
        ? [product.image, ...(product.images?.map(img => img.image) || [])]
        : product.images?.map(img => img.image) || [];

    // Construct image URL using environment variable
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
    };

    // Auto-scroll effect
    useEffect(() => {
        if (!autoScroll || allImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [autoScroll, allImages.length]);

    // Scroll to current image
    useEffect(() => {
        if (carouselRef.current) {
            const imageWidth = carouselRef.current.children[0]?.offsetWidth || 0;
            carouselRef.current.scrollTo({
                left: currentImageIndex * imageWidth,
                behavior: 'smooth'
            });
        }
    }, [currentImageIndex]);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));
        dispatch({ type: UPDATE_PRODUCT_RESET });
        dispatch({ type: CREATE_PRODUCT_RESET });
        dispatch({ type: CARD_CREATE_RESET });
    }, [dispatch, match]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id));
        handleClose();
    };

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
        setAutoScroll(false);
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
        setAutoScroll(false);
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
        setAutoScroll(false);
    };

    if (productDeletionSuccess) {
        alert("Product successfully deleted.");
        history.push("/");
        dispatch({ type: DELETE_PRODUCT_RESET });
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                        {" "}
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this product <em>"{product?.name}"</em>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmDelete}>
                        Confirm Delete
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {loading && (
                <span style={{ display: "flex" }}>
                    <h5>Getting Product Details</h5>
                    <span className="ml-2">
                        <Spinner animation="border" />
                    </span>
                </span>
            )}
            
            {error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div>
                    <Container>
                        <Row>
                            <Col md={6}>
                                {/* Image Carousel */}
                                <div className="image-carousel-container">
                                    <div 
                                        className="image-carousel" 
                                        ref={carouselRef}
                                        onMouseEnter={() => setAutoScroll(false)}
                                        onMouseLeave={() => setAutoScroll(true)}
                                    >
                                        {allImages.map((img, index) => (
                                            <div 
                                                key={index} 
                                                className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                                            >
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`${product?.name} ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Navigation Arrows */}
                                    {allImages.length > 1 && (
                                        <>
                                            <button 
                                                className="carousel-button prev" 
                                                onClick={prevImage}
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button 
                                                className="carousel-button next" 
                                                onClick={nextImage}
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* Indicators */}
                                    {allImages.length > 1 && (
                                        <div className="carousel-indicators">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                                                    onClick={() => goToImage(index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {userInfo && userInfo.id === product?.user && (
                                    <span style={{ display: "flex", marginTop: '15px' }}>
                                        <Button
                                            className="btn btn-danger btn-sm button-focus-css"
                                            style={{ width: "100%" }}
                                            onClick={handleShow}
                                        >
                                            Delete Product
                                        </Button>

                                        <Button
                                            className="ml-2 btn btn-primary btn-sm button-focus-css"
                                            onClick={() => history.push(`/product-update/${product?.id}/`)}
                                            style={{ width: "100%" }}
                                        >
                                            Edit Product
                                        </Button>
                                    </span>
                                )}
                            </Col>

                            <Col sm>
                                <b>{product?.name}</b>
                                <span className="badge badge-secondary ml-2">
                                    {product?.category_name}
                                </span>
                                <hr />
                                <span className="justify-description-css">
                                    <p>{product?.description}</p>
                                </span>
                                <span style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    border: "1px solid",
                                    borderColor: "#C6ACE7",
                                    padding: "2px"
                                }}>
                                    Price:<span className="text-success ml-2">Tsh {Math.floor(product?.price || 0).toLocaleString()}</span>
                                </span>
                            </Col>
                            <Col sm>
                                <b>Buy</b>
                                <hr />
                                {product?.stock ? (
                                    <>
                                        <Form.Group controlId="quantity">
                                            <Form.Label>Quantity</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            >
                                                {[...Array(10).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Link 
                                            to={`/order-now?product=${product?.id}&qty=${quantity}&name=${encodeURIComponent(product?.name)}&price=${product?.price}&supplier=${encodeURIComponent(product?.supplier_info?.name || '')}&whatsapp=${encodeURIComponent(product?.supplier_info?.whatsapp_link || '')}`} 
                                            className="btn btn-success btn-block"
                                        >
                                            Order Now
                                        </Link>
                                    </>
                                ) : (
                                    <Message variant='danger'>Out Of Stock!</Message>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
            <BottomNavBar />
        </div>
    );
}

export default ProductDetailsPage;