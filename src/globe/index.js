import React, { memo, useEffect } from 'react';
import SceneManager from './SceneManager';

/**
 * Three Instance Entrance Point
 * @param {*} containerElement 
 */
const threeEntryPoint = ({id, data, animate}) => {
  const canvas = document.getElementById(id);
  const sceneManager = SceneManager.getInstance(canvas, {data, animate});
  let raf = null;
  
  function bindEventListeners() {
    // window.onresize = resizeCanvas;
    window.addEventListener ("resize", resizeCanvas);

    resizeCanvas();
  }
  function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    sceneManager.onWindowResize();
  }
  const render = () => {
    sceneManager.update();
    raf = requestAnimationFrame(render);
  }

  bindEventListeners();
  render();

  return [canvas, raf, resizeCanvas];
}

/**
 * Three Cube Class
 */
const ThreeCube = (props) => {
  useEffect(() => {
    const {data = [], animate = true} = props;
    const [canvas, raf, resizeFunc] = threeEntryPoint({
      id: 'canvasGlobe',
      data,
      animate,
    });

    return () => {
      const gl = canvas.getContext('webgl');
      gl.clearColor(1.0, 1.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resizeFunc);
    }
  }, [props.data]);

  return (
    <canvas 
      id="canvasGlobe"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,1)'
      }}
    />
  )
};

export default memo(ThreeCube);
