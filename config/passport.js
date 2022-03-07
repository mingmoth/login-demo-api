require('dotenv').config()

const passport = require('passport')
const passportJWT = require('passport-jwt')
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JWTStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email', 'photos', 'gender']
},
  function (accessToken, refreshToken, profile, cb) {
    const { name, email, picture } = profile._json
    User.findOne({where: {email: email}}).then(user => {
      if(user) {
        console.log('oldFacebookuser')
        return cb(null, user)
      } else {
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name: name,
            email: email,
            avatar: picture.data.url,
            password: hash,
          }))
          .then(user => {
            console.log('newFacebookuser')
            cb(null, user)
          })
          .catch(err => cb(err, false))
      }
    })
  }
));

module.exports = passport