import React, { Component } from 'react';
import ForceCollapsable from './components/ForceCollapsable'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      label: 'blank'
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange = (text) => {
    this.setState({ label: text })
  }
  render() {
    return (

      <div>
        <ForceCollapsable onChange={this.onChange} />
        <div>{this.state.label}</div>

      </div>
    );
  }
}

export default App;
