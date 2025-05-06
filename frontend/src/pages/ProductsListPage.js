import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsList } from '../actions/productActions';
import Message from '../components/Message';
import { Spinner, Row, Col, Card, Button, ButtonGroup } from 'react-bootstrap';
import Product from '../components/Product';
import { useHistory } from 'react-router-dom';
import { CREATE_PRODUCT_RESET } from '../constants';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BottomNavBar from '../components/BottomNavBar';
import AdSlider from '../components/AdSlider';

function ProductsListPage() {
    let history = useHistory();
    let searchTerm = history.location.search ? history.location.search.split("=")[1].toLowerCase() : "";
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    
    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories/`);
                const uniqueCategories = ['All', ...new Set(data.map(category => category.name))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer);
    const { loading, error, products } = productsListReducer;

    // Fetch products based on selected category
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
                await dispatch(getProductsList(query));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
        dispatch({ type: CREATE_PRODUCT_RESET });
    }, [dispatch, selectedCategory]);

    // Log image paths of products
    useEffect(() => {
        if (products && products.length > 0) {
            products.forEach(product => {
                console.log(`Product Image Path: ${product.image}`);
            });
        }
    }, [products]);

    const showNothingMessage = () => {
        return !loading && <Message variant='info'>Nothing to show</Message>;
    };

    // Filter products by category and search term
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || 
                              product.category_name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Prominent Advertise Section */}
            <AdSlider />

            {/* Category Filter Buttons */}
            <div className="mb-4 text-center">
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <ButtonGroup className="flex-nowrap">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                                onClick={() => setSelectedCategory(category)}
                                className="mx-1 mb-2 rounded-pill"
                                style={{
                                    backgroundColor: selectedCategory === category ? 'black' : 'transparent', // Black for selected
                                    color: selectedCategory === category ? 'white' : 'black', // White text for selected
                                    borderColor: 'black' // Black border for all buttons
                                }}
                            >
                                {category}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            </div>

            {/* Product Listing */}
            {error && <Message variant='danger'>{error}</Message>}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading products...</p>
                </div>
            ) : (
                <Row>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Col key={product.id} xs={6} sm={6} md={4} lg={3} xl={3}>
                                {/* Ensured xs={6} for two columns on extra small screens */}
                                <div className="product-card mx-2">
                                    <Product product={{ ...product, price: Math.floor(product.price).toLocaleString() }} />
                                </div>
                            </Col>
                        ))
                    ) : (
                        showNothingMessage()
                    )}
                </Row>
            )}

            {/* Bottom Navigation Bar */}
            <BottomNavBar />
        </div>
    );
}

export default ProductsListPage;