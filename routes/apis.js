const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

const userController = require('../controllers/userController')

const authenticated = passport.authenticate('jwt', {session: false})

// normal login
router.post('/signin', userController.signIn)

// login by facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] } ))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), userController.loginByFacebook)

// login by Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}))

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), userController.loginByGoogle)

// getCurrentUser profile
router.get('/currentuser', authenticated, userController.getCurrentUser)

module.exports = router