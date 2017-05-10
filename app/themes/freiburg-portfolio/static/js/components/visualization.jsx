import React from 'react';

class Visualization extends React.Component {
  constructor(props) {
    super(props);

    // Set state
    this.state = {height: 2000};
  }

  /**
   * Render the component
   */
  render() {
    // Init variables
    var margin = {top: 50, right: 10, bottom: 10, left: 10};

    // Transformation of g element that holds the visualization
    var transformG = 'translate(' + margin.left + ',' + margin.top + ')';

    return (
        <svg width={this.props.width} height={this.state.height}>

           <g width={this.props.width - margin.right - margin.left}
              height={this.state.height - margin.top - margin.bottom}
                transform={transformG}>
                <circle cx="50" cy="50" r="20" stroke="black" fill="red" />
            </g>


        </svg>
    );
  }
}

export default Visualization;
