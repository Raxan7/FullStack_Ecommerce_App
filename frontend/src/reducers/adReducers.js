import {
    AD_SUBMISSION_REQUEST,
    AD_SUBMISSION_SUCCESS,
    AD_SUBMISSION_FAIL,
    AD_SUBMISSION_RESET,
    AD_APPROVAL_REQUEST,
    AD_APPROVAL_SUCCESS,
    AD_APPROVAL_FAIL,
    ACTIVE_ADS_REQUEST,
    ACTIVE_ADS_SUCCESS,
    ACTIVE_ADS_FAIL,
    PENDING_ADS_REQUEST,
    PENDING_ADS_SUCCESS,
    PENDING_ADS_FAIL
} from '../constants'

export const adSubmissionReducer = (state = {
    loading: false,
    error: null,
    success: false,
    ad: null
}, action) => {
    switch (action.type) {
        case AD_SUBMISSION_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null, 
                success: false 
            }
        case AD_SUBMISSION_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                success: true, 
                error: null, 
                ad: action.payload 
            }
        case AD_SUBMISSION_FAIL:
            return { 
                ...state, 
                loading: false, 
                success: false, 
                error: action.payload 
            }
        case AD_SUBMISSION_RESET:
            return { 
                loading: false, 
                error: null, 
                success: false, 
                ad: null 
            }
        default:
            return state
    }
}

export const adApprovalReducer = (state = {}, action) => {
    switch (action.type) {
        case AD_APPROVAL_REQUEST:
            return { loading: true }
        case AD_APPROVAL_SUCCESS:
            return { loading: false, success: true }
        case AD_APPROVAL_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const activeAdsListReducer = (state = { activeAds: [] }, action) => {
    switch (action.type) {
        case ACTIVE_ADS_REQUEST:
            return { loading: true, activeAds: [] }
        case ACTIVE_ADS_SUCCESS:
            return { loading: false, activeAds: action.payload }
        case ACTIVE_ADS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const pendingAdsListReducer = (state = { pendingAds: [] }, action) => {
    switch (action.type) {
      case PENDING_ADS_REQUEST:
        return { loading: true, pendingAds: [] }
      case PENDING_ADS_SUCCESS:
        return { loading: false, pendingAds: action.payload }
      case PENDING_ADS_FAIL:
        return { loading: false, error: action.payload }
      default:
        return state
    }
}