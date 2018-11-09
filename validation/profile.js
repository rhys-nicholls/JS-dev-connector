const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  const errors = {};
  const dataTemp = data;

  dataTemp.handle = !isEmpty(dataTemp.handle) ? dataTemp.handle : '';
  dataTemp.status = !isEmpty(dataTemp.status) ? dataTemp.status : '';
  dataTemp.skills = !isEmpty(dataTemp.skills) ? dataTemp.skills : '';

  if (!Validator.isLength(dataTemp.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 4 characters';
  }

  if (Validator.isEmpty(dataTemp.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (Validator.isEmpty(dataTemp.status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(dataTemp.skills)) {
    errors.skills = 'Skills field is required';
  }

  if (!isEmpty(dataTemp.website)) {
    if (!Validator.isURL(dataTemp.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  if (!isEmpty(dataTemp.youtube)) {
    if (!Validator.isURL(dataTemp.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!isEmpty(dataTemp.twitter)) {
    if (!Validator.isURL(dataTemp.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if (!isEmpty(dataTemp.facebook)) {
    if (!Validator.isURL(dataTemp.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!isEmpty(dataTemp.linkedin)) {
    if (!Validator.isURL(dataTemp.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if (!isEmpty(dataTemp.instagram)) {
    if (!Validator.isURL(dataTemp.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
