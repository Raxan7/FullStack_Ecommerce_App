import axios from 'axios'
import {
    AD_SUBMISSION_REQUEST,
    AD_SUBMISSION_SUCCESS,
    AD_SUBMISSION_FAIL,
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

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const submitAd = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: AD_SUBMISSION_REQUEST });
        console.log('Submitting ad to the server...');

        const { userLoginReducer } = getState();
        const { userInfo } = userLoginReducer;
        
        if (!userInfo) {
            throw new Error('Please login to submit an ad');
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token || userInfo.access}`, // Try both
            },
            withCredentials: true,
        };

        const { data } = await axios.post(
            `${API_URL}/ads/submit/`,
            formData,
            config
        );        

        console.log('Ad submission successful:', data);

        dispatch({
            type: AD_SUBMISSION_SUCCESS,
            payload: data,
        });

    } catch (error) {
        console.error('Ad submission failed:', error.response || error.message);

        dispatch({
            type: AD_SUBMISSION_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
}

export const approveAd = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: AD_APPROVAL_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.put(
            `${API_URL}/ads/approve/${id}/`,
            {},
            config
        )

        dispatch({
            type: AD_APPROVAL_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: AD_APPROVAL_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

export const listActiveAds = () => async (dispatch) => {
    try {
        dispatch({ type: ACTIVE_ADS_REQUEST })

        const { data } = await axios.get(`${API_URL}/ads/active/`)

        dispatch({
            type: ACTIVE_ADS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ACTIVE_ADS_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

export const listPendingAds = () => async (dispatch, getState) => {
    try {
      dispatch({ type: PENDING_ADS_REQUEST })
  
      const config = {
        headers: {
        },
      }
  
      const { data } = await axios.get(
        `${API_URL}/ads/pending/`,
        config
      )
  
      dispatch({
        type: PENDING_ADS_SUCCESS,
        payload: data,
      })
  
    } catch (error) {
      dispatch({
        type: PENDING_ADS_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      })
    }
}