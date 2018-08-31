import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import Reducer from '../reducers';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
export default createStoreWithMiddleware(Reducer)
