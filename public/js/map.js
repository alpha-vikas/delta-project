mapboxgl.accessToken =mapToken;

const parsedCoordinates = JSON.parse(coordinates);
    
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: parsedCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(parsedCoordinates) //Listing.geometry.coordinates we will send here
    .addTo(map); 