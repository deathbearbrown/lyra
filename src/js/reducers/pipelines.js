/* eslint new-cap:0 */
'use strict';

var Immutable = require('immutable');
var actions = require('../constants/actions');

function pipelineReducer(state, action) {
  if (typeof state === 'undefined') {
    return Immutable.Map({
      status: false
    });
  }

  if (action.type === actions.SET_PIPELINE) {
    return state.set('status', action.status);
  }

  return state;
}

module.exports = pipelineReducer;
