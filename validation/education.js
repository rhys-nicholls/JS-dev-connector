/* eslint-disable no-param-reassign */
const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInputs(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.school = !isEmpty(dataTemp.school) ? dataTemp.school : '';
  dataTemp.degree = !isEmpty(dataTemp.degree) ? dataTemp.degree : '';
  dataTemp.fieldofstudy = !isEmpty(dataTemp.fieldofstudy) ? dataTemp.fieldofstudy : '';
  dataTemp.from = !isEmpty(dataTemp.from) ? dataTemp.from : '';

  if (Validator.isEmpty(dataTemp.school)) {
    errors.school = 'School field is required';
  }

  if (Validator.isEmpty(dataTemp.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(dataTemp.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required';
  }

  if (Validator.isEmpty(dataTemp.from)) {
    errors.from = 'From  date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
