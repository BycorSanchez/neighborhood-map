import * as mapStyles from "../data/mapstyles.json";
import { MarkerIcon, MarkerHighlightIcon } from "./Icons";

export const defaultIcon = () => ({
  scaledSize: new window.google.maps.Size(34, 34),
  url: `data:image/svg+xml;charset=utf-8,${MarkerIcon}`
});

export const highlightedIcon = () => ({
  scaledSize: new window.google.maps.Size(34, 34),
  url: `data:image/svg+xml;charset=utf-8,${MarkerHighlightIcon}`
});

export const createMap = (node, location) => {
  return new window.google.maps.Map(node, {
    center: location,
    zoom: 13,
    styles: mapStyles
  });
};

export const createMarker = location => {
  return new window.google.maps.Marker({
    position: location.location,
    title: location.name,
    id: location.place_id,
    address: location.address,
    icon: defaultIcon()
  });
};

export const createInfoWindow = content => new window.google.maps.InfoWindow({ content });

export const createBounds = markers => {
  let bounds = new window.google.maps.LatLngBounds();
  markers.forEach(marker => bounds.extend(marker.position));
  return bounds;
}