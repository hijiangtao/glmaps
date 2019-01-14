import FadeScatterplotLayer from './layers/ScatterplotLayer';
import BrushArcLayer from './layers/ArcLayer/animate';
import AugmentHexagonLayer from './layers/HexagonLayer';
import ScreenGridLayer from './layers/ScreenGridLayer';
// import TripLayer from './layers/TripLayer';

import React, { PureComponent } from 'react';
import ReactDOM from "react-dom";
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';

import {LAYER_CONFIGS, INIT_LAYER} from './examples/configs';

const MAPBOX_TOKEN = '';

const Layers = {
  BrushArcLayer,
  FadeScatterplotLayer,
  AugmentHexagonLayer,
  ScreenGridLayer,
  // TripLayer, // Issue#2569 need to be solved
}

/**
 * Get Demo Data according to Layer type and Data url
 * @param {*} param0 
 */
const fetchData = ({type = 'BrushArcLayer', url = './data/counties.json'}) => new Promise((resolve, reject) => {
  switch (type) {
    case 'BrushArcLayer':
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
    case 'TripLayer':
    default:
      resolve({});
      break;
  }
  
})


class PaintMap extends PureComponent {
  constructor(props) {
    super(props);
    
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

  toggleRefresh = ({res, layer}) => {
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
    if (!this.data) return [];

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

  render() {
    const {
      controller = true, 
      baseMap = true,
    } = this.props;

    const {layer} = this.state;
    const initialViewState = LAYER_CONFIGS[layer].INIT_VIEW_STATE;

    return (
      <section>
        <select 
          onChange={this.onSelectChangeHandler}
          value={this.state.layer} >
          <option value="BrushArcLayer">BrushArcLayer</option>
          <option value="FadeScatterplotLayer">FadeScatterplotLayer</option>
          <option value="AugmentHexagonLayer">AugmentHexagonLayer</option>
          <option value="ScreenGridLayer">ScreenGridLayer</option>
          {/* <option value="TripLayer">TripLayer</option> */}
          
        </select>

        <div style={{
          position: 'relative',
          marginTop: '2px',
          width: '100%',
          height: '34vw',
        }}>
          <DeckGL
            width="100%" 
            height="90%" 
            layers={this._renderLayers()}
            initialViewState={initialViewState}
            controller={controller}
          >
            {baseMap && (
              <StaticMap
                reuseMaps
                mapStyle="mapbox://styles/mapbox/dark-v9"
                preventStyleDiffing
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            )}
          </DeckGL>
        </div>
      </section>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<PaintMap />, wrapper) : false;
