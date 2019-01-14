/**
 * TODO: Abstract layer from App
 */
import React, { PureComponent } from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {IconLayer} from 'deck.gl';

import IconClusterLayer from './cluster';
const MAPBOX_TOKEN = '';
// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -35,
  latitude: 36.7,
  zoom: 1.8,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const stopPropagation = evt => evt.stopPropagation();

class IconMap extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      hoveredItems: null,
      expanded: false,
    };
  }

  _onHover = (info) => {
    if (this.state.expanded) {
      return;
    }

    const {x, y, object} = info;
    const {z} = info.layer.state;
    const {showCluster = true} = this.props;

    let hoveredItems = null;

    if (object) {
      if (showCluster) {
        hoveredItems = object.zoomLevels[z].points;
        // hoveredItems = object.zoomLevels[z].points.sort((m1, m2) => m1.year - m2.year);
      } else {
        hoveredItems = [object];
      }
    }

    this.setState({x, y, hoveredItems, expanded: false});
  }

  _onClick = () => {
    this.setState({expanded: true});
  }

  _onPopupLoad = (ref) => {
    if (ref) {
      // React events are triggered after native events
      ref.addEventListener('wheel', stopPropagation);
    }
  }

  _closePopup = () => {
    this.setState({expanded: false, hoveredItems: null});
  }

  _renderhoveredItems = () => {
    const {x, y, hoveredItems, expanded} = this.state;
    const {custom} = this.props;

    if (!hoveredItems) {
      return null;
    }

    if (expanded) {
      return custom ? (
        <div
          className="tooltip interactive"
          ref={this._onPopupLoad}
          style={{left: x, top: y}}
          onMouseLeave={this._closePopup}
        >
          {hoveredItems.map(({SPACES, PROPS}) => {
            return (
              <div key={`name-${PROPS.id}`}>
                <h5>PROP</h5>
                <div>SPACES: {SPACES}</div>
                <div>{JSON.stringify(PROPS)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="tooltip interactive"
          ref={this._onPopupLoad}
          style={{left: x, top: y}}
          onMouseLeave={this._closePopup}
        >
          {hoveredItems.map(({name, year, mass, class: meteorClass}) => {
            return (
              <div key={name}>
                <h5>{name}</h5>
                <div>Year: {year || 'unknown'}</div>
                <div>Class: {meteorClass}</div>
                <div>Mass: {mass}g</div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="tooltip" style={{left: x, top: y}}>
        {hoveredItems.slice(0, 20).map(({name, year}) => (
          <div key={name}>
            <h5>
              {name} {year ? `(${year})` : ''}
            </h5>
          </div>
        ))}
      </div>
    );
  }

  // TODO 所有交互都是未完成
  _renderLayers = () => {
    const {
      data,
      iconMapping = 'https://raw.githubusercontent.com/uber/deck.gl/17b1b9a5c7acd4503f85b81a68560b241a0f319e/examples/website/icon/data/location-icon-mapping.json',
      iconAtlas = 'https://raw.githubusercontent.com/uber/deck.gl/17b1b9a5c7acd4503f85b81a68560b241a0f319e/examples/website/icon/data/location-icon-atlas.png',
      showCluster = true,
      viewState,
      custom,
    } = this.props;

    const layerProps = {
      data: custom ? data: DATA_URL,
      pickable: true,
      wrapLongitude: true,
      getPosition: d => custom ? d.COORDINATES : d.coordinates,
      positionKeyName: custom ? 'COORDINATES':'coordinates',
      iconAtlas,
      iconMapping,
      onHover: this._onHover,
      // onClick: this._onClick,
      sizeScale: 60,
    };

    const size = viewState ? Math.min(1.5**(viewState.zoom - 10), 1) : 0.1;

    const layer = showCluster
      ? new IconClusterLayer({...layerProps, id: 'icon-cluster'})
      : new IconLayer({
          ...layerProps,
          id: 'icon-layer',
          getIcon: () => 'marker',
          getSize: size,
        });

    return [layer];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;

    return (
      <DeckGL
        width="100%" 
        height="100%" 
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
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

        {this._renderhoveredItems}
      </DeckGL>
    );
  }
}
  
export default IconMap;