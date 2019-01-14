import FadeScatterplotLayer from './layers/ScatterplotLayer';
import BrushArcLayer from './layers/ArcLayer/animate';
import AugmentHexagonLayer from './layers/HexagonLayer';

import React, { PureComponent } from 'react';
import ReactDOM from "react-dom";
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';

const MAPBOX_TOKEN = '';

const Layers = {
  BrushArcLayer,
  FadeScatterplotLayer,
  AugmentHexagonLayer,
}

const configs = {
  BrushArcLayer: {
    id: 'arc-brush',
    getSourcePosition: d => d.source,  
    getTargetPosition: d => d.target, 
    showBrushAnimation: true,
    speed: 0.005,
    url: './data/counties.json',
  },
  FadeScatterplotLayer: {
    id: 'scatterplot-fade',
    pickable: true,
    opacity: 0.8,
    radiusScale: 10,
    radiusMinPixels: 0,
    radiusMaxPixels: 200,
    getPosition: d => d.COORDINATES,
    getRadius: () => 14000,
    showWaveAnimation: true,
    url: './data/meteorites.json',
  },
  AugmentHexagonLayer: {
    id: '3d-heatmap',
    colorRange: [
      [34,93,202],
      [37,102,222],
      [56,115,225],
      [76,129,228],
      [96,143,231],
      [116,157,234],
    ],
    coverage: 1,
    elevationRange: [0, 3000],
    elevationScale: 50,
    extruded: true,
    getPosition: d => d.COORDINATES,
    getElevationValue: d => d.reduce((accumulator, currentValue) => currentValue ? accumulator + currentValue.SPACES : accumulator, 0),
    getColorValue: d => d.reduce((accumulator, currentValue) => currentValue ? accumulator + currentValue.SPACES : accumulator, 0),
    opacity: 1,
    pickable: true,
    radius: 10000,
    upperPercentile: 100,
    showAnimation: true,
    url: './data/meteorites.json',
  }
}

const INIT_LAYER = 'FadeScatterplotLayer';
const INIT_VIEW_STATE = {
  longitude: -104.96,
  latitude: 40.66033,
  zoom: 3,
  minZoom: 2,
  maxZoom: 16,
  pitch: 45,
  bearing: 0,
};

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
      fetch(url)
      .then(res => res.json())
      .then(res => {
        const slice = res.slice(0, 100);
        return slice.map((item) => {
          return {
            COORDINATES: [...item.coordinates],
            SPACES: parseInt(item.mass),
          }
        })
      })
      .then(res => resolve(res));
      break;
    default:
      break;
  }
  
})


class PaintMap extends PureComponent {
  constructor(props) {
    super(props);
    
    fetchData({
      type: INIT_LAYER,
      url: configs[INIT_LAYER].url
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
        ...configs[layer],
      }),
    ];
  }

  onSelectChangeHandler = ({target}) => {
    const layer = target.value;

    fetchData({
      type: layer,
      url: configs[layer].url,
    })
    .then((res) => {
      this.toggleRefresh({res, layer});
    })
    .catch(err => console.log(err));
  }

  render() {
    const {
      initialViewState = INIT_VIEW_STATE, 
      controller = true, 
      baseMap = true
    } = this.props;

    return (
      <section>
        <select 
          style={{
            position: 'absolute',
            bottom: '1px',
          }}
          onChange={this.onSelectChangeHandler}
          value={this.state.layer} >
          <option value="BrushArcLayer">BrushArcLayer</option>
          <option value="FadeScatterplotLayer">FadeScatterplotLayer</option>
          <option value="AugmentHexagonLayer">AugmentHexagonLayer</option>
        </select>

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
      </section>
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<PaintMap />, wrapper) : false;
