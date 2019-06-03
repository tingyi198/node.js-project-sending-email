var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

var app = express();


/* GET mailList page. */
router.get('/', function (req, res, next) {
  admin.database().ref('email').once('value', function (snapshot) {
    res.render('mailList', { mail: snapshot.val() });
  });
});

// remove
router.get('/remove', function (req, res) {

  // 寫進資料庫
  admin.database().ref('email').child(req.query.id).remove();
  res.redirect('/mailList');
  
});

module.exports = router;
