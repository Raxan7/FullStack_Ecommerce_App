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

export const submitAd = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: AD_SUBMISSION_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.post(
            '/api/ads/submit/',
            formData,
            config
        )

        dispatch({
            type: AD_SUBMISSION_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: AD_SUBMISSION_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        })
    }
}

export const approveAd = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: AD_APPROVAL_REQUEST })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        }

        const { data } = await axios.put(
            `/api/ads/approve/${id}/`,
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

        const { data } = await axios.get('/api/ads/active/')

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
  
      const {
        userLogin: { userInfo },
      } = getState()
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
  
      const { data } = await axios.get(
        '/api/ads/pending/',
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