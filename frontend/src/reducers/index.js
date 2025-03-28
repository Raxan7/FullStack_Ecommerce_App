import { combineReducers } from "redux";
import {
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    changeDeliveryStatusReducer,
} from "./productReducers";

import {
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    deleteSavedCardReducer,
    updateStripeCardtReducer
} from "./cardReducers";

import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    checkTokenValidationReducer,
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
} from "./userReducers";

// Import the new ad reducers
import {
    adSubmissionReducer,
    adApprovalReducer,
    activeAdsListReducer,
    pendingAdsListReducer
} from "./adReducers";

import { orderRequestReducer } from './orderReducers'

const allReducers = combineReducers({
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    createCardReducer,
    chargeCardReducer,
    savedCardsListReducer,
    updateStripeCardtReducer,
    deleteSavedCardReducer,
    userLoginReducer,
    userRegisterReducer,    
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
    changeDeliveryStatusReducer,
    checkTokenValidationReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    
    // Add the new ad reducers
    adSubmission: adSubmissionReducer, // Changed from adSubmissionReducer
    adApproval: adApprovalReducer,
    activeAds: activeAdsListReducer,
    pendingAds: pendingAdsListReducer,

    orderRequest: orderRequestReducer,
})

export default allReducers;