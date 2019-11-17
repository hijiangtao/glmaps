/*
 * @Author: hijiangtao (hijiangtao@gmail.com) 
 * @Date: 2019-01-24 19:25:14 
 * @Desc: Icon Layer with cluster option
 * @Last Modified time: 2019-01-24 19:25:14 
 */


import {CompositeLayer} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';

import IconClusterLayer from './cluster';
import { iconMapping as DEFAULT_ICONMAPPING } from './icon-mapping';

class CompositeIconLayer extends CompositeLayer {
  renderLayers() {
    const {
      data = {},
      configs = {},
      accessors = {},
    } = this.props;
    console.log(this.props);

    // const configs = {
    //   showCluster: true,
    //   iconAtlas: 'https://raw.githubusercontent.com/uber/deck.gl/17b1b9a5c7acd4503f85b81a68560b241a0f319e/examples/website/icon/data/location-icon-atlas.png',
    //   iconMapping: DEFAULT_ICONMAPPING,
    //   pickable: true,
    //   sizeUnits: 'meters',
    //   sizeScale: 2000,
    //   sizeMinPixels: 6,
    //   wrapLongitude: true,
    //   // positionKeyName: 'coordinates',
    // }
    // const data = { 
    //   points: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json',
    // };
    // const accessors = {
    //   getPosition: d => d.coordinates,
    //   getIcon: () => 'marker',
    // };

    const { 
      points,
    } = data;

    const {
      iconMapping,
      iconAtlas,
      showCluster,
      viewState,
      wrapLongitude,
      pickable,
      // positionKeyName,
      sizeUnits,
      sizeScale,
      sizeMinPixels,
      ...otherConfigs
    } = configs;

    const {
      getPosition,
      getIcon,
      ...otherAccessors
    } = accessors;

    const layerProps = {
      ...otherConfigs,
      ...otherAccessors,
      data: points,
      pickable,
      wrapLongitude,
      getPosition,
      iconAtlas,
      iconMapping,
    };

    // debugger
    const layer = showCluster
      ? new IconClusterLayer({
        ...layerProps, 
        id: `${this.id}-icon-cluster`,
        sizeScale: 60,
      })
      : new IconLayer({
          ...layerProps,
          id: `${this.id}-icon`,
          getIcon,
          sizeUnits,
          sizeScale,
          sizeMinPixels
        });

    return [layer];
  }
}

CompositeIconLayer.layerName = 'CompositeIconLayer';
CompositeIconLayer.defaultProps = {
  configs: {
    type: 'object', 
    value: {
      showCluster: true,
      iconAtlas: 'https://raw.githubusercontent.com/uber/deck.gl/17b1b9a5c7acd4503f85b81a68560b241a0f319e/examples/website/icon/data/location-icon-atlas.png',
      iconMapping: DEFAULT_ICONMAPPING,
      pickable: true,
      sizeUnits: 'meters',
      sizeScale: 2000,
      sizeMinPixels: 6,
      wrapLongitude: true,
      // positionKeyName: 'coordinates',
    },
  },
  data: {
    type: 'object', 
    value: { 
      points: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json',
    },
  },
  accessors: {
    type: 'object', 
    value: {
      getPosition: d => d.coordinates,
      getIcon: () => 'marker',
    },
  },
};
  
export default CompositeIconLayer;
