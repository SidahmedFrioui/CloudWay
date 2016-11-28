module.exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/users/login')
}
module.exports.findUser = function(uname, callback) {
  user.find({_id: uname}, function(err, userr) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, userr);
    }
  });
};
