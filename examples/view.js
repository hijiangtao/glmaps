import {
  ScatterplotLayer as FadeScatterplotLayer,
  ScreenGridLayer,
  IconLayer,
  HexagonLayer as AugmentHexagonLayer,
  ArcLayer as BrushArcLayer,
  Globe,
  TripLayer,
} from '../index';

import React, { memo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {FlyToInterpolator} from 'deck.gl';

import {LAYER_CONFIGS, INIT_LAYER} from './configs';
import {addMapControl} from './tools';
import { MAPBOX_TOKEN } from '../devconfigs';

import { fetchData } from './fetch';
import optionMenu from './menu';

import './view.scss';

const Layers = {
  BrushArcLayer,
  FadeScatterplotLayer,
  AugmentHexagonLayer,
  ScreenGridLayer,
  IconLayer,
  Globe,
  TripLayer,
}

const LAYER_TYPES = [{
  name: 'IconLayer',
  value: 'IconLayer',
}, {
  name: 'BrushArcLayer',
  value: 'BrushArcLayer',
}, {
  name: 'FadeScatterplotLayer',
  value: 'FadeScatterplotLayer',
}, {
  name: 'AugmentHexagonLayer',
  value: 'AugmentHexagonLayer',
}, {
  name: 'ScreenGridLayer',
  value: 'ScreenGridLayer',
}, {
  name: 'Globe',
  value: 'Globe',
}, {
  name: 'TripLayer',
  value: 'TripLayer',
}];

const PARAMS_TYPES = [{
  name: 'Animation',
  value: true,
}, {
  name: 'Moon',
  value: true,
}];

const preventDefault = evt => evt.preventDefault();

const useInit = () => {
  const [layer, setLayer] = useState(INIT_LAYER);
  const [moon, setMoon] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [viewState, setViewState] = useState(LAYER_CONFIGS[INIT_LAYER].INIT_VIEW_STATE);
  const [data, setData] = useState([]);

  const mapEl = useRef();

  /**
   * App Initialization
   */
  useEffect(() => {
    // event listener
    mapEl.current.addEventListener('contextmenu', preventDefault);
    mapEl.current.addEventListener('mousewheel', preventDefault);

    // fetch data
    fetchData({
      type: layer,
      url: LAYER_CONFIGS[layer].url
    })
    .then((res) => {
      setData(res);
    })
    .catch(err => console.log(err));

    // menu
    const optionData = {
      rootID: 'menu',
      initData: {
        layer: INIT_LAYER,
        animation: true,
        moon: true,
      },
      configMap: [{
        title: 'Options',
        content: [{
          property: 'layer',
          name: 'Type',
          setter: setLayer,
          configs: LAYER_TYPES,
          convertType: 'json',
          stateType: 'string',
        }],
      }, {
        title: 'Parameters',
        content: [{
          property: 'animation',
          name: 'Animation',
          setter: setAnimation,
          configs: true,
          convertType: 'none',
          stateType: 'bool',
        }, {
          property: 'moon',
          name: 'Moon',
          setter: setMoon,
          configs: true,
          convertType: 'none',
          stateType: 'bool',
        }],
      }],
    };

    optionMenu(optionData);

    return () => {
      // remove event listener
      mapEl.current.removeEventListener('contextmenu', preventDefault);
      mapEl.current.removeEventListener('mousewheel', preventDefault);
    }
  }, []);

  const fetchUpdateDataset = async (newLayer) => {
    try {
       const result = await fetchData({
          type: newLayer,
          url: LAYER_CONFIGS[newLayer].url,
        });

        setData(result);
        setViewState({
          ...LAYER_CONFIGS[newLayer].INIT_VIEW_STATE,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 5000
        });
    } catch (e) {
      console.error(e);
    }
  }

  const handleViewStateChange = ({viewState}) => setViewState(viewState);

  /**
   * Menu selection handler
   */
  useLayoutEffect(() => {
    // fetch data
    fetchUpdateDataset(layer);

    return () => {
      setData([]);
    };
  }, [layer]);

  const addControlHandler = (event) => {
    const map = event && event.target;
    if (map) {
      addMapControl(map);
    }
  };

  return [layer, data, viewState, handleViewStateChange, mapEl, addControlHandler];
}

const PaintMap = (props) => {
  const {
    controller = true, 
    baseMap = true,
  } = props;
  const [layer, data, viewState, handleViewStateChange, mapEl, addControlHandler] = useInit();

  const Layer = Layers[layer];
  const renderLayers = () => [
    new Layer({
      data,
      ...LAYER_CONFIGS[layer],
    }),
  ];
  
  return (
    <section>
        {/* TitleBar */}
        <h3>glmaps demo</h3>
        
        <div ref={mapEl} style={{
          position: 'relative',
          marginTop: '2px',
          width: '100%',
          height: '80vh',
        }}>
          {/* TODO: New Menu */}
          <div id="menu" />

          {/* Map or Globe layer */}
          {layer === 'Globe' ? (
            <Globe data={data} />
          ) : (
            <DeckGL
              width="100%" 
              height="90%" 
              layers={renderLayers()}
              viewState={viewState}
              onViewStateChange={handleViewStateChange}
              controller={controller}
            >
              {baseMap && (
                <StaticMap
                  onLoad={addControlHandler}
                  // reuseMaps
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
  )
}


// class PaintMap extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.data = [];
    
//     fetchData({
//       type: INIT_LAYER,
//       url: LAYER_CONFIGS[INIT_LAYER].url
//     })
//     .then((res) => {
//       this.toggleRefresh({res, layer: INIT_LAYER});
//     })
//     .catch(err => console.log(err));
//   }

//   state = {
//     layer: INIT_LAYER,
//     refresh: false,
//     viewState: LAYER_CONFIGS[INIT_LAYER].INIT_VIEW_STATE,
//   }

//   componentDidMount() {
//     this.mapElement.addEventListener('contextmenu', evt => evt.preventDefault());
//     this.mapElement.addEventListener('mousewheel', evt => evt.preventDefault());
//   }

//   componentWillUnmount() {
//     this.mapElement.removeEventListener('contextmenu', evt => evt.preventDefault());
//     this.mapElement.removeEventListener('mousewheel', evt => evt.preventDefault());
//   }

//   toggleRefresh = ({res = [], ...otherProps}) => {
//     this.data = res;

//     this.setState((prevState) => {
//       return {
//         ...prevState,
//         refresh: !prevState.refresh,
//         ...otherProps
//       }
//     });
//   }

//   _renderLayers = () => {
//     const {layer} = this.state;
//     const Layer = Layers[layer];

//     return [
//       new Layer({
//         data: this.data,
//         ...LAYER_CONFIGS[layer],
//       }),
//     ];
//   }

//   _onViewStateChange = ({viewState}) => {
//     this.setState({viewState});
//   }

//   /**
//    * Menu selection handler
//    */
//   onSelectChangeHandler = ({target}) => {
//     const layer = target.value;

//     fetchData({
//       type: layer,
//       url: LAYER_CONFIGS[layer].url,
//     })
//     .then((res) => {
//       // this.deckglIns && this.deckglIns.setProps({
//       //   viewState: LAYER_CONFIGS[layer].INIT_VIEW_STATE
//       // })
//       this.toggleRefresh({
//         res, 
//         layer,
//         viewState: {
//           ...LAYER_CONFIGS[layer].INIT_VIEW_STATE,
//           transitionInterpolator: new FlyToInterpolator(),
//           transitionDuration: 5000
//         }
//       });
//     })
//     .catch(err => console.log(err));
//   }

//   /**
//    * Change map control
//    * @param {*} event 
//    */
//   addControlHandler = (event) => {
//     const map = event && event.target;
//     if (map) {
//       addMapControl(map);
//     }
//   };

//   render() {
//     const {
//       controller = true, 
//       baseMap = true,
//     } = this.props;

//     const {layer} = this.state;
//     const {viewState} = this.state;
//     const compProps = LAYER_CONFIGS[layer].PROPS;
//     // const initialViewState = LAYER_CONFIGS[layer].INIT_VIEW_STATE;

//     return (
//       <section>
//         <h3>glmaps demo</h3>
//         <span>Select display layer (default to TripLayer): </span>

//         {/* Menu */}
//         <select 
//           onChange={this.onSelectChangeHandler}
//           value={this.state.layer} >
//           <option value="IconLayer">IconLayer</option>
//           <option value="BrushArcLayer">BrushArcLayer</option>
//           <option value="FadeScatterplotLayer">FadeScatterplotLayer</option>
//           <option value="AugmentHexagonLayer">AugmentHexagonLayer</option>
//           <option value="ScreenGridLayer">ScreenGridLayer</option>
//           <option value="Globe">Globe</option>
//           <option value="TripLayer">TripLayer</option>
//         </select>

        
//         <div ref={e => {this.mapElement = e;}} style={{
//           position: 'relative',
//           marginTop: '2px',
//           width: '100%',
//           height: '80vh',
//         }}>
//           {/* TODO: New Menu */}

//           {/* Map or Globe layer */}
//           {this.state.layer === 'Globe' ? (
//             <Globe data={this.data} />
//           ) : (
//             <DeckGL
//               ref={e => this.deckglIns = e}
//               width="100%" 
//               height="90%" 
//               layers={this._renderLayers()}
//               // initialViewState={initialViewState}
//               viewState={viewState}
//               onViewStateChange={this._onViewStateChange}
//               controller={controller}
//             >
//               {baseMap && (
//                 <StaticMap
//                   onLoad={this.addControlHandler}
//                   ref={e => this.staticMap = e}
//                   // reuseMaps
//                   mapStyle="mapbox://styles/mapbox/dark-v9"
//                   preventStyleDiffing
//                   mapboxApiAccessToken={MAPBOX_TOKEN}
//                 />
//               )}
//             </DeckGL>
//           )}
//         </div>
//         <a href="https://github.com/hijiangtao/glmaps">GitHub</a>
//         <footer>npm install glmaps --save</footer>
//       </section>
//     );
//   }
// }

export default memo(PaintMap);