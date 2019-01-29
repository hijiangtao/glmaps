# glmaps
Earths and maps powered by Three.js and Deck.gl, easy to use

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c913db53b5a3470f840f5329ea2f54d4)](https://www.codacy.com/app/hijiangtao/glmaps?utm_source=github.com&utm_medium=referral&utm_content=hijiangtao/glmaps&utm_campaign=badger)
[![npm](https://img.shields.io/npm/v/glmaps.svg)]()
[![Github All Releases](https://img.shields.io/github/downloads/hijiangtao/glmaps/total.svg)]()
[![npm](https://img.shields.io/npm/dt/glmaps.svg)]()
[![GitHub contributors](https://img.shields.io/github/contributors/hijiangtao/glmaps.svg)]() 
[![GitHub issues](https://img.shields.io/github/issues/hijiangtao/glmaps.svg)]() 
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]() 
[![license](https://img.shields.io/github/license/hijiangtao/glmaps.svg)]() 

[![NPM](https://nodei.co/npm/glmaps.png)](https://nodei.co/npm/glmaps/)

## Install

```
npm install glmaps --save
```

## Usage

```javascript
import {Globe} from 'glmaps';

/**
 * Data format:
 * [
 *   [
 *      source.lat,
 *      source.lng,
 *      target.lat,
 *      target.lng,
 *   ],
 *   ...
 * ]
 */
const Demo = (props) => {
  return (
    <Globe
      data={props.data}
    />
  )
};
```

More examples and detailed usage guidances can be found in documents.

## Document

* [Layers (on Maps)](./layers/README.md)
  1. ArcLayer
  2. HexagonLayer
  3. IconLayer
  4. ScatterplotLayer
  5. ScreenGridLayer
  6. TripLayer
* [Globe](./globe/README.md)

## Development 

```
git clone git@github.com:hijiangtao/glmaps.git
cd glmaps
npm install
npm run start
```

## Contact

@hijiangtao

## LICENSE

MIT