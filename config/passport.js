/* eslint-disable prefer-destructuring */
const JwtStratagey = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = (passport) => {
  // eslint-disable-next-line camelcase
  passport.use(new JwtStratagey(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then(user => (user ? done(null, user) : done(null, false)))
      .catch(err => console.log(err));
  }));
};
