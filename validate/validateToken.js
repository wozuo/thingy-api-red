'use strict';

module.exports = {
  validateFunction: function (token, callback) {
    var request = this;
    console.log("User ID: " + request.params.user_id);
    // TODO: Validate token
    if (token === "1234") {
      return callback(null, true, { token: token }, { });
    }
    return callback(null, false, { token: token }, { });
  }
}
