import React from 'react';

// Components
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      userInputs: []
    }
  }

  render() {
    return (
      <div>
        <Header userInputs={this.userInputs}/>
        <Footer />
      </div>
    )
  }
} 

export default App;
