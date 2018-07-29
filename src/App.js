import React, { Component } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import escapeRegExp from 'escape-string-regexp';
import * as locations from "./data/locations.json";
import "./App.css";

class App extends Component {
  state = {
    map: "",
    markers: [],
    mobileOpen: false,
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
    script.onerror = error => console.error("Failed to load Map", error);

    window.initMap = this.initMap;
    document.head.appendChild(script);
  };

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.7413549, lng: -73.99802439999996 },
      zoom: 13
    });
    const markers = locations.map(location => this.locationToMarker(map, location));
    this.centerMap(map, markers);

    this.setState({ map, markers });
  };

  locationToMarker = (map, location) => {
    return new window.google.maps.Marker({
      position: location.location,
      map: map,
      title: location.name,
      id: location.place_id,
      address: location.address
    })
  };

  centerMap = (map, markers) => {
    if (markers && markers.length > 0) {
      let bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.position));
      map.fitBounds(bounds);
    }
  };

  onFilter = query => {
    const { markers } = this.state;
    const match = new RegExp(escapeRegExp(query), 'i');
    markers.filter(marker =>
      match.test(marker.title)? (marker.setVisible(true)): (marker.setVisible(false))
    );
    this.setState({ query, markers });
  }

  render() {
    const { markers, mobileOpen } = this.state;

    return (
      <div className="App">
        <Header onMenuClick={this.toggleSidebar} />
        <SideBar
          markers={markers}
          mobileOpen={mobileOpen}
          onSidebarClose={this.toggleSidebar}
          onFilter={this.onFilter}
        />
        <div id="map" />
      </div>
    );
  }
}

export default App;
