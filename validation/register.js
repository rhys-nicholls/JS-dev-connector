/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInputs(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.name = !isEmpty(dataTemp.name) ? dataTemp.name : '';
  dataTemp.email = !isEmpty(dataTemp.email) ? dataTemp.email : '';
  dataTemp.password = !isEmpty(dataTemp.password) ? dataTemp.password : '';
  dataTemp.password2 = !isEmpty(dataTemp.password2) ? dataTemp.password2 : '';

  if (Validator.isEmpty(dataTemp.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isLength(dataTemp.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(dataTemp.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(dataTemp.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(dataTemp.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.isLength(dataTemp.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  if (Validator.isEmpty(dataTemp.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(dataTemp.password, dataTemp.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
