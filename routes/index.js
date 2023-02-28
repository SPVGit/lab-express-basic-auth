const router = require("express").Router();

/* GET home page */
router.get("/main", (req, res, next) => {
  res.render("index");
});

module.exports = router;
