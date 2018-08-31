/*
  import err from './error'
  throw new err.NoToken("??") // NoToken を throw
  err.NoToken.is(e) // catch した e が NoToken か判断
 */


function customError(name) {
  var NewError = function (message) {
    this.message = message;
    this.stack = Error().stack;
  }
  Object.setPrototypeOf(NewError, Error);
  NewError.prototype = Object.create(Error.prototype);
  NewError.prototype.name = name;
  NewError.prototype.constructor = NewError;
  NewError.errorName = name;
  NewError.is = function(err) {
    return err.name == name;
  }
  return NewError;
}

var errors = {
  NoToken: true
}
for (var err of Object.keys(errors)) {
  errors[err] = customError(err)
}

export default errors