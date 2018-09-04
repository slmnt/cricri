var path = require('path');

var static_path = "build"
var upload = path.join("public", "upload")

module.exports = {
  static: static_path,
  upload
}