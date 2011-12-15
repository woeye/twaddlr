/*
 * General public routes
 */

var seforms = require('./seforms');

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
    var form = new seforms.Form({
      rowClass: 'row',
      fields: [
        new seforms.TextField('login', {
          label: 'Login',
          attributes: { class: 'moo' }
        }),
        new seforms.PasswordField('password', {label: 'Password'})
      ]
    });
    res.render('index.jade', { form: form });
  });

  app.get('/login', function(req, res) {
    res.render('login.jade');
  });

};