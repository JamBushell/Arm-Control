var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home', { title: 'Arm Control' });
    // test
});
  

module.exports = router;
