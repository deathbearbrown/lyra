/* eslint new-cap:0 */
'use strict';

var Immutable = require('immutable');

function markPropertiesReducer(state, action) {
  if (typeof state === 'undefined') {
    return Immutable.Map();
  }
  if (action.type === 'ADD_MARK') {
    // properties = action.props
    // name = action.name
    return state.merge({
      [action.name]: action.props
    });
  }
  if (action.type === 'REMOVE_MARK') {
    // name = action.name
    return state.delete(action.name);
  }
  if (action.type === 'UPDATE_MARK') {
    // properties = action.props
    // name = action.name
    return state.update(action.name, action.props);
  }
  return state;
}

module.exports = markPropertiesReducer;
