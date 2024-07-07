const router = require('express').Router();

const { createUser, findUserById, login } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/', createUser);
router.post('/login', login);
router.get('/:userId', auth, findUserById);

module.exports = router;
