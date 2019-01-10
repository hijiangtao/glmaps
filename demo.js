import "babel-register";
import FadeScatterplotLayer from './layers/ScatterplotLayer';

import React, { PureComponent } from 'react';
import ReactDOM from "react-dom";
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';


const fetchData = (callback) => new Promise((resolve, reject) => {
  fetch('./data/meteorites.json').then((response) => {
    return response.json();
  }, () => {
    return [];
  }).then((res) => {
    return res.map((item) => {
      // console.log(item);
      // debugger
      return {
        COORDINATES: [...item.coordinates],
        SPACES: parseInt(item.mass),
      }
    })
  }).then(callback);
})


class FadeScatterplotMap extends PureComponent {
  constructor(props) {
    super(props);
    fetchData(this.toggleRefresh);
  }

  state = {
    refresh: false
  }
  
  toggleRefresh = (data) => {
    console.log(data)
    this.data = data;
    this.setState((prevState) => {
      return {
        ...prevState,
        refresh: !prevState.refresh,
      }
    });
  }

  _renderLayers = () => {
    if (!this.data) return [];

    return [
      new FadeScatterplotLayer({
        id: 'scatterplot-fade',
        data: this.data,
        // pickable: true,
        opacity: 0.8,
        radiusScale: 10,
        radiusMinPixels: 0,
        radiusMaxPixels: 200,
        getPosition: d => d.COORDINATES,
        getRadius: () => 14000,
      }),
    ];
  }

  render() {
    const {
      initialViewState = {
        longitude: 28.96,
        latitude: 13.66033,
        zoom: 3,
        minZoom: 2,
        maxZoom: 16,
        pitch: 0,
        bearing: 0,
      }, 
      controller = true, 
      baseMap = true
    } = this.props;

    return (
      <DeckGL
        width="100%" 
        height="100%" 
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
    );
  }
}

const wrapper = document.getElementById("root");
wrapper ? ReactDOM.render(<FadeScatterplotMap />, wrapper) : false;
