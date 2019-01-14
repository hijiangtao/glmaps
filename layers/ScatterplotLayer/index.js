/*
 * @Author: hijiangtao (hijiangtao@gmail.com) 
 * @Date: 2019-01-11 15:00:17 
 * @Description: A Layer based on ScatterplotLayer, which enable point fade-out animation on Scatterplot.
 * @Color schema: [255,0,0] to [255,140,0]
 * @Last Modified time: 2019-01-11 15:00:38
 */

import {ScatterplotLayer, CompositeLayer} from 'deck.gl';
// import AnimationLayer from '../AnimationLayer';

const MAX_RADIUSSCALE = 8; // Default Max Display radiusScale
const OVERFLOW_FLAG = 9999; // Animation End Flag

// class FadeScatterplotLayer extends AnimationLayer {
//   initializeState() {
//     // super.initializeState();

//     this.state = {
//       maxSpaces: 1,
//     }
//   }

//   shouldUpdateState(props) {
//     super.shouldUpdateState(props);
//   }

//   updateState({props, oldProps, changeFlags}) {
//     super.updateState({props, oldProps, changeFlags});

//     /**
//      * Animaiton trigger judgement
//      */
//     if (props.data && props.data.length) {
//       let maxSpaces = 1;
//       props.data.map((d) => {
//         if (d.SPACES > maxSpaces) {
//           maxSpaces = d.SPACES;
//         }
//       });
//       this.setState({maxSpaces});

//       if (!props.showWaveAnimation) return ;
//     }
//   }

//   renderLayers() {
//     let {updateTriggers = {}, showWaveAnimation, data, ...otherProps} = this.props;
//     const {radiusScale, MAX_RADIUSSCALE} = this.state;
//     const {maxSpaces} = this.state;

//     console.log('Scatterplot Layer State', this.state);

//     if (showWaveAnimation) {
//       otherProps.radiusScale = radiusScale;
//     }
    
//     if (radiusScale === MAX_RADIUSSCALE) return [];

//     const alpha = showWaveAnimation ? 255 * (MAX_RADIUSSCALE - radiusScale) / MAX_RADIUSSCALE : 255;

//     const layerProps = {
//       LayerType: ScatterplotLayer,
//       ...otherProps,
//       data,
//       getColor: d => [255, (maxSpaces - d.SPACES) / maxSpaces * 140, 0, alpha],
//       updateTriggers: {
//         ...updateTriggers,
//         getColor: [radiusScale],
//       },
//     };

//     return [
//       new ScatterplotLayer(layerProps)
//     ]
//   }
// }

class FadeScatterplotLayer extends CompositeLayer {
  initializeState() {
    this.state = {
      radiusScale: OVERFLOW_FLAG,
      data: [],
      MAX_RADIUSSCALE,
      raf: null,
      maxSpaces: 1,
    };
  }

  shouldUpdateState({changeFlags}) {
    if (changeFlags.propsChanged || changeFlags.dataChanged || changeFlags.stateChanged && this.state.radiusScale !== OVERFLOW_FLAG) {
      return true;
    }

    return false;
  }

  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});
    const {propsChanged, stateChanged, dataChanged} = changeFlags;
    if (!propsChanged && !dataChanged && stateChanged) return false;

    if (propsChanged) {
      this.setState((prevState) => {
        return {
          ...prevState,
          data: props.data || prevState.data,
          MAX_RADIUSSCALE: props.radiusScale || prevState.MAX_RADIUSSCALE,
        }
      })
    }

    /**
     * Animaiton trigger judgement
     */
    if (props.data && props.data.length) {
      // Get max spaces in datasets
      let maxSpaces = 1;
      props.data.map((d) => {
        if (d.SPACES > maxSpaces) {
          maxSpaces = d.SPACES;
        }
      });
      this.setState({maxSpaces});

      if (!props.showWaveAnimation) {
        this.setState({
          radiusScale: props.radiusScale || MAX_RADIUSSCALE
        });

        return ;
      }

      let {raf} = this.state;
      raf && cancelAnimationFrame(raf);

      /**
       * Point Spread Animation Method
       */
      const startAnimation = () => {
        const { speed = 0.02 } = props;
        let {radiusScale} = this.state;
        if (radiusScale === OVERFLOW_FLAG) {
          radiusScale = 0;
        }
        radiusScale += speed;
        
        if (radiusScale >= MAX_RADIUSSCALE) {
          radiusScale = OVERFLOW_FLAG;
          cancelAnimationFrame(raf);
        }
    
        this.setState({radiusScale});
    
        if (radiusScale < MAX_RADIUSSCALE) {
          const raf = window.requestAnimationFrame(startAnimation);
          this.setState({
            raf
          });
        }
      }

      startAnimation();
    }
  }

  renderLayers() {
    let {updateTriggers = {}, showWaveAnimation, data, ...otherProps} = this.props;
    const {radiusScale, maxSpaces, MAX_RADIUSSCALE} = this.state;
    if (showWaveAnimation) {
      otherProps.radiusScale = radiusScale;
    }
    
    if (radiusScale === OVERFLOW_FLAG) return [];

    const alpha = showWaveAnimation ? 255 * (MAX_RADIUSSCALE - radiusScale) / MAX_RADIUSSCALE : 255;

    const layerProps = {
      ...otherProps,
      data,
      getColor: d => [255, (maxSpaces - d.SPACES) / maxSpaces * 140, 0, alpha],
      updateTriggers: {
        ...updateTriggers,
        getColor: [radiusScale],
      },
    };

    return [
      new ScatterplotLayer(layerProps)
    ]
  }
}

FadeScatterplotLayer.layerName = 'FadeScatterplotLayer';
FadeScatterplotLayer.defaultProps = {
  ...ScatterplotLayer.defaultProps,
  showWaveAnimation: false,
};

  
export default FadeScatterplotLayer;