import { combineReducers } from 'redux'
import {
  TEST, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, QUOTE_REQUEST, STORE_MY_DATA
} from '../actions'

function auth(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
  }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: ''
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    case QUOTE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    default:
      return state
  }
}

function retrieve(state = {}, action) {
  switch (action.type) {
    case STORE_MY_DATA:
      return Object.assign({}, state, {
        hey: true,
        userdata: action.data
      })
    default:
      return state
  }
}

function test(state = {test: false}, action) {
  switch (action.type) {
    case TEST:
      console.log("dispatch: test")
      return Object.assign({}, state, {
        test: true
      })
    default:
      return state
  }
}

export default combineReducers({auth, retrieve, test})
