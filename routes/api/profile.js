/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEduationInput = require('../../validation/education');


// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile/
// @desc    Get current uswers profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofiles = 'There are no profiles';
        return res.status(404).json();
      }

      res.json(profiles);
    })
    .catch(() => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by userid
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(() => res.status(404).json({ profile: 'There is no profile for this user' }));
});

// @route   POST api/profile/
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  // Get fields
  const profileFields = {};

  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // Skills = Split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // Handle writing to DB
  Profile.findOne({ user: req.user.id }).then((profile) => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      ).then(profileUpdated => res.json(profileUpdated));
    } else {
      // Create
      // Check if handle exisits
      Profile.findOne({ handle: profileFields.handle })
        .then((handleFound) => {
          if (handleFound) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFields).save()
            .then(profileSaved => res.json(profileSaved));
        });
    }
  });
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profileUpdated => res.json(profileUpdated));
    });
});

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEduationInput(req.body);

  // Check validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profileUpdated => res.json(profileUpdated));
    });
});

// @route   DELETE api/profile/experience
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
      if (removeIndex === -1) {
        errors.noentrytodelete = 'There is no experience to delete';
        res.status(404).json(errors);
      } else {
        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.status(200).json(profile));
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/education
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
      if (removeIndex === -1) {
        errors.noentrytodelete = 'There is no education entry to delete';
        res.status(404).json(errors);
      } else {
        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.status(200).json(profile));
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ id: req.user.id })
        .then(() => res.json({ success: true }));
    });
});
module.exports = router;
