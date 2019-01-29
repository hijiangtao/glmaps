# glmaps
Earths and maps powered by Three.js and Deck.gl, easy to use

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