import {ScatterplotLayer, CompositeLayer} from 'deck.gl';

const MAX_RADIUSSCALE = 8; // Default Max Display radiusScale
const OVERFLOW_FLAG = 9999; // Animation End Flag

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
    if (changeFlags.stateChanged && this.state.radiusScale !== OVERFLOW_FLAG) {
      return true;
    }
  }

  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});

    this.setState({
      data: props.data || [],
      MAX_RADIUSSCALE: props.MAX_RADIUSSCALE || MAX_RADIUSSCALE,
    })

    if (props.data && props.data.length) {
      // 新数据进入后更新
      let maxSpaces = 1;
      props.data.map((d) => {
        if (d.SPACES > maxSpaces) {
          maxSpaces = d.SPACES;
        }
      });
      this.setState({maxSpaces});

      let {raf} = this.state;
      raf && cancelAnimationFrame(raf);

      /**
       * 波纹动画函数
       */
      const startFadeAnimation = () => {
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
          const raf = window.requestAnimationFrame(startFadeAnimation);
          this.setState({
            raf
          });
        }
      }

      startFadeAnimation();
    }
  }

  renderLayers() {
    const {data, updateTriggers = {}} = this.props;
    const {radiusScale, maxSpaces, MAX_RADIUSSCALE} = this.state;
    
    if (radiusScale === MAX_RADIUSSCALE) return [];

    return [
      new ScatterplotLayer({
        id: 'scatterplot-fade',
        data,
        // pickable: true,
        opacity: 0.8,
        radiusScale,
        radiusMinPixels: 0,
        radiusMaxPixels: 200,
        getPosition: d => d.COORDINATES,
        getRadius: () => 14000,
        getColor: d => [255, (maxSpaces - d.SPACES) / maxSpaces * 140, 0, 255 * (MAX_RADIUSSCALE - radiusScale) / MAX_RADIUSSCALE],
        updateTriggers: {
          ...updateTriggers,
          getColor: [radiusScale],
        },
      })
    ]
  }
}

FadeScatterplotLayer.layerName = 'FadeScatterplotLayer';
FadeScatterplotLayer.defaultProps = {
  ...ScatterplotLayer.defaultProps,
  showWaveAnimation: false,
};

  
export default FadeScatterplotLayer;