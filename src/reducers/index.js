import { combineReducers } from 'redux'
import {
  TEST, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, QUOTE_REQUEST, STORE_MY_DATA, OPEN_SIGNIN, OPEN_SIGNUP, CLOSE_SIGNIN, CLOSE_SIGNUP
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

function modal(state = {signin: false, signup: false}, action) {
  switch (action.type) {
    case OPEN_SIGNIN:
      return Object.assign({}, state, {
        signin: true
      })
    case OPEN_SIGNUP:
      return Object.assign({}, state, {
        signup: true
      })
    case CLOSE_SIGNIN:
      return Object.assign({}, state, {
        signin: false
      })
    case CLOSE_SIGNUP:
      return Object.assign({}, state, {
        signup: false
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

export default combineReducers({auth, retrieve, modal, test})
