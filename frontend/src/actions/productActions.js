import {
    PRODUCTS_LIST_REQUEST,
    PRODUCTS_LIST_SUCCESS,
    PRODUCTS_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    CHANGE_DELIVERY_STATUS_REQUEST,
    CHANGE_DELIVERY_STATUS_SUCCESS,
    CHANGE_DELIVERY_STATUS_FAIL,
} from '../constants/index';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

// products list
export const getProductsList = () => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCTS_LIST_REQUEST
        })

        // call api
        const { data } = await axios.get(`${API_URL}/api/products/`)

        dispatch({
            type: PRODUCTS_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCTS_LIST_FAIL,
            payload: error.message
        })
    }
}


// product details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCT_DETAILS_REQUEST
        })

        // call api
        const { data } = await axios.get(`${API_URL}/api/product/${id}/`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.message
        })
    }
}


// create product
export const createProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_PRODUCT_REQUEST })

        const { userLoginReducer } = getState();
        const { userInfo } = userLoginReducer;

        if (!userInfo) {
            throw new Error('Please login to create a product');
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token || userInfo.access}`,
            },
            withCredentials: true,
        }

        const { data } = await axios.post(
            `${API_URL}/api/product-create/`,
            product,
            config
        )

        dispatch({
            type: CREATE_PRODUCT_SUCCESS,
            payload: data
        })

        return data; // Return data for promise handling

    } catch (error) {
        console.error("Error creating product:", error.response ? error.response.data : error.message)
        dispatch({
            type: CREATE_PRODUCT_FAIL,
            payload: error.response && error.response.data
                ? error.response.data
                : { detail: error.message },
        })
        
        // Re-throw the error for proper promise rejection
        throw error;
    }
}


// Update Product Action
export const updateProduct = (id, product) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const { userLoginReducer } = getState();
        const { userInfo } = userLoginReducer;

        if (!userInfo) {
            throw new Error('Please login to update a product');
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token || userInfo.access}`,
            },
            withCredentials: true,
        };

        const { data } = await axios.put(
            `${API_URL}/api/product-update/${id}/`,
            product,
            config
        );

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response?.data || { detail: error.message },
        });
    }
};

// Delete Product Action
export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const { userLoginReducer } = getState();
        const { userInfo } = userLoginReducer;

        if (!userInfo) {
            throw new Error('Please login to delete a product');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token || userInfo.access}`,
            },
            withCredentials: true,
        };

        await axios.delete(
            `${API_URL}/api/product-delete/${id}/`,
            config
        );

        dispatch({ type: DELETE_PRODUCT_SUCCESS });

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response?.data || { detail: error.message },
        });
    }
};


// change ordered product delivery status
export const changeDeliveryStatus = (id, product) => async (dispatch, getState) => {

    try {
        dispatch({
            type: CHANGE_DELIVERY_STATUS_REQUEST
        })

        // login reducer
        const {
            userLoginReducer: { userInfo },
        } = getState()

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // api call
        const { data } = await axios.put(
            `${API_URL}/account/change-order-status/${id}/`,
            product,
            config
        )

        dispatch({
            type: CHANGE_DELIVERY_STATUS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CHANGE_DELIVERY_STATUS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}
