const router = require('express').Router();
const handle = require('../handlers');
const auth = require('../middleware/authorize');

router
  .route('/')
  .get(handle.showPolls)
  .post(handle.createPoll);

router.get('/user', auth, handle.usersPolls);

router
  .route('/:id')
  .get(handle.getPoll)
  .post( handle.vote)
  .delete( handle.deletePoll);

module.exports = router;
