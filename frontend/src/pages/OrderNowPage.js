import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom'; // Changed useNavigate to useHistory
import { createOrderRequest } from '../actions/orderActions';
import BottomNavBar from '../components/BottomNavBar'; // Import the component

function OrderNowPage() {
    console.log("Rendering OrderNowPage...");

    const [formData, setFormData] = useState({
        name: '',
        region: '',
        district: '',
        ward: '',
        street: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    console.log("Initial formData:", formData);

    const location = useLocation();
    const history = useHistory(); // Changed navigate to history
    const dispatch = useDispatch();
    const { userInfo, loading } = useSelector(state => state.userLoginReducer || {});
    

    console.log("User info:", userInfo);

    const params = new URLSearchParams(location.search);

    const productName = params.get('name') || 'Product';
    const productPrice = params.get('price') || '0';
    const supplierName = params.get('supplier') || 'Unknown Supplier';
    const whatsappLink = params.get('whatsapp') || 'No Number';

    console.log("Product details from URL:", { productName, productPrice, supplierName, whatsappLink });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with formData:", formData);

        // Ensure userInfo is correctly populated
        if (!loading && (!userInfo || !userInfo.id)) {
            console.log("User not authenticated. Redirecting to login...");
            history.push(`/login?redirect=/order-now${location.search}`);
            return;
        }

        // Get order details from URL
        const quantity = params.get('qty') || 1;
        const productId = params.get('product');

        console.log("Order details:", { quantity, productId });

        // Construct WhatsApp message
        const message = `*NEW ORDER REQUEST*%0A%0A` +
                       `*Product:* ${productName}%0A` +
                       `*Price:* Tsh ${productPrice}%0A` +
                       `*Quantity:* ${quantity}%0A` +
                       `*Customer Name:* ${formData.name}%0A` +
                       `*Delivery Location:*%0A` +
                       `- Region: ${formData.region}%0A` +
                       `- District: ${formData.district}%0A` +
                       `- Ward: ${formData.ward}%0A` +
                       `- Street: ${formData.street}%0A%0A` +
                       `Please confirm this order.`;

        console.log("Constructed WhatsApp message:", message);

        // Encode the message
        const encodedMessage = encodeURIComponent(message);
        console.log("Encoded WhatsApp message:", encodedMessage);

        // Use the supplier's WhatsApp link or fallback
        const whatsappURL = whatsappLink 
            ? `${whatsappLink}?text=${encodedMessage}` 
            : `https://wa.me/255123456789?text=${encodedMessage}`;
        
        console.log("WhatsApp URL:", whatsappURL);

        try {
            // Open WhatsApp in a new tab
            window.open(whatsappURL, '_blank');
            console.log("WhatsApp opened successfully.");
        } catch (error) {
            console.error("Failed to open WhatsApp:", error);
        }

        try {
            // Save to database after opening WhatsApp
            dispatch(createOrderRequest({
                ...formData,
                user: userInfo.id,
                product: productId,
                quantity: quantity,
                whatsapp_message: message
            }));
            console.log("Order request dispatched successfully.");
        } catch (error) {
            console.error("Failed to dispatch order request:", error);
        }

        setShowSuccess(true);
        console.log("Show success alert set to true.");
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(`Field changed: ${id}, Value: ${value}`);
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <Container className="py-4">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                <h2 className="text-center mb-4">Complete Your Order</h2>
                <p><strong>Product:</strong> {productName}</p>
                <p><strong>Price:</strong> Tsh {productPrice}</p>
                <p><strong>Supplier:</strong> {supplierName}</p>
                {showSuccess && (
                    <Alert variant="success" className="text-center">
                        Redirecting to WhatsApp...
                    </Alert>
                )}
                
                <Form onSubmit={handleSubmit} className="border p-4 rounded-3 shadow-sm bg-white">
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </Form.Group>

                    <h5 className="mt-4 mb-3">Delivery Details</h5>
                    
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Region</Form.Label>
                                <Form.Control
                                    id="region"
                                    type="text"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                    placeholder="Dar es Salaam"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>District</Form.Label>
                                <Form.Control
                                    id="district"
                                    type="text"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ilala"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Ward</Form.Label>
                                <Form.Control
                                    id="ward"
                                    type="text"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    required
                                    placeholder="Kariakoo"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Street/House</Form.Label>
                                <Form.Control
                                    id="street"
                                    type="text"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    placeholder="Maktaba St, House No."
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        size="lg"
                        className="w-100 mt-3 py-2"
                    >
                        <i className="fab fa-whatsapp me-2"></i>
                        Send Order via WhatsApp
                    </Button>
                </Form>
            </div>
            <BottomNavBar /> {/* Add the BottomNavBar */}
        </Container>
    );
}

export default OrderNowPage;