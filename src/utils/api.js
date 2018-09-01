import url from 'url';
import jwt from 'jsonwebtoken';
import err from './errors';

const https = false
const BASE_URL = (https && "https" || "http") + '://localhost:3000/api'

function is_token_expired(token) {
  var curr = Math.floor(new Date() / 1000)
  return curr >= token.exp
}

function callAPI(method, endpoint, authenticated, cfg = {}) {

  //let token = localStorage.getItem('access_token') || null
  let token = localStorage.getItem('id_token') || null
  let config = cfg;
  config.method = method;

  if(authenticated) {
    if(token) {
      var token_obj = jwt.decode(token)
      if (is_token_expired(token_obj)) {
        console.log("トークンが切れました");
        return new Promise(function(resolve, reject) {
          throw new err.TokenExpired("")
        })
      }
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    else {
      console.log("ログインしていません");
      return new Promise(function(resolve, reject) {
        throw new err.NoToken("")
      })
    }
  }

  return fetch(BASE_URL + endpoint, config).then(function(response) {
    return response.json();
  })
}

function call(method) {
  return function (endpoint, authenticated, config) {
    return callAPI(method, endpoint, authenticated, config);
  }
}

var methods = {
  get: call("GET"),
  post: call("POST"),
  put: call("PUT"),
  delete: call("DELETE"),
}

var helper = {
  withParams: function (origConfig, params) {
    let config = Object.assign({}, origConfig)
    config.headers = config.headers || {}
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.body = url.format({query: params}).substring(1)
    return config
  }
}
var shorthand = {
  createSession: function (username, password) {
    let config = helper.withParams({}, {username, password})
    return callAPI("post", "/session", false, config);
  },
  deleteSession: function () {
    return callAPI("delete", "/session", true);
  },
  testSession: function () {
    return callAPI("get", "/session/test", true);
  },
  createUser: function(params) {
    let config = helper.withParams({}, params)
    return callAPI("post", "/users", false, config);
  },
  deleteUser: function () {
    return callAPI("delete", "/users", true);
  },
  getUser: function () {

  },
  getMyInfo: function () {
    return callAPI("get", "/me", true);
  }
}


export default Object.assign(methods, helper, shorthand);