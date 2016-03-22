'use strict';
var dl = require('datalib'),
    inherits = require('inherits'),
    sg = require('../../signals'),
    Primitive = require('../Primitive'),
    Pipeline = require('../data/Pipeline'),
    Dataset = require('../data/Dataset'),
    manips = require('./manipulators'),
    rules = require('../../rules'),
    propSg = require('../../../util/prop-signal'),
    model = require('../../'),
    lookup = model.lookup,
    count = {group: -1},
    store = require('../../../store'),
    markProps = require('../../../actions/markProperties');

function _clean(spec, clean) {
  var k, p, c;
  var cln = clean !== false;
  for (k in spec) {
    p = spec[k];
    c = k.startsWith('_');
    c = c || p._disabled || p === undefined;
    if (c) {
      delete spec[k];
    } else if (dl.isObject(p)) {
      spec[k] = p.signal && cln ? sg.value(p.signal) : _clean(spec[k], clean);
    }
  }

  return spec;
}



/**
 * @classdesc A Lyra Mark Primitive.
 *
 * @description The Mark Primitive is an abstract base class. Each mark type
 * that Lyra supports should subclass it.
 * @extends {Primitive}
 *
 * @param {string} type - The mark type (e.g., `rect`, `symbol`, etc.).
 *
 * @property {Object} _rule - A {@link http://vega.github.io/vega-lite/docs/#spec|Vega-Lite specification}
 * that is compiled each time a data field is dropped over channel manipulators.
 * @see Vega's {@link https://github.com/vega/vega/wiki/Marks|Marks}
 * documentation for more information on this class' "public" properties.
 *
 * @constructor
 */
function Mark(type) {
  count[type] = count[type] || 0;
  this.name = type + '_' + (++count[type]);
  this.type = type;
  this.from = undefined;

  this.config = {
    update: {
      x: {value: 25},
      y: {value: 25},
      fill: {value: '#4682b4'},
      fillOpacity: {value: 1},
      stroke: {value: '#000000'},
      strokeWidth: {value: 0.25}
    }
  };

  this._rule = new rules.VLSingle(type);

  return Primitive.call(this);
}

inherits(Mark, Primitive);

/**
 * Initializes the Lyra Mark Primitive by converting all registered visual
 * properties with literal values to Lyra-specific signals. Each mark subclass
 * will register the necessary streams to change the signal values
 * (e.g., `initHandlers`).
 * @returns {Object} The Mark.
 */
Mark.prototype.init = function() {
  var props = this.config,
      update = props.update;

  //add signals for values unset
  for (var key in update) {
    var property = update[key];
    if (property.value !== undefined) {
      // create signal object
      var signal = sg.init(propSg(this, key), property.value);
      var disabledProps = property._disabled ? { _disabled: true } : {};
      // update property value to have signal key and
      // add disabled property if it doesn't exist.
      update[key] = dl.extend(signal, disabledProps);
    }
  }

  this.initHandles();

  // set properties in the store
  // remove propery object from primative
  this.setProps();

  var foo = this.getProps();
  console.log(JSON.stringify(foo));
  return this;
};


/*
  Set properties onto the store
*/

Mark.prototype.setProps = function(){
  // temporary set on the dumb this.properties field
  store.dispatch(markProps.addMark(this.name, this.config.update));
  this.properties = this.config;
};


/*
  get properties from the store
*/

Mark.prototype.getProps = function(){
  var state = store.getState(),
      props = state.get('markProperties').get(this.name);
  return props;
};

/*
  export properties from the store
*/

Mark.prototype.exportProps = function(){
  var props = this.getProps().toJS();
  //clean them
  return props;
};

/*
  update properties
 */
Mark.prototype.updateProps = function(props){
  store.dispatch(markProps.updateProps(this.name, props));
};

/*
  delete this
 */
Mark.prototype.deleteFromStore = function(){
  store.dispatch(markProps.removeMark(this.name));
};



/**
 * Get/set a mark's backing dataset.
 * @todo  Rename to `from`? A mark can be backed by another mark when connected.
 * @param  {number} [id] - The ID of a Dataset or Pipeline Primitive. If
 * Pipeline, then the source Dataset is used.
 * @returns {Object} If no ID is specified, the backing Dataset primitive if any.
 * If an ID is specified, the Mark is returned.
 */
Mark.prototype.dataset = function(id) {
  var from;
  if (!arguments.length) {
    from = lookup(this.from);
    return from && lookup(from.parent()._id);
  } else if ((from = lookup(id)) instanceof Dataset) {
    this.from = id;
    return this;
  } else if (from instanceof Pipeline) {
    // TODO
    this.from = from._source._id;
    return this;
  }

  this.from = undefined;
  return this;
};

/**
 * Initializes the interaction logic for the mark's handle manipulators. This
 * involves setting {@link https://github.com/vega/vega/wiki/Signals|the streams}
 * of the mark's property signals.
 * @returns {Object} The Mark.
 */
Mark.prototype.initHandles = function() {};

Mark.prototype.export = function(clean) {
  // // stick properties back onto the thing
  // this.properties = {
  //   update: this.exportProps()
  // };

  var spec = Primitive.prototype.export.call(this, clean),
      from = this.from && lookup(this.from),
      update = spec.properties.update,
      keys = dl.keys(update),
      k, v, i, len, s, f;

  if (from) {
    spec.from = (from instanceof Mark) ? {mark: from.name} :
      {data: from.name};
  }

  for (i = 0, len = keys.length; i < len; ++i) {
    v = update[k = keys[i]];
    if (!dl.isObject(v)) {  // signalRef resolved to literal
      update[k] = {value: v};
    }

    if (v.scale) {
      v.scale = (s = lookup(v.scale)) && s.name;
    }
    if (v.field) {
      v.field = (f = lookup(v.field)) && f._name;
    }
    if (v.group) {
      v.field = {group: v.group};
    }
  }

  if (!clean) {
    spec.lyra_id = this._id;
  }

  return spec;
};

manips(Mark.prototype);
rules(Mark.prototype);

module.exports = Mark;
