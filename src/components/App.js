import "../css/App.css";
import * as MapsAPI from "../utils/MapsAPI";
import * as FlickrAPI from "../utils/FlickrAPI";
import * as locations from "../data/locations.json";
import React, { Component } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import Gallery from "./Gallery";
import escapeRegExp from 'escape-string-regexp';
import sortBy from "sort-by";

const MAX_ZOOM_LEVEL = 17;
const DEFAULT_LOCATION = { lat: 40.7413549, lng: -73.99802439999996 };

class App extends Component {
  state = {
    map: "",
    markers: [],
    mobileOpen: false,
    currentMarker: undefined,
    galleryStatus: "hidden",
    galleryData: []
  };

  componentDidMount() {
    this.loadMap();
  };

  //Show / Hide mobile sidebar
  toggleSidebar = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  // Load Google Maps
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
    //Set default location
    const map = MapsAPI.createMap(document.getElementById('map'), DEFAULT_LOCATION);

    //Hide opened info windows
    map.addListener("click", this.closeCurrentMarker);

    //Limit how close you the user can get
    map.addListener('zoom_changed', () => {
      if (map.getZoom() > MAX_ZOOM_LEVEL) map.setZoom(MAX_ZOOM_LEVEL);
    });

    //Create location map markers
    const markers = locations
      .sort(sortBy("name"))
      .map(location => this.locationToMarker(map, location));

    //Center map
    this.centerMap(map, markers);

    this.setState({ map, markers });
  };


  //Transform location to map marker
  locationToMarker = (map, location) => {
    let marker = MapsAPI.createMarker(location);

    //Add market to map
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
    if (currentMarker) {
      currentMarker.setIcon(MapsAPI.defaultIcon());
      currentMarker.infowindow.close();
      this.setState({ currentMarker: undefined });
    }
  };

  //Show markers that match user query
  onFilter = query => {
    const { map, markers } = this.state;

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

    //Open info window & highlight icon
    marker.infowindow.open(map, marker);
    marker.setIcon(MapsAPI.highlightedIcon());

    this.setState({ currentMarker: marker, mobileOpen: false });
    this.loadGallery();
  }

  loadGallery() {
    this.setState({ galleryStatus: "loading" });
    this.loadPhotos();
  };

  //Close photo gallery
  closeGallery = () => this.setState({ galleryStatus: "hidden", galleryData: [] });


  //Load photos from Flickr & use them in gallery component
  loadPhotos() {
    const { currentMarker } = this.state;
    if (!currentMarker) return;

    //Obtain photos from query
    FlickrAPI.searchPhotos(currentMarker.title)
      .then(photoDataList => {

        const promises = photoDataList.map(d => FlickrAPI.photoInfo(d));

        //Obtain information of each photo (author, title, etc)
        Promise.all(promises).then(infoList => {
          const galleryData = infoList.map((info, i) => ({
            url: FlickrAPI.photoURL(photoDataList[i], "m"),  //Translate photo data into a URL
            title: (info && info.title) ? info.title._content : "", //Get photo title if declared
            author: (info && info.owner) ? info.owner.username : "" //Get photo author if declared
          }));

          //Update gallery state to show images & their info
          this.setState({ galleryStatus: "loaded", galleryData: galleryData });
        });
      })
      .catch(error => {
        console.log("Images search failed", error);
        this.setState({ galleryStatus: "error" });
      });
  };


  render() {
    const { markers, currentMarker, mobileOpen, galleryStatus, galleryData } = this.state;

    //Display Header, Sidebar, Map & Gallery (when necessary)
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
        <Gallery
          status={galleryStatus}
          handleClose={this.closeGallery}
          photos={galleryData}
        />
      </div>
    );
  }
}

export default App;