/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInputs(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.title = !isEmpty(dataTemp.title) ? dataTemp.title : '';
  dataTemp.company = !isEmpty(dataTemp.company) ? dataTemp.company : '';
  dataTemp.from = !isEmpty(dataTemp.from) ? dataTemp.from : '';

  if (Validator.isEmpty(dataTemp.title)) {
    errors.title = 'Job title field is required';
  }

  if (Validator.isEmpty(dataTemp.company)) {
    errors.company = 'Company field is required';
  }

  if (Validator.isEmpty(dataTemp.from)) {
    errors.from = 'From  date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
