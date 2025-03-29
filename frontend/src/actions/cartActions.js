import { ADD_TO_CART } from '../constants/cartConstants';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const addToCart = (id, qty) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
            },
        });

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};