import React from 'react';
import Visualization from './visualization.jsx';

class App extends React.Component {
  constructor() {
    super();

    // Set initial state variables
    this.state = {containerWidth: 1170};

    // Bind this to methods
  }

  componentDidMount() {
    // Get width of container and set as state variable
    var containerWidth = document.getElementById('my-container').clientWidth;
    this.setState({containerWidth});
  }

  render() {
    return (
      <div className="container" id="my-container">
        <h1>Header</h1>
        <Visualization width={this.state.containerWidth} />
      </div>
    );
  }
}

export default App;
