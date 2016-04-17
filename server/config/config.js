'use strict';

exports.NODE_ENV = process.env.NODE_ENV || 'development';

// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
  console.log(exports);
}