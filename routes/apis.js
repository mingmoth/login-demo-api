const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

const userController = require('../controllers/userController')

const authenticated = passport.authenticate('jwt', {session: false})

router.post('/signin', userController.signIn)

router.get('/currentuser', authenticated, userController.getCurrentUser)

module.exports = router