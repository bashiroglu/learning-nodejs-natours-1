/* eslint-disable */
console.log('mapbox');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
mapboxgl.accessToken =
  'pk.eyJ1IjoiYWJkdWxsYWJhc2hpcjMyIiwiYSI6ImNrNGc4eDFxeTBycnIzbG42enRhdjJwdTUifQ.cpJWK3QbxzEaxdwT_SpshQ';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/abdullabashir32/ck4g9518p1b2c1co29v8jayxk',
  scrollZoom: false
  //   center: [-118.113491, 34.111745],
  //   zoom: 5,
  //   interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
