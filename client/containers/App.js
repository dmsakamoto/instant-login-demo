
import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      'text': 'Hello World!'
    };
  }

  render() {
    return (
      <div>
        {this.state.text}
      </div>
    );
  }
}

export default App;
