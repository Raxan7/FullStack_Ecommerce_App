// src/components/UpdateWhatsAppNumber.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const UpdateWhatsAppNumber = () => {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const userLoginReducer = useSelector(state => state.userLoginReducer);
    const { userInfo } = userLoginReducer;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Validate WhatsApp number
        if (!whatsappNumber.startsWith('+255') || whatsappNumber.length !== 13) {
            setError('Please enter a valid Tanzanian WhatsApp number starting with +255 (e.g. +255712345678)');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token || userInfo.access}`,
                },
                withCredentials: true,
            };

            await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/update-whatsapp/`,
                { whatsapp_number: whatsappNumber },
                config
            );

            setSuccess(true);
            setTimeout(() => {
                history.push('/');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to update WhatsApp number');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Update Your WhatsApp Number</h2>
            <p>To continue, please provide your Tanzanian WhatsApp number starting with +255</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">WhatsApp number updated successfully!</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="whatsappNumber">
                    <Form.Label>WhatsApp Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="+255XXXXXXXXX"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        Must start with +255 and be 13 characters long (e.g. +255712345678)
                    </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Number'}
                </Button>
            </Form>
        </div>
    );
};

export default UpdateWhatsAppNumber;