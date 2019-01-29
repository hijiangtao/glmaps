import FadeScatterplotLayer from './layers/ScatterplotLayer';
import BrushArcLayer from './layers/ArcLayer/animate';
import AugmentHexagonLayer from './layers/HexagonLayer';
import ScreenGridLayer from './layers/ScreenGridLayer';
import IconLayer from './layers/IconLayer';
import TripLayer from './layers/TripLayer';
import Globe from './globe/index';

import React, { PureComponent } from 'react';
import ReactDOM from "react-dom";
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';

import {LAYER_CONFIGS, INIT_LAYER} from './examples/configs';
import {addMapControl} from './examples/tools';
import { MAPBOX_TOKEN } from './devconfigs';

const Layers = {
  BrushArcLayer,
  FadeScatterplotLayer,
  AugmentHexagonLayer,
  ScreenGridLayer,
  IconLayer,
  Globe,
  TripLayer, // Issue#2569 need to be solved
}

/**
 * Get Demo Data according to Layer type and Data url
 * @param {*} param0 
 */
const fetchData = ({type = 'BrushArcLayer', url = './data/counties.json'}) => new Promise((resolve, reject) => {
  switch (type) {
    case 'BrushArcLayer':
    case 'IconLayer':
      fetch(url)
      .then(res => res.json())
      .then(res => resolve(res))
      .catch(err => reject(err));
      break;
    
    case 'FadeScatterplotLayer':
    case 'AugmentHexagonLayer':
    case 'ScreenGridLayer':
      fetch(url)
      .then(res => res.json())
      .then(res => {
        const slice = res.slice(0);
        return slice.map((item) => {
          return {
            COORDINATES: [...item.coordinates],
            SPACES: parseInt(item.mass),
          }
        })
      })
      .then(res => resolve(res));
      break;
    case 'Globe':
      fetch(url)
      .then(res => res.json())
      .then(res => {
        const routes = res.routes.slice(0, 8000);
        const {airports} = res;
        return routes.map(route => {
          const startAirport = airports[route[1]];
          const endAirport = airports[route[2]];
          const startLat = startAirport[4];
          const startLng = startAirport[3];
          const endLat = endAirport[4];
          const endLng = endAirport[3];
          return [ startLat, startLng, endLat, endLng ];
        });
      })
      .then(res => resolve(res));
      break;
    case 'TripLayer':
    default:
      resolve({});
      break;
  }
  
})


class PaintMap extends PureComponent {
  constructor(props) {
    super(props);
    this.data = [];
    
    fetchData({
      type: INIT_LAYER,
      url: LAYER_CONFIGS[INIT_LAYER].url
    })
    .then((res) => {
      this.toggleRefresh({res, layer: INIT_LAYER});
    })
    .catch(err => console.log(err));
  }

  state = {
    layer: INIT_LAYER,
    refresh: false,
  }

  componentDidMount() {
    this.mapElement.addEventListener('contextmenu', evt => evt.preventDefault());
    this.mapElement.addEventListener('mousewheel', evt => evt.preventDefault());
  }

  componentWillUnmount() {
    this.mapElement.removeEventListener('contextmenu', evt => evt.preventDefault());
    this.mapElement.removeEventListener('mousewheel', evt => evt.preventDefault());
  }

  toggleRefresh = ({res = [], layer}) => {
    this.data = res;

    this.setState((prevState) => {
      return {
        ...prevState,
        refresh: !prevState.refresh,
        layer,
      }
    });
  }

  _renderLayers = () => {
    // if (!this.data) return [];

    const {layer} = this.state;
    const Layer = Layers[layer];

    return [
      new Layer({
        data: this.data,
        ...LAYER_CONFIGS[layer],
      }),
    ];
  }

  onSelectChangeHandler = ({target}) => {
    const layer = target.value;

    fetchData({
      type: layer,
      url: LAYER_CONFIGS[layer].url,
    })
    .then((res) => {
      this.toggleRefresh({res, layer});
    })
    .catch(err => console.log(err));
  }

  /**
   * Change map control
   * @param {*} event 
   */
  addControlHandler = (event) => {
    const map = event && event.target;
    if (map) {
      addMapControl(map);
    }
  };

  render() {
    const {
      controller = true, 
      baseMap = true,
    } = this.props;

    const {layer} = this.state;
    const initialViewState = LAYER_CONFIGS[layer].INIT_VIEW_STATE;

    return (
      <section>
        <h3>glmaps demo</h3>
        <span>Select display layer (default to TripLayer): </span>
        <select 
          onChange={this.onSelectChangeHandler}
          value={this.state.layer} >
          <option value="IconLayer">IconLayer</option>
          <option value="BrushArcLayer">BrushArcLayer</option>
          <option value="FadeScatterplotLayer">FadeScatterplotLayer</option>
          <option value="AugmentHexagonLayer">AugmentHexagonLayer</option>
          <option value="ScreenGridLayer">ScreenGridLayer</option>
          <option value="Globe">Globe</option>
          <option value="TripLayer">TripLayer</option>
        </select>

        <div ref={e => {this.mapElement = e;}} style={{
          position: 'relative',
          marginTop: '2px',
          width: '100%',
          height: '80vh',
        }}>
          {this.state.layer === 'Globe' ? (
            <Globe data={this.data} />
          ) : (
            <DeckGL
              width="100%" 
              height="90%" 
              layers={this._renderLayers()}
              initialViewState={initialViewState}
              controller={controller}
            >
              {baseMap && (
                <StaticMap
                  onLoad={this.addControlHandler}
                  ref={e => this.staticMap = e}
                  reuseMaps
                  mapStyle="mapbox://styles/mapbox/dark-v9"
                  preventStyleDiffing
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                />
              )}
            </DeckGL>
          )}
        </div>
        <a href="https://github.com/hijiangtao/glmaps">GitHub</a>
        <footer>npm install glmaps --save</footer>
      </section>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<PaintMap />, wrapper) : false;
