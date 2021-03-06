var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
const passport = require('passport');
const connectEnsure = require('connect-ensure-login');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Username: req.body.username,
        Password: req.body.password
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.redirect('/users/login');
      } else {
        res.send('this user already exists');
      }
    });
});


router.get('/profile/:id', connectEnsure.ensureLoggedIn(), function(req, res) {
  if (req.user.UserId === parseInt(req.params.id)) {
    res.render('profile', {
      FirstName: req.user.FirstName,
      LastName: req.user.LastName,
      Email: req.user.Email,
      UserId: req.user.UserId,
      Username: req.user.Username
    });
  } else {
    res.send('This is not your profile');
  }
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login'
}),
function (req, res, next) {
  res.redirect('profile/' + req.user.UserId);
}
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;