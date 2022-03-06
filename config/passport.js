require('dotenv').config()

const passport = require('passport')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequests: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayLoad, cb) => {
  User.findByPk(jwtPayLoad.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport