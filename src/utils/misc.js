export function getTempPath(url) {
  if (!url.host || !url.protocol) {
    return "https://localhost" + url.pathname + url.search
  } else {
    return url.href
  }
}
export function setParams(url, params) {
  var n = new URL(getTempPath(url))
  const sp = new URLSearchParams(n.searchParams);
  for (var key in params) {
    sp.set(key, params[key])
  }
  n.search = sp
  return n
}
export function getSearchParams(url) {
  return new URLSearchParams(new URL(getTempPath(url)).searchParams);
}
export function getRelativePath(url) {
  return url.pathname + url.search
}
export function mapStateToProps(state) {

  const { auth, retrieve, modal } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage,
    userdata: isAuthenticated && retrieve.userdata || undefined,
    signinModal: modal.signin,
    signupModal: modal.signup,
  }
}