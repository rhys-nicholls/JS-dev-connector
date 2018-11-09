/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInputs(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.email = !isEmpty(dataTemp.email) ? dataTemp.email : '';
  dataTemp.password = !isEmpty(dataTemp.password) ? dataTemp.password : '';

  if (!Validator.isEmail(dataTemp.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(dataTemp.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(dataTemp.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
