'use strict';

/**
 * Add a mark to the store
 *
 * @param {number[]} properties - an object of properties for the mark
 * @returns {Object} Redux action
 */
module.exports.addMark = function(name, properties) {
  return {
    type: 'ADD_MARK',
    name: name,
    props: properties
  };
};

module.exports.removeMark = function(name) {
  return {
    type: 'REMOVE_MARK',
    name: name
  };
};

module.exports.updateProps = function(name, props) {
  return {
    type: 'UPDATE_MARK',
    name: name,
    props: properties
  };
};

