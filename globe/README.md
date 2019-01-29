# Globe (based on three.js)

## Usage

```javascript
import React from 'react';
import {Globe} from 'glmaps';

const Demo = (props) => {
  return (
    <Globe
      data={props.data}
    />
  )
};
```

## Properties

### `data` (Array, required)

Should be a JavaScript array, default to `[]`. Each element should contain longitude and latitude of both source point and target point.

```javascript
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
```