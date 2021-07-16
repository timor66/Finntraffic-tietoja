import { LitElement, html } from 'lit-element';
import mapboxgl from 'mapbox-gl';

const MAB_BOX_TIMEOUT = 60000000;
const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGltb3I2NiIsImEiOiJja3F3ODczd3UwNTJ4MndueHBkdjB5c3dsIn0.68mu1Rk-3ZMPqlzBF_HknQ';

var mappi;

class MapBoxComponent extends LitElement {
  constructor() {
    super();
  }

  firstUpdated() {
    this.initMap();
  }

  createRenderRoot() {
    return this;
  }

  initMap() {
    let options = {
      enableHighAccuracy: true,
      timeout: MAB_BOX_TIMEOUT,
      maximumAge: 0
    };
    mappi = this.map;
    this.buildMap(); 
  }
   

  buildMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      mappi = new mapboxgl.Map({
          container: 'finntraffic-map',
          style: 'mapbox://styles/timor66/ckr32cq3pemln18qspaqpkqiq',
          center: [24.94, 60.16],
          zoom: 6,
      }).addControl(new mapboxgl.NavigationControl(), 'top-left'); 

      mappi.on('load', () => {
        // Add an image to use as a custom marker
          mappi.loadImage(
              'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
              function (error, image) {
                  if (error) throw error;
                  mappi.addImage('custom-marker', image);
                  // Add a GeoJSON source with 2 points
                  mappi.addSource('points', {
                      type: 'geojson',
                      data: 'https://tie.digitraffic.fi/api/v3/data/maintenance/trackings/latest'
                  });

                  // Add a symbol layer
                  mappi.addLayer({
                      'id': 'points',
                      'type': 'symbol',
                      'source': 'points',
                      'layout': {
                          'icon-image': 'custom-marker',
                          // get the title name from the source's "title" property
                          'text-field': ['get', 'tasks'],
                          'text-font': [
                             'Open Sans Semibold',
                              'Arial Unicode MS Bold'
                          ],
                          'text-offset': [0, 1.25],
                          'text-anchor': 'top'
                      }
                  });   
                  mappi.on('click', 'points', function (e) {
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var description = e.features[0].properties.tasks + "<br/>" + e.features[0].properties.time;
                     
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(mappi);
                    });
                     
                    // Change the cursor to a pointer when the mouse is over the places layer.
                    mappi.on('mouseenter', 'points', function () {
                        mappi.getCanvas().style.cursor = 'pointer';
                    });
                     
                    // Change it back to a pointer when it leaves.
                    mappi.on('mouseleave', 'points', function () {
                    mappi.getCanvas().style.cursor = '';
                    });                     
              });
        });
  }

  render() {
      return html`
          <div id="finntraffic-map"></div>
        `;
  }} 

//Component registration
customElements.define('mapbox-component', MapBoxComponent);
    