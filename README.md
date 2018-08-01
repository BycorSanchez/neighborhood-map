# Neighborhood map project

This is the eighth required project on the [Udacity Front End Nanodegree](https://eu.udacity.com/course/front-end-web-developer-nanodegree--nd001).

## What is it

*Neighborhood map* is a responsive web application that shows interesting **locations** in New York. These locations are displayed in an interactive map, as well as in a list (sidebar).

There is a search input (sidebar top) where the user can **filter** the list of locations. While filtering, not matching locations disappear from the list and the map. The map will automatically zoom in or zoom out to show all visible locations.

By clicking an item from the list or a marker the application will highlight it to indicate which one was selected. It will also set the center of the map to that location and display a small **info window**. 

The marker's info window contains a button. On click, the application displays a **gallery of photos** (modal) related to the current location.

## React components

This project has four main React.js components:

* *Header*: app header.
* *Sidebar*: list of locations and filter.
* *Gallery*: display location photos.
* *App*: contains **Google Map**. It handles map & list interactions and fetch photos using [Flickr API](https://www.flickr.com/services/api/).

The following scheme shows how components are structured:

```bash
<App/>
├── <Header/>
├── <Sidebar/>
└── <Gallery/>
```

## How to run

1. Download [⬇](https://github.com/BycorSanchez/neighborhood-map/archive/master.zip) or clone this repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.
4. Visit `http://localhost:3000`.

## Technologies used

* [React.js](https://reactjs.org/)
* [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)
* [Flickr API](https://www.flickr.com/services/api/)
* [Material-UI](https://material-ui.com/)
* [prop-types](https://github.com/facebook/prop-types)
* [sort-by](https://github.com/kvnneff/sort-by)
* [escape-string-regexp](https://github.com/sindresorhus/escape-string-regexp)

## Notes

This application follows [Google's Material Design](https://material.io/) system by using [Material-UI](https://material-ui.com/) components.

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code.

## Attributions

Marker and image icons made by [Paomedia](https://www.iconfinder.com/paomedia). https://www.iconfinder.com/iconsets/small-n-flat

Map style made by bruno perrier. https://snazzymaps.com/style/6666/green-and-blue

----
![Neighborhood map preview](img/app.gif)