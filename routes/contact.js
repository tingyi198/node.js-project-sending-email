var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var nodemailer = require('nodemailer');
var admin = require("firebase-admin");

var app = express();
// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());


/* GET contact page. */
router.get('/', csrfProtection, function (req, res, next) {

  // csrf
  res.render('contact', {
    csrfToken: req.csrfToken(),
    nameError: req.flash('nameError'),
  })

});

router.post('/send', function (req, res) {

  // 驗證參數
  if (req.body.username == '') {
    req.flash('nameError', '姓名不可為空');
    res.redirect('/contact');
  }

  // 發送 email
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  var mailOption = {
    from: '<ting@gmail.com>',
    to: process.env.SEND_TO,
    subject: req.body.username + '寄信測試',
    text: req.body.description
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      return console.log(error);
    }
    res.render('contactReview');
  });

  // 寫進資料庫
  // admin.database().ref('todos').once('value', function (snapshot) {
  //   console.log(snapshot.val());
  // });
  admin.database().ref('email').push({
    name: req.body.username,
    email: req.body.email,
    title: req.body.title,
    description: req.body.description
  });

  // res.render('contactReview');
});

module.exports = router;
