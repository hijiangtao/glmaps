import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

import Curve from './Curve';
// import Tube from './Tube';
import { GLOBE_RADIUS, CURVE_COLOR, COLOR_SPHERE_NIGHT } from './constants'; // PI_TWO,

const EARTH_GEOMETRY_MATERIAL = 'https://i.imgur.com/45naBE9.jpg';

/**
 * 地球与飞线
 * @param {*} scene 
 */
function createSceneSubject(scene, paths, flyerGroup) {
  // 三维物体基类作为容器
  const group = flyerGroup || new THREE.Group();
  group.position.z = 0;
  let earthMesh = null;
  
  if (!flyerGroup) {
    // 地球
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = true;
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: loader.load(EARTH_GEOMETRY_MATERIAL),
      bumpMap: loader.load(EARTH_GEOMETRY_MATERIAL),
      bumpScale: 0.05,
      color: COLOR_SPHERE_NIGHT,
    });
    earthMesh = new THREE.Mesh(geometry, sphereMaterial);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
  }

  // 飞线
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
    transparent: true,
    color: CURVE_COLOR,
  });
  const curveMesh = new THREE.Mesh();

  paths.forEach((coords) => {
    const curve = new Curve(coords, material);
    return curveMesh.add(curve.mesh);

    // if (index % 2) {
    //   const curve = new Curve(coords, material);
    //   curveMesh.add(curve.mesh);
    // } else {
    //   const tube = new Tube(coords, material);
    //   curveMesh.add(tube.mesh);
    // }
  });

  group.add(curveMesh);
  if (!flyerGroup) group.add(earthMesh);
  scene.add(group);
  
  return [
    {
      update: () => {},
    },
    group,
  ]
}

export default function SceneManager(canvas, data = []) {
  /**
   * Scene
   */
  const buildScene = () => new THREE.Scene();

  /**
   * Renderer
   * @param {*} param0 
   */
  const buildRender = ({ width, height }) => {
    const currentRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const DPR = window.devicePixelRatio || 1;

    currentRenderer.setClearColor( 0xFFC900 );
    currentRenderer.setPixelRatio(DPR);
    currentRenderer.setSize(width, height);

    currentRenderer.gammaInput = true;
    currentRenderer.gammaOutput = true;

    return currentRenderer;
  }

  /**
   * 相机
   * @param {*} param0 
   */
  const buildCamera = ({ width, height }) => {
    const aspectRatio = width / height;
    const fieldOfView = 30;
    const nearPlane = 0.01;
    const farPlane = 10000;
    const currentCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    currentCamera.position.z = 800;
    currentCamera.lookAt(new THREE.Vector3(0,0,0))

    return currentCamera;
  }

  /**
   * 星空
   * @param {*} sceneObj 
   */
  const createSceneGalaxy = (sceneObj) => {
    // Galaxy
    const galaxyGeometry = new THREE.SphereGeometry(5000, 32, 32);

    // Texture Loader
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = true;

    // Load Galaxy Textures
    const galaxyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png'),
    });
    const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

    sceneObj.add(galaxy);
  }

  /**
   * 光照
   * @param {*} scene 
   */
  const createLighting = (scene) => {  // eslint-disable-line
    // lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 3); // eslint-disable-line
    scene.add(light);

    const pointLight = new THREE.SpotLight(0xffffff, 1, 1000, 10, 2);
    scene.add(pointLight);

    scene.add(new THREE.AmbientLight(0x333333));
  }

  /**
   * Controler
   * @param {*} cameraSight 
   * @param {*} container 
   */
  const createController = (cameraSight, container) => {
    const controls = new TrackballControls(cameraSight, container);
    controls.rotateSpeed = 2;
    controls.zoomSpeed = 0.4;
    controls.panSpeed = 8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    return controls;
  }

  // const createSceneSubject = (sceneObj, paths) => {
  //   return new SceneSubject(sceneObj, paths);
  // }

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  }

  
  // 入口
  if (this.scene) {
    this.updateSceneData(data);
    return this;
  } else {
    this.scene = buildScene();
    this.renderer = buildRender(screenDimensions);
    this.camera = buildCamera(screenDimensions);
    [this.sceneSubject, this.flyerGroup] = createSceneSubject(this.scene, data);
    this.controller = createController(this.camera, canvas);
    createSceneGalaxy(this.scene);
    createLighting(this.scene);
  }

  /**
   * 非创建式数据更新
   */
  this.updateSceneData = (newDatasets) => {
    // 删除场景中的旧数据
    const pathsIndex = this.flyerGroup.children.length - 1;
    this.flyerGroup.remove(this.flyerGroup.children(pathsIndex));
    // 重新绘制场景中物体
    [this.sceneSubject, this.flyerGroup] = createSceneSubject(this.scene, newDatasets, this.flyerGroup);
  };

  /**
   * 更新
   */
  this.update = () => {
    this.controller.update();
    this.sceneSubject.update();

    // renderer.render(scene, camera);
    const {x, z} = this.camera.position;

    // zoom
    // camera.position.z = _cameraZ;
    const rotSpeed = 0.0005;
    this.camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    // camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    this.camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

    this.camera.lookAt(this.scene.position);

    // render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * resize
   */
  this.onWindowResize = () => {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
