/* eslint new-cap:0 */
'use strict';

var Immutable = require('immutable');

// Create immutable state
module.exports = Immutable.Map({
  marks: Immutable.Map(),
  scales: Immutable.Map(),
  scene: Immutable.Map(),
  signals: Immutable.Map(require('../model/signals/defaults').signals)
});
