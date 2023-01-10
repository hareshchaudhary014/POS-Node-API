const { Router } = require('express')
const authenticationController = require('../controller/authenticationController')
const router = Router();
// const { requireToken, checkRole } = require('../middleware/authMiddleWare')


// router.post('/api/register', requireToken, checkRole('User Management'), authenticationController.register);
router.post('/api/login', authenticationController.login)
// router.put('/api/user/:id', requireToken, checkRole('User Management'), authenticationController.update_user)
// router.put('/api/change-password', requireToken, authenticationController.change_password)
module.exports = router;