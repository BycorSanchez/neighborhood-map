import React, { Component } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import escapeRegExp from 'escape-string-regexp';
import sortBy from "sort-by";
import * as locations from "./data/locations.json";
import * as MapsAPI from "./MapsAPI";

import "./App.css";

const MAX_ZOOM_LEVEL = 17;

class App extends Component {
  state = {
    map: "",
    markers: [],
    mobileOpen: false,
    currentMarker: undefined
  };

  componentDidMount() {
    this.loadMap();
  };
  
  //Show / Hide mobile sidebar
  toggleSidebar = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  // Load google maps using own key
  loadMap() {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBo3lCapdQsXacp3sci5KKyz2rbCJh3AR0&callback=initMap";
    script.onerror = this.mapLoadError;

    window.initMap = this.initMap;
    document.head.appendChild(script);
  };

  //Initialize map
  initMap = () => {
    //Set default location & zoom (New York)
    const map = MapsAPI.createMap(document.getElementById('map'), { lat: 40.7413549, lng: -73.99802439999996 });

    //On map click, hide all opened info window
    map.addListener("click", this.closeCurrentMarker);

    //Limit how close you the user can get
    map.addListener('zoom_changed', () => {
      if (map.getZoom() > MAX_ZOOM_LEVEL) map.setZoom(MAX_ZOOM_LEVEL);
    });

    //Create map markers from provided locations
    const markers = locations
       .sort(sortBy("name"))
       .map(location => this.locationToMarker(map, location));

    //Center map around markers
    this.centerMap(map, markers);

    this.setState({ map, markers });
  };

  mapLoadError = error => console.error("Failed to load Map", error);

  //Transform location info to map marker
  locationToMarker = (map, location) => {
    let marker = MapsAPI.createMarker(location);

    //Add it to map
    marker.setMap(map);

    //Display info window on click
    marker.addListener("click", () => this.markSelected(marker));

    return marker;
  };

  //Calculate map boundaries around visible markers
  centerMap = (map, markers) => {
  	const visibleMarkers = markers.filter(marker => marker.visible);
    if (visibleMarkers.length > 0) {
      let bounds = MapsAPI.createBounds(visibleMarkers);
      map.fitBounds(bounds);
    }
  };

  //Close current marker info window  & set default icon
  closeCurrentMarker = () => {
    const { currentMarker } = this.state;
    if (currentMarker){
      currentMarker.setIcon(MapsAPI.defaultIcon());
      currentMarker.infowindow.close();
      this.setState({ currentMarker: undefined });
    }
  };

  //Filter markers according to user query
  onFilter = query => {
    const { map, markers } = this.state;

    //Only show markers that match the query
    const match = new RegExp(escapeRegExp(query), 'i');
    markers.filter(marker => match.test(marker.title) ? (marker.setVisible(true)) : (marker.setVisible(false)));

    this.centerMap(map, markers);
    this.setState({ markers });
  };

  //When a marker is selected
  markSelected = marker => {
    const { map } = this.state;

    //Close previous marker
    this.closeCurrentMarker();

    //Open new info window & use highlight icon
    marker.infowindow.open(map, marker);
  	marker.setIcon(MapsAPI.highlightedIcon());

  	this.setState({ currentMarker: marker, mobileOpen: false });
  }

  render() {
    const { markers, currentMarker, mobileOpen } = this.state;

    //Display Header & Sidebar
    return (
      <div className="App">
        <Header onMenuClick={this.toggleSidebar} />
        <SideBar
          markers={markers}
          mobileOpen={mobileOpen}
          currentMarker={currentMarker}
          onSidebarClose={this.toggleSidebar}
          onFilter={this.onFilter}
          onMarkerSelect={this.markSelected}
        />
        <div id="map" />
      </div>
    );
  }
}

export default App;