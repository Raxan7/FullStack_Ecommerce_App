import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductDetails } from '../actions/productActions';
import Message from '../components/Message';
import { Spinner, Row, Col, Container, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants';

function ProductDetailsPage({ history, match }) {
    const [show, setShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const productDetailsReducer = useSelector(state => state.productDetailsReducer);
    const { loading, error, product } = productDetailsReducer;

    const userLoginReducer = useSelector(state => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    const deleteProductReducer = useSelector(state => state.deleteProductReducer);
    const { success: productDeletionSuccess } = deleteProductReducer;

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
                <Modal.Body>Are you sure you want to delete this product <em>"{product.name}"</em>?</Modal.Body>
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
                                <Card.Img variant="top" src={product.image} height="420" />

                                {userInfo && userInfo.admin && (
                                    <span style={{ display: "flex" }}>
                                        <Button
                                            className="btn mt-2 btn-danger btn-sm button-focus-css"
                                            style={{ width: "100%" }}
                                            onClick={handleShow}
                                        >
                                            Delete Product
                                        </Button>

                                        <Button
                                            className="ml-2 mt-2 btn btn-primary btn-sm button-focus-css"
                                            onClick={() => history.push(`/product-update/${product.id}/`)}
                                            style={{ width: "100%" }}
                                        >
                                            Edit Product
                                        </Button>
                                    </span>
                                )}
                            </Col>

                            <Col sm>
                                <b>{product.name}</b>
                                <span className="badge badge-secondary ml-2">
                                    {product.category_name}
                                </span>
                                <hr />
                                <span className="justify-description-css">
                                    <p>{product.description}</p>
                                </span>
                                <span style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    border: "1px solid",
                                    borderColor: "#C6ACE7",
                                    padding: "2px"
                                }}>
                                    Price:<span className="text-success ml-2">Tsh {product.price}</span>
                                </span>
                            </Col>
                            <Col sm>
                                <b>Buy</b>
                                <hr />
                                {product.stock ? (
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
                                            to={`/order-now?product=${product.id}&qty=${quantity}&name=${encodeURIComponent(product.name)}`} 
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
        </div>
    );
}

export default ProductDetailsPage;