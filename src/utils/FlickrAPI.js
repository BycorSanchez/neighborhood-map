const API_KEY = "6d12be5a905a1b0b1f91005b7e63756d";
const BASE_URL = `http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1`;

export const searchPhotos = (query, size) => {
    const requestURL = `${BASE_URL}&text=${query}&per_page=4`;
    return fetch(requestURL)
        .then(res => res.json())
        .then(data => data.photos.photo.map(p => photoURL(p, size)));
};

const photoURL  = ({id, secret, server, farm}, size) => `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
