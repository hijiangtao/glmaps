/*
 * @Author: 黯晓 (anxiao.jt@alibaba-inc.com) 
 * @Date: 2019-01-23 16:51:30 
 * @Desc: 
 * @Last Modified by: 黯晓 (anxiao.jt@alibaba-inc.com)
 * @Last Modified time: 2019-01-23 16:55:28
 */

import MapboxLanguage from '@mapbox/mapbox-gl-language';

/**
 * 图层添加中文支持
 * @param {*} map 
 */
const addMapControl = (map) => {
  map.addControl(new MapboxLanguage({
    defaultLanguage: 'zh',
  }));
  map.setLayoutProperty('country-label-lg', 'text-field', ['get', 'name_zh']);
}

export {
  addMapControl,
}