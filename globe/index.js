import React, { useEffect, useRef } from 'react';
import fetch from 'dva/fetch';
import SceneManager from './SceneManager';
import styles from './index.less';

/**
 * MOCK 数据管理
 */
let MOCK_DATA = [
  [
    37.77397, 
    -122.43129, 
    22.54554,
    114.0683,
  ],
  [
    47.77397, 
    -110.43129, 
    22.54554,
    114.0683,
  ],
];

(async () => {
  const rawData = await fetch('https://raw.githubusercontent.com/hijiangtao/awesome-toolbox/master/data/GLOBAL_FLIGHTS.json');
  const res = await rawData.json();

  const routes = res.routes.slice(0, 4000);
  const {airports} = res;
  const coords = routes.map(route => {
    const startAirport = airports[route[1]];
    const endAirport = airports[route[2]];
    const startLat = startAirport[4];
    const startLng = startAirport[3];
    const endLat = endAirport[4];
    const endLng = endAirport[3];
    return [ startLat, startLng, endLat, endLng ];
  });

  MOCK_DATA = coords;
})();

/**
 * 渲染入口管理
 * @param {*} containerElement 
 */
const threeEntryPoint = (id, curveData) => {
  const canvas = document.getElementById(id);
  const sceneManager = SceneManager.getInstance(canvas, curveData);
  
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
 * Three 对象类
 */
const ThreeCube = React.memo((props) => {
  // const threeRootRef = useRef(null);

  useEffect(() => {
    const data = props.custom ? props.data : MOCK_DATA;
    const [canvas, raf, resizeFunc] = threeEntryPoint('canvasGlobe', data);

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
      className={styles['three-root-container']}
      // ref={threeRootRef}
    />
  )
})

export default ThreeCube;
