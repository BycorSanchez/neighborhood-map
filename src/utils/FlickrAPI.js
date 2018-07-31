const API_KEY = "6d12be5a905a1b0b1f91005b7e63756d";
const BASE_URL = "https://api.flickr.com/services/rest/";

//Search for photos matching that query in Flickr
export const searchPhotos = (query) => {
    const request = searchURL(query);
    return fetch(request)
        .then(res => res.json())
        .then(data => data.photos.photo);
};

//Get info about a photo
export const photoInfo = (photo) => {
    const request = infoURL(photo);
    return fetch(request)
        .then(res => res.json())
        .then(data => data.photo);
};

export const photoURLs = (photos, size) => photos.map(p => photoURL(p, size));

//Get image URL from Flickr response
export const photoURL  = ({id, secret, server, farm}, size) => `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;


//Construct requests dinamycally
const searchURL = query => `${methodURL("flickr.photos.search")}&text=${query}&per_page=4&sort=relevance`;

const infoURL = ({id}) => `${methodURL("flickr.photos.getInfo")}&photo_id=${id}`;

const methodURL = method => `${BASE_URL}?method=${method}&api_key=${API_KEY}&format=json&nojsoncallback=1`;