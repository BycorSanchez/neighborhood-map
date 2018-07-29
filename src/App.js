import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import SideBar from "./SideBar";
import Map from "./Map";

class App extends Component {
  state = {
    mobileOpen: false,
    map: ''
  };

  componentDidMount() {
    this.loadMap();
  }

  toggleSidebar = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  loadMap() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBo3lCapdQsXacp3sci5KKyz2rbCJh3AR0&callback=initMap";
    script.onerror = error => console.error("Faile to load Map", error);

    window.initMap = this.initMap;
    document.head.appendChild(script);
  };

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.7413549, lng: -73.99802439999996 },
      zoom: 14
    });

    this.setState({ map });
  }

  render() {
    const { mobileOpen } = this.state;

    return (
      <div className="App">
        <Header onMenuClick={this.toggleSidebar} />
        <SideBar
          mobileOpen={mobileOpen}
          onSidebarClose={this.toggleSidebar}
        />
        <Map />
      </div>
    );
  }
}

export default App;
