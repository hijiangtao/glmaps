/*
 * @Author: hijiangtao (hijiangtao@gmail.com) 
 * @Date: 2019-01-24 19:25:14 
 * @Desc: Icon Layer with cluster option
 * @Last Modified time: 2019-01-24 19:25:14 
 */


import {IconLayer, CompositeLayer} from 'deck.gl';

import IconClusterLayer from './cluster';
import { iconMapping as DEFAULT_ICONMAPPING } from './icon-mapping';

class IconMap extends CompositeLayer {
  renderLayers() {
    const {
      data,
      iconMapping,
      iconAtlas,
      showCluster,
      viewState,
      ...otherProps
    } = this.props;

    const layerProps = {
      ...otherProps,
      data,
      getPosition: d => d.coordinates,
      positionKeyName: 'coordinates',
      iconAtlas,
      iconMapping,
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
}

IconMap.layerName = 'MixedIconMap';
IconMap.defaultProps = {
  ...IconLayer.defaultProps,
  showCluster: true,
  iconAtlas: 'https://raw.githubusercontent.com/uber/deck.gl/17b1b9a5c7acd4503f85b81a68560b241a0f319e/examples/website/icon/data/location-icon-atlas.png',
  iconMapping: DEFAULT_ICONMAPPING,
  pickable: true,
  wrapLongitude: true,
  sizeScale: 60,
};
  
export default IconMap;