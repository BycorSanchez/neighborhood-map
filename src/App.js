import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import SideBar from './SideBar';

class App extends Component {
  state = {
    mobileOpen: false,
  };

  toggleSidebar = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { mobileOpen } = this.state;

    return (
      <div className="App">
        <Header onMenuClick={this.toggleSidebar} />
        <SideBar
          mobileOpen={mobileOpen}
          onSidebarClose={this.toggleSidebar}
        />
      </div>
    );
  }
}

export default App;
