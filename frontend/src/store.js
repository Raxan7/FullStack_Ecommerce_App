import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import allReducers from './reducers/index'

const middleware = [thunk]

const userInfoFromStorage = localStorage.getItem('userInfo') ? 
  JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
  userLoginReducer: { userInfo: userInfoFromStorage },
  adSubmission: {
    loading: false,
    error: null,
    success: false,
    ad: null
  }
}

const store = createStore(
  allReducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store