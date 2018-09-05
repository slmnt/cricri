import url from 'url';
import jwt from 'jsonwebtoken';
import err from './errors';

const https = false
const BASE_URL = (https && "https" || "http") + '://localhost:3000'
const API_URL = BASE_URL + '/api'
const STATIC_URL = BASE_URL + '/static'

var misc = {
  getToken: function () {
    return localStorage.getItem('id_token') || null
  },
  destroyToken: function () {
    localStorage.removeItem('id_token')
  }
}



function is_token_expired(token) {
  var curr = Math.floor(new Date() / 1000)
  return curr >= token.exp
}

function callAPI(method, endpoint, authenticated, cfg = {}) {

  //let token = localStorage.getItem('access_token') || null
  let token = misc.getToken()
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
        throw new err.NoToken("トークンがありません")
      })
    }
  }

  return fetch(API_URL + endpoint, config).then(function(response) {
    console.log(response)
    return response.json().catch(e => ({ok: false, error: e}))
  }).then(result => {
    if (result.ok === false) {
      throw result
    }
    return result
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
  },
  withUrlParams: function (origPath, params) {
    let orgUrl = url.parse(origPath)
    orgUrl.query = params
    return url.format(orgUrl)
  },
}
var shorthand = {
  upload: function (formData) {
    let config = {
      body: formData
    }
    return callAPI("post", "/upload", true, config)
  },
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
  getUser: function (id) {
    return callAPI("get", "/users/" + id.toString(), false);
  },
  searchUsers: function (params) {
    let path = helper.withUrlParams("/users", params)
    return callAPI("get", path, false);
  },
  updateUser: function (params) {
    let config = helper.withParams({}, params)
    return callAPI("put", "/me", true, params);
  },
  getMyInfo: function () {
    return callAPI("get", "/me", true);
  },
  createProject: function(params) {
    let config = helper.withParams({}, params)
    return callAPI("post", "/projects", true, config);
  },
  deleteProject: function (id) {
    return callAPI("delete", "/projects/" + id.toString(), true);
  },
  getProject: function (id) {
    return callAPI("get", "/projects/" + id.toString(), false)
  },
  getProjectsByUser: function (id) {
    return callAPI("get", "/users/" + id.toString() + "/projects", false)
  },
  searchProjects: function(params) {
    let path = helper.withUrlParams("/projects", params)
    return callAPI("get", path, false)
  },
  joinProject: function(id) {
    return callAPI("post", "/projects/" + id.toString() + "/members", true)
  },
  getProjectMembers: function(id) {
    return callAPI("get", "/projects/" + id.toString() + "/members", false)
  },
  createProjectComment: function(id, params) {
    let config = helper.withParams({}, params)
    return callAPI("post", "/projects/" + id.toString() + "/comments", true, config);
  },
  getProjectComments: function(id) {
    return callAPI("get", "/projects/" + id.toString() + "/comments", false)
  },
  createUserComment: function(id, params) {
    let config = helper.withParams({}, params)
    return callAPI("post", "/users/" + id.toString() + "/comments", true, config);
  },
  getUserComments: function(id) {
    return callAPI("get", "/users/" + id.toString() + "/comments", false)
  },
  getUserProjects: function(id) {
    return callAPI("get", "/users/" + id.toString() + "/projects", false)
  }
}


export default Object.assign(methods, helper, shorthand, misc);