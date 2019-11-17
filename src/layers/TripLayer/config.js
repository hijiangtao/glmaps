import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { PhongMaterial } from '@luma.gl/core';

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
  TRIPS:
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips-v7.json', // eslint-disable-line
  LANDCOVER: 
    [[[-74.0, 40.7], [-74.02, 40.7], [-74.02, 40.72], [-74.0, 40.72]]],
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

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  groundColor: [0, 0, 0, 0],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material: new PhongMaterial({
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
  }),
  effects: [
    new LightingEffect({
      ambientLight, 
      pointLight
    }),
  ]
};

export {
  DEFAULT_THEME,
  DATA_URL,
}
