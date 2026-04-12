const router = require('express').Router();

router.post('/pay', (req, res) => {
  res.send({ message: 'Payment successful (dummy)' });
});

module.exports = router;