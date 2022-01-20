let express = require('express');
let router = express.Router();

/* GET Home.vue page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '111' });
});

module.exports = router;
