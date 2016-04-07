'use strict';
var React = require('react');

// Walkthrough Garbage
var datasets = require('../../walkthrough/data'),
    walkUtils = require('../../utils/walkthrough-utils');

// Splitting each sidebar into its column
var WalkthroughMenu = React.createClass({
  classNames: 'hints',

  render: function() {
    var walkthroughs = datasets;
    return (
      <div className={this.classNames}>
        <ul>
        {walkthroughs.map(function(wk, i) {
          return (
            <li key={i}>
              {wk.title}
            </li>
          );
        }, this)}
        </ul>
        {thumbnail}

        <i className="close-hint fa fa-times"></i>
      </div>
    );
  }
});

module.exports = WalkthroughMenu;
