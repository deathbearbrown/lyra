'use strict';
var SET_PIPELINE = require('../constants/actions').SET_PIPELINE;

module.exports = function(boolean) {
  return {
    type: SET_PIPELINE,
    status: boolean
  };
};
