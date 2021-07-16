import { LitElement, html } from 'lit-element';
import mapboxgl from 'mapbox-gl';

const MAB_BOX_TIMEOUT = 60000000;
const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGltb3I2NiIsImEiOiJja3F3ODczd3UwNTJ4MndueHBkdjB5c3dsIn0.68mu1Rk-3ZMPqlzBF_HknQ';

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
    this.buildMap(); 
  }
   

  buildMap() {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      this.map = new mapboxgl.Map({
          container: 'finntraffic-map',
          style: 'mapbox://styles/timor66/ckr32cq3pemln18qspaqpkqiq',
          center: [24.94, 60.16],
          zoom: 6,
      }).addControl(new mapboxgl.NavigationControl(), 'top-left'); 

      this.map.on('load', () => {
        // Add an image to use as a custom marker
          this.map.loadImage(
              'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
              function (error, image) {
                  if (error) throw error;
                  this.map.addImage('custom-marker', image);
                  // Add a GeoJSON source with 2 points
                  this.map.addSource('points', {
                      type: 'geojson',
                      data: 'https://tie.digitraffic.fi/api/v3/data/maintenance/trackings/latest'
                  });

                  // Add a symbol layer
                  this.map.addLayer({
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
              });
        });
  }

  render() {
      return html`
          <div id="finntraffic-map"></div>
        `;
  }
} 

//Component registration
customElements.define('mapbox-component', MapBoxComponent);
    