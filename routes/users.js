var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET user listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/signin', function(req, res, next) {
    res.render('user/signin', { csrfToken: req.csrfToken() });
});

router.get('/profile', function (req, res, next) {
    res.render('user/profile');
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signin', function(req, res, next) {
   //console.log("Inside post /signin "+ req.body);
});

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: 'profile',
    failureRedirect: 'signup',
    failureFlash: true
}));

module.exports = router;
