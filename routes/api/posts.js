/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Models
const Post = require('../../models/Post');

// validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts/
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(() => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(() => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts/
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  // Save
  newPost.save().then(savedPost => res.status(200).json(savedPost));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      // Check for post owner
      if (post.user.id.toString() !== req.user.id) {
        return res.status(401).json({ notauthorised: 'User not authorised' });
      }

      // Delete
      post.remove().then(() => res.json({ success: true }));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ alreadyliked: 'User already liked this post' });
      }

      // Add user id to like array
      post.likes.push(req.user.id);

      post.save().then(savedPost => res.json(savedPost));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ notliked: 'User has not yet liked this post' });
      }

      // Get remove index
      const removeIndex = post.like.map(item => item.user.toString()).indexOf(req.user.id);

      // Splice out of array
      post.likes.splice(removeIndex, 1);

      // Save
      post.save().then(savedPost => res.json(savedPost));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      // Add to comments array
      post.comments.unshift(newComment);

      // Save
      post.save().then(savedPost => res.json(savedPost));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      // Check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item.id.toString())
        .indexOf(req.params.comment_id);

      // Splice comment out of array
      post.comments.splice(removeIndex, 1);

      post.save().then(savedPost => res.json(savedPost));
    })
    .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;
