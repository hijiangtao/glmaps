/*
 * @Author: hijiangtao (hijiangtao@gmail.com)
 * @Date: 2019-01-14 20:30:03 
 * @Desc: Trip Layer 
 * @Last Modified time: 2019-01-14 20:30:03 
 */

import {TripsLayer} from '@deck.gl/geo-layers';
import {PolygonLayer} from '@deck.gl/layers';
import { CompositeLayer } from 'deck.gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {PhongMaterial} from '@luma.gl/core';

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  TRIPS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips-v7.json' // eslint-disable-line
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = new PhongMaterial({
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
});

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

const landCover = [[[-74.0, 40.7], [-74.02, 40.7], [-74.02, 40.72], [-74.0, 40.72]]];

export default class TripMap extends CompositeLayer {
  initializeState() {
    this.state = {
      time: 0,
      raf: null,
    };
  }

  shouldUpdateState({changeFlags}) {
    if (changeFlags.propsChanged || changeFlags.dataChanged || changeFlags.stateChanged) {
      return true;
    }

    return false;
  }

  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});

    const _animate = () => {
      const {
        loopLength = 1800, // unit corresponds to the timestamp in source data
        animationSpeed = 30, // unit time per second
      } = props;
      const timestamp = Date.now() / 1000;
      const loopTime = loopLength / animationSpeed;
  
      this.setState({
        time: ((timestamp % loopTime) / loopTime) * loopLength,
        raf: window.requestAnimationFrame(_animate),
      });
    }

    if (changeFlags.propsChanged) {
      const {raf} = this.state;
      raf && cancelAnimationFrame(raf);

      _animate();
    }
  }

  renderLayers() {
    const { 
      buildings = DATA_URL.BUILDINGS,
      trips = DATA_URL.TRIPS,
      trailLength = 180,
      theme = DEFAULT_THEME
     } = this.props;

    return [
      new PolygonLayer({
        id: 'ground', 
        data: landCover, // TODO
        getPolygon: f => f,
        stroked: false,
        getFillColor: [0, 0, 0, 0]
      }),
      new TripsLayer({
        id: 'trips',
        data: trips, // TODO
        getPath: d => d.path,
        getTimestamps: d => d.timestamps,
        getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
        opacity: 0.3,
        widthMinPixels: 2,
        rounded: true,
        trailLength,
        currentTime: this.state.time, // TODO

        shadowEnabled: false
      }),
      new PolygonLayer({
        id: 'buildings',
        data: buildings, // TODO
        extruded: true,
        wireframe: false,
        opacity: 0.5,
        getPolygon: f => f.polygon,
        getElevation: f => f.height,
        getFillColor: theme.buildingColor, // TODO
        material: theme.material // TODO
      })
    ];
  }
}