var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/ypl', function(req,res,next){
  res.send('welcome, Yuliana!')
})

module.exports = router;
