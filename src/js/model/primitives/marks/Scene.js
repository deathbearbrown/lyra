'use strict';
var inherits = require('inherits'),
    sg = require('../../signals'),
    Group = require('./Group');

var SG_WIDTH = 'vis_width', SG_HEIGHT = 'vis_height';

/**
 * @classdesc A Lyra Scene Primitive.
 * @description  This class corresponds to the root of a Vega specification.
 * @extends {Mark}
 *
 * @see  Vega's {@link https://github.com/vega/vega/wiki/Visualization|top-level
 * Visualization} documentation for more information on this class' "public"
 * properties.
 *
 * @constructor
 */
function Scene() {
  Group.call(this);
  this.width = 610;
  this.height = 610;
  this.padding = 'auto';
  this.background = 'white';

  return this;
}


inherits(Scene, Group);
Scene.prototype.parent = null;

Scene.prototype.init = function() {
  sg.init(SG_WIDTH, this.width);
  sg.init(SG_HEIGHT, this.height);
  // Update internal properties to point at signal values
  this.width = sg.reference(SG_WIDTH);
  this.height = sg.reference(SG_HEIGHT);
  return Group.prototype.init.call(this);
};

Scene.prototype.export = function(resolve) {
  var spec = Group.prototype.export.call(this, resolve);

  // Always resolve width/height signals.
  spec.width = spec.width.signal ? sg.get(SG_WIDTH) : spec.width;
  spec.height = spec.height.signal ? sg.get(SG_HEIGHT) : spec.height;

  // Remove mark-specific properties
  delete spec.type;
  delete spec.from;
  delete spec.properties;

  return spec;
};

Scene.prototype.manipulators = function() {
  return Group.prototype.manipulators.call(this)[0];
};

module.exports = Scene;