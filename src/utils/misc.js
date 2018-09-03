function getTempPath(url) {
  if (!url.host || !url.protocol) {
    return "https://localhost" + url.pathname + url.search
  } else {
    return url.href
  }
}
function setParams(url, params) {
  var n = new URL(getTempPath(url))
  const sp = new URLSearchParams(n.searchParams);
  for (var key in params) {
    sp.set(key, params[key])
  }
  n.search = sp
  return n
}
function getSearchParams(url) {
  return new URLSearchParams(new URL(getTempPath(url)).searchParams);
}
function getRelativePath(url) {
  return url.pathname + url.search
}

export default {
  setParams,
  getSearchParams,
  getRelativePath,
}