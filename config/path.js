var path = require('path');

var static_path = "build"
var upload = path.join(static_path, "upload")

module.exports = {
  static: static_path,
  upload
}