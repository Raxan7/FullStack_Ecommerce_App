import {
    ORDER_REQUEST_REQUEST,
    ORDER_REQUEST_SUCCESS,
    ORDER_REQUEST_FAIL,
    ORDER_REQUEST_RESET
} from '../constants'

const initialState = {
    loading: false,
    error: null,
    success: false,
    order: null,
    lastSubmitted: null
}

export const orderRequestReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDER_REQUEST_REQUEST:
            return { 
                ...state,
                loading: true,
                error: null,
                success: false
            }
            
        case ORDER_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                order: action.payload,
                lastSubmitted: new Date().toISOString(),
                error: null
            }
            
        case ORDER_REQUEST_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            }
            
        case ORDER_REQUEST_RESET:
            return initialState
            
        default:
            return state
    }
}