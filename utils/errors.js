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
    return (err.errorName || err.name) == name;
  }
  return NewError;
}

var errors = {
  TableNotFound: true,
  UserNotFound: true,
  UserAlreadyExists: true,
  ProjectNotFound: true,
  ProjectAlreadyExists: true,
  InvalidEmail: true,
  NotFound: true
}
for (var err of Object.keys(errors)) {
  errors[err] = customError(err)
}

export default errors