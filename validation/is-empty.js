/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
const isEmpty = value =>
  value === undefined
  || value === null
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
