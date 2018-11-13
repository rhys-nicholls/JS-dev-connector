/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInputs(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.text = !isEmpty(dataTemp.text) ? dataTemp.text : '';

  if (!Validator.isLength(dataTemp.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(dataTemp.text)) {
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
