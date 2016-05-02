'use strict';
var React = require('react'),
    connect = require('react-redux').connect,
    getIn = require('../util/immutable-utils').getIn,
    ReactTooltip = require('react-tooltip'),
    InspectorSidebar = require('./InspectorSidebar'),
    VisualSidebar = require('./VisualSidebar'),
    PipelinesSidebar = require('./PipelinesSidebar'),
    Toolbar = require('./Toolbar'),
    WalkthroughStep = require('./walkthrough/Step'),
    Footer = require('./Footer'),
    model = require('../model');

// Use mapDispatchToProps to force sidebar to update when the user makes any
// change which would cause a re-render: this is clumsy but avoids forceUpdate
function mapStateToProps(reduxState) {
  var show = getIn(reduxState, 'walkthrough.activeWalkthrough');
  return {
    // Vega "validity" is a good proxy for "has something been added or removed
    // that we need to re-render globally to account for"
    arbitraryPropToTriggerUpdate: getIn(reduxState, 'vega.invalid'),
    showWalkthrough: show,
    pipelines: getIn(reduxState, 'pipelines.status')
  };
}

var Sidebars = React.createClass({
  propTypes: {
    arbitraryPropToTriggerUpdate: React.PropTypes.bool,
    showWalkthrough: React.PropTypes.string,
    pipelines: React.PropTypes.bool
  },
  render: function() {
    var pipelines = this.props.pipelines ? model.pipeline() : [];
    var showWalkthrough = this.props.showWalkthrough ? <WalkthroughStep/> : '';
    return (
      <div>
        <div className="sidebar-container">
          <VisualSidebar />
          <InspectorSidebar ref="inspector"
            pipelines={pipelines} />
          <PipelinesSidebar />
        </div>
        <Toolbar/>
        {showWalkthrough}
        <Footer/>
        <ReactTooltip effect="solid"/>
      </div>
    );
  }
});

module.exports = connect(mapStateToProps)(Sidebars);
