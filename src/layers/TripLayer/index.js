/*
 * @Author: hijiangtao (hijiangtao@gmail.com)
 * @Date: 2019-01-14 20:30:03 
 * @Desc: Trip Layer 
 * @Last Modified time: 2019-01-14 20:30:03 
 */

import { TripsLayer } from '@deck.gl/geo-layers';
import { PolygonLayer } from '@deck.gl/layers';
import { CompositeLayer } from 'deck.gl';
import { DEFAULT_THEME, DATA_URL, } from './config';

class TripLayer extends CompositeLayer {
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
      data = {},
      configs = {},
      accessors = {},
    } = this.props;

    const { 
      buildings = DATA_URL.BUILDINGS,
      trips = DATA_URL.TRIPS,  
      landCover = DATA_URL.LANDCOVER,
     } = data;
     
     const {
      tripTrailLength = 180,
      groundStroked = false,
      theme = DEFAULT_THEME,
      tripOpacity = 0.3,
      tripWidthMinPixels = 2,
      tripRounded = true,
      tripShadowEnabled = false,
      buildingExtruded = true,
      buildingWireFrame = false,
      buildingOpacity = 0.5,
     } = configs;

     const {
      getBuildingPolygon = f => f.polygon,
      getBuildingElevation = f => f.height,
      getGroundPolygon = f => f,
      getTripPath = d => d.path,
      getTripTimestamps = d => d.timestamps
     } = accessors;

    return [
      new PolygonLayer({
        id: 'ground', 
        data: landCover,
        getPolygon: getGroundPolygon,
        stroked: groundStroked,
        getFillColor: theme.groundColor,
      }),
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: getTripPath,
        getTimestamps: getTripTimestamps,
        getColor: d => (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1),
        opacity: tripOpacity,
        widthMinPixels: tripWidthMinPixels,
        rounded: tripRounded,
        trailLength: tripTrailLength,
        currentTime: this.state.time,
        shadowEnabled: tripShadowEnabled
      }),
      new PolygonLayer({
        id: 'buildings',
        data: buildings,
        extruded: buildingExtruded,
        wireframe: buildingWireFrame,
        opacity: buildingOpacity,
        getPolygon: getBuildingPolygon,
        getElevation: getBuildingElevation,
        getFillColor: theme.buildingColor,
        material: theme.material
      })
    ];
  }
}

TripLayer.layerName = 'TripLayer';
export default TripLayer;
