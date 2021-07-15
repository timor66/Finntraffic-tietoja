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
      style: 'mapbox://styles/mapbox/light-v10',
      center: [24.94, 60.16],
      zoom: 6
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
    