import axios from 'axios';
import {
    ORDER_REQUEST_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_REQUEST_FAIL,
} from '../constants';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const createOrderRequest = (orderData) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_REQUEST_REQUEST });

        const { userLoginReducer: { userInfo } } = getState();

        if (!userInfo || !userInfo.token) {
            throw new Error('Authentication required');
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // Remove user from orderData - backend will handle it
        const { user, ...orderDataWithoutUser } = orderData;
        
        const completeOrderData = {
            ...orderDataWithoutUser,
            ordered_at: new Date().toISOString(),
            status: 'pending',
        };

        console.log('Final order data:', completeOrderData);
        
        const { data } = await axios.post(
            `${API_URL}/api/orders/request/`,
            completeOrderData,
            config
        );

        dispatch({
            type: ORDER_REQUEST_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        console.error('Order creation failed:', {
            message: error.message,
            response: error.response?.data,
        });

        const errorMessage = error.response?.data?.error || 
            error.response?.data?.detail ||
            error.message ||
            'Failed to create order';

        dispatch({
            type: ORDER_REQUEST_FAIL,
            payload: errorMessage,
        });

        throw error;
    }
};