import React, { Component } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import escapeRegExp from 'escape-string-regexp';
import * as locations from "./data/locations.json";
import * as mapStyles from "./data/mapstyles.json";
import "./App.css";

const MAX_ZOOM_LEVEL = 17;

class App extends Component {
  state = {
    map: "",
    markers: [],
    mobileOpen: false,
  };

  componentDidMount() {
    this.loadMap();
  }

  //Show / Hide mobile sidebar
  toggleSidebar = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  // Load google maps using own key
  loadMap() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBo3lCapdQsXacp3sci5KKyz2rbCJh3AR0&callback=initMap";
    script.onerror = error => console.error("Failed to load Map", error);

    window.initMap = this.initMap;
    document.head.appendChild(script);
  };

  //Initialize map
  initMap = () => {
    //Set default location & zoom (New York)
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.7413549, lng: -73.99802439999996 },
      zoom: 13,
      styles: mapStyles
    });

    //On map click, hide all opened info window
    map.addListener("click", this.closeInfoWindows);

    //Limit how close you the user can get
    map.addListener('zoom_changed', () => {
      if (map.getZoom() > MAX_ZOOM_LEVEL) map.setZoom(MAX_ZOOM_LEVEL);
    });

    //Create map markers from provided locations
    const markers = locations.map(location => this.locationToMarker(map, location));

    //Center map around markers
    this.centerMap(map, markers);

    this.setState({ map, markers });
  };

  //Transform location info to map marker
  locationToMarker = (map, location) => {
    let marker = new window.google.maps.Marker({
      position: location.location,
      map: map,
      title: location.name,
      id: location.place_id,
      address: location.address,
      infowindow: this.infoWindow(location)
    });

    //Display info window on click
    marker.addListener("click", () => {
      this.closeInfoWindows();
      marker.infowindow.open(map, marker);
    });

    return marker;
  };

  //Calculate map boundaries around visible markers
  centerMap = (map, markers) => {
  	if (!markers) return;

  	const visibleMarkers = markers.filter(marker => marker.visible);
    if (visibleMarkers.length > 0) {
      let bounds = new window.google.maps.LatLngBounds();
 	  visibleMarkers.forEach(marker => bounds.extend(marker.position));
      map.fitBounds(bounds);
    }
  };

  //Create info window from location
  infoWindow = location => {
    return new window.google.maps.InfoWindow({
      content: `<div class="info-window">
        <h3>${location.name}</h3>
        <p>${location.address}</p>
      </div>`
    });
  };

  //Close all info windows
  closeInfoWindows = () => this.state.markers.forEach(m => m.infowindow.close());

  //Filter markers according to user query
  onFilter = query => {
    const { map, markers } = this.state;

    //Escape characters & ignore case
    const match = new RegExp(escapeRegExp(query), 'i');

    //Set only matching markers to visible
    markers.filter(marker =>
      match.test(marker.title) ? (marker.setVisible(true)) : (marker.setVisible(false))
    );

    this.centerMap(map, markers);
    this.setState({ markers });
  }

  render() {
    const { markers, mobileOpen } = this.state;

    //Display Header & Sidebar
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
