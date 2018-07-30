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
    currentMarker: undefined
  };

  static defaultMarkIcon = 'data:image/svg+xml;charset=utf-8,<svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><g transform="translate(0 -1028.4)"><path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z" fill="#352fed" transform="translate(0 1028.4)"/><path d="m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z" fill="#0200af" transform="translate(0 1028.4)"/></g></svg>';
  static highlightedMarkIcon = 'data:image/svg+xml;charset=utf-8,<svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><g transform="translate(0 -1028.4)"><path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z" fill="#e74c3c" transform="translate(0 1028.4)"/><path d="m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z" fill="#c0392b" transform="translate(0 1028.4)"/></g></svg>';

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
    map.addListener("click", this.closeCurrentMarker);

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
      infowindow: this.infoWindow(location),
      icon: {
  	      scaledSize: new window.google.maps.Size(34, 34),
          url: App.defaultMarkIcon
  	  }
    });

    //Display info window on click
    marker.addListener("click", () => this.markSelected(map, marker));

    return marker;
  };

  //Calculate map boundaries around visible markers
  centerMap = (map, markers) => {
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

  //Close current marker info window  & set default icon
  closeCurrentMarker = () => {
    const { currentMarker } = this.state;
    if (currentMarker){
      currentMarker.setIcon({
          scaledSize: new window.google.maps.Size(34, 34),
          url: App.defaultMarkIcon
      });
      currentMarker.infowindow.close();
    }
  };

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
  };

  //When a marker is selected
  markSelected = (map, marker) => {
    //Close previous marker
    this.closeCurrentMarker();

    //Open new info window & use highlight icon
    marker.infowindow.open(map, marker);
  	marker.setIcon({
  	  scaledSize: new window.google.maps.Size(34, 34),
      url: App.highlightedMarkIcon
  	});
  	this.setState({ currentMarker: marker });
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