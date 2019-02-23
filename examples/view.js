import {
  ScatterplotLayer as FadeScatterplotLayer,
  ScreenGridLayer,
  IconLayer,
  HexagonLayer as AugmentHexagonLayer,
  ArcLayer as BrushArcLayer,
  Globe,
  TripLayer,
} from '../index';

import React, { memo, useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
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

const GLOBE_SHAPES = [{
  name: 'Curves',
  value: 'curve',
}, {
  name: 'Points',
  value: 'point',
}, {
  name: 'CubeMap',
  value: 'cube',
}]

const preventDefault = evt => evt.preventDefault();

const useInit = () => {
  const [layer, setLayer] = useState(INIT_LAYER);
  const [moon, setMoon] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [viewState, setViewState] = useState(LAYER_CONFIGS[INIT_LAYER].INIT_VIEW_STATE);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [globeShape, setGlobeShape] = useState('curve');

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
      // dataRef.current = res;
      setRefresh(!refresh);
    })
    .catch(err => console.log(err));

    // menu
    const optionData = {
      rootID: 'menu',
      initData: {
        layer: INIT_LAYER,
        animation: true,
        moon: true,
        shape: 'curve'
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
          configs: animation,
          convertType: 'none',
          stateType: 'bool',
        }, {
          property: 'moon',
          name: 'Moon',
          setter: setMoon,
          configs: moon,
          convertType: 'none',
          stateType: 'bool',
        }, {
          property: 'shape',
          name: 'Type',
          setter: setGlobeShape,
          configs: GLOBE_SHAPES,
          convertType: 'json',
          stateType: 'string',
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

        console.log('Data updated')
        setData(result);
        // dataRef.current = result;
        setViewState({
          ...LAYER_CONFIGS[newLayer].INIT_VIEW_STATE,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 5000
        });
        setRefresh(!refresh);
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
    // console.log('useLayoutEffect again')
    fetchUpdateDataset(layer);
    // console.log('after fetchUpdateDataset lifecycle', data);

    return () => {
      // console.log('clean again')
      setData([]);
    };
  }, [layer]);

  const addControlHandler = (event) => {
    const map = event && event.target;
    if (map) {
      addMapControl(map);
    }
  };

  return [layer, data, globeShape, viewState, refresh, handleViewStateChange, mapEl, addControlHandler];
}

const PaintMap = (props) => {
  const {
    controller = true, 
    baseMap = true,
  } = props;
  const [layer, data, visType, viewState, refresh, handleViewStateChange, mapEl, addControlHandler] = useInit();

  const Layer = Layers[layer];

  const deckRootEl = useMemo(() => {
    return layer === 'Globe' ? (
      <Globe 
        moon={true}
        visType={visType}
        data={data} />
    ) : (
      <DeckGL
        // width="100%" 
        // height="100%" 
        layers={[
          new Layer({
            data,
            ...LAYER_CONFIGS[layer],
          }),
        ]}
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
    )
  }, [viewState, refresh, visType])

  return (
    <section>
        {/* TitleBar */}
        <div className="title-container">
          <h3>glmaps demo</h3>
          <p>Read codes in <a href="https://github.com/hijiangtao/glmaps">GitHub</a></p>
          <p>
            cd YOUR_FOLDER<br/>
            npm install glmaps --save<br/>
            import * as glmaps from 'glmaps'<br/>
            const {'{Globe}'} = glmaps
          </p>
        </div>
        
        <div ref={mapEl} style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
        }}>
          {/* New Menu */}
          <div id="menu" />

          {/* Map or Globe layer */}
          {deckRootEl}
        </div>
      </section>
  )
}

export default memo(PaintMap);