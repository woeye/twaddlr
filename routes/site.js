/*
 * General public routes
 */

module.exports = function(app) {

  function restricted(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }

  // Configure our routes
  app.get('/', function(req, res) {
    res.render('index.jade', {});
  });

  app.get('/register', function(req, res) {
    res.render('register.jade');
  });

};