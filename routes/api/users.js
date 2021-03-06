/* eslint-disable consistent-return */
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

const router = express.Router();

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      }

      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      // Create new User model
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // Hash the password from body
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser
            .save()
            .then(userResult => res.json(userResult))
            .catch(jsonError => console.log(jsonError));
        });
      });
    });
});

// @route   GET api/users/login
// @desc    Login user / Return JWT token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) return res.status(400).json(errors);
  const formData = req.body;

  // Find user by email
  User.findOne({ email: formData.email })
    .then((user) => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json({ email: 'User not found' });
      }

      bcrypt.compare(formData.password, user.password)
        .then((isMatch) => {
          // Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };

          if (isMatch) {
            jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
              res.json({ success: true, token: `Bearer ${token}` });
            });
          } else {
            errors.password = 'Password Incorrect';
            return res.status(400).json(errors);
          }
        });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
