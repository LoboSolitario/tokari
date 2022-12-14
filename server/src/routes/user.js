const express = require('express');
const { getAllUsers, getUser, registerUser, loginUser, deleteUser, updateUser, getInvestorStats, landingPageBaskets, getBasketsOfManager, getManagerStats } = require('../controllers/userController')
const router = express.Router();
const { protect, authRole } = require('../middleware/authMiddleware')
const {ROLE} = require('../permissions')


router.get('/', getAllUsers);

router.get('/investorStats', protect, getInvestorStats);

router.get('/landingPageBaskets', landingPageBaskets)

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/userDetails', protect, getUser);

router.delete('/deleteUser/:id', deleteUser);

router.patch('/updateUser/:id', updateUser);

router.get('/manager/:id', getBasketsOfManager);

router.get('/stats/manager/', protect, authRole(ROLE.MANAGER), getManagerStats);


module.exports = router;