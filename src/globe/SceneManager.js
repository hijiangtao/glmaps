import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

import Curve from './Curve';
// import Tube from './Tube';
import { GLOBE_RADIUS, CURVE_COLOR, COLOR_SPHERE_NIGHT, MOON_RADIUS } from './constants'; // PI_TWO,

const EARTH_TEXTURE_PREFIX = 'https://raw.githubusercontent.com/hijiangtao/awesome-toolbox/master/assets/';
const EARTH_DIFFUSE_TEXTURE = `${EARTH_TEXTURE_PREFIX}EARTH_DIFFUSE_TEXTURE.jpg`;
const EARTH_BUMP_TEXTURE = `${EARTH_TEXTURE_PREFIX}EARTH_BUMP_TEXTURE.jpg`;
const MOON_DIFFUSE_TEXTURE = `${EARTH_TEXTURE_PREFIX}MOON_DIFFUSE_TEXTURE.jpg`;
const MOON_BUMP_TEXTURE = `${EARTH_TEXTURE_PREFIX}MOON_BUMP_TEXTURE.jpg`;
const EARTH_SPECULAR_TEXTURE = `${EARTH_TEXTURE_PREFIX}EARTH_SPECULAR_TEXTURE.jpg`;
const STAR_FIELD_TEXTURE = `${EARTH_TEXTURE_PREFIX}STAR_FIELD.png`;

const EARTH_EQUATORIAL_ROTATION_VELOCITY = (4651 * 0.001); // km/s
const EARTH_RADIUS = 6371; // km

/**
 * Earth and Lines
 * @param {*} scene 
 */
function createSceneSubject(scene, paths, flyerGroup) {
  // 3D Object Container
  const group = flyerGroup || new THREE.Group();
  group.position.z = 0;
  let earthMesh = null;
  let moonMesh = null;

  if (!flyerGroup) {
    // Earth
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = true;
    const sphereMaterial = new THREE.MeshPhongMaterial({
      // Diffuse Texture
      map: loader.load(EARTH_DIFFUSE_TEXTURE),

      // Bump Texture
      bumpMap: loader.load(EARTH_BUMP_TEXTURE),
      bumpScale: 1,

      // Specular Texture
      specularMap: loader.load(EARTH_SPECULAR_TEXTURE),
      specular: new THREE.Color('grey'),

      // color: COLOR_SPHERE_NIGHT,
    });
    earthMesh = new THREE.Mesh(geometry, sphereMaterial);
    earthMesh.position.x = 0;
    earthMesh.position.y = 0;
    earthMesh.position.z = 0;
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;

    // moon
    const MOON_EQUATORIAL_ROTATION_VELOCITY = (4.627 * 0.001); // km/s

    const moongeometry = new THREE.SphereGeometry(MOON_RADIUS, 32, 32);
    const moonmaterial = new THREE.MeshPhongMaterial({
      // Diffuse Texture
      map: loader.load(MOON_DIFFUSE_TEXTURE),

      // Bump Texture
      bumpMap: loader.load(MOON_BUMP_TEXTURE),
      bumpScale: 1,
    });
    moonMesh = new THREE.Mesh(moongeometry, moonmaterial);

    moonMesh.position.x = earthMesh.position.x;
    moonMesh.position.y = earthMesh.position.y + GLOBE_RADIUS * 1.5;
    moonMesh.position.z = earthMesh.position.z + GLOBE_RADIUS * 1.5;
  }

  // MeshLines
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
    transparent: true,
    color: CURVE_COLOR,
  });
  const curveMesh = new THREE.Mesh();

  paths.forEach((coords, index) => {
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

  if (!flyerGroup) {
    group.add(earthMesh);
    group.add(moonMesh);
  }
  group.add(curveMesh);
  scene.add(group);

  return [
    {
      update: () => { },
    },
    group,
  ]
}

function SceneManagerProto(canvas, data = []) {
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

    currentRenderer.setClearColor(0xFFC900);
    currentRenderer.setPixelRatio(DPR);
    currentRenderer.setSize(width, height);

    currentRenderer.gammaInput = true;
    currentRenderer.gammaOutput = true;

    return currentRenderer;
  }

  /**
   * Camera
   * @param {*} param0 
   */
  const buildCamera = ({ width, height }) => {
    const aspectRatio = width / height;
    const fieldOfView = 30;
    const nearPlane = 0.01;
    const farPlane = 10000;
    const currentCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    currentCamera.position.z = 800;
    currentCamera.lookAt(new THREE.Vector3(0, 0, 0))

    return currentCamera;
  }

  /**
   * Galaxy
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
      map: loader.load(STAR_FIELD_TEXTURE), // Diffuse Texture
    });
    const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

    sceneObj.add(galaxy);
  }

  /**
   * Lighting
   * @param {*} sceneObj 
   */
  const createLighting = (sceneObj) => {  // eslint-disable-line
    // A light source positioned directly above the scene, with color fading from the sky color to the ground color. 
    // const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 3); // eslint-disable-line
    // sceneObj.add(light);

    // A light that gets emitted from a single point in all directions.
    // const pointLight = new THREE.SpotLight(0xffffff, 1, 1000, 10, 2);
    // sceneObj.add(pointLight);

    // DirectionalLight
    const directionalLight = new THREE.DirectionalLight(0xcccccc, 0.6); // color, intensity
    directionalLight.position.set(20, 20, 20);
    sceneObj.add(directionalLight);

    // This light globally illuminates all objects in the scene equally.
    sceneObj.add(new THREE.AmbientLight(0x888888));
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

  // Entrance
  this.scene = buildScene();
  this.renderer = buildRender(screenDimensions);
  this.camera = buildCamera(screenDimensions);
  [this.sceneSubject, this.flyerGroup] = createSceneSubject(this.scene, data);
  this.controller = createController(this.camera, canvas);
  createSceneGalaxy(this.scene);
  createLighting(this.scene);

  /**
   * Data update
   */
  this.updateSceneData = (newDatasets) => {
    // Delete old data
    const pathsIndex = this.flyerGroup.children.length - 1;
    this.flyerGroup.remove(this.flyerGroup.children[pathsIndex]);
    // Re-construct objects
    [this.sceneSubject, this.flyerGroup] = createSceneSubject(this.scene, newDatasets, this.flyerGroup);
  };

  /**
   * Frame Update
   */
  this.update = () => {
    this.controller.update();
    this.sceneSubject.update();

    // renderer.render(scene, camera);
    const { x, z } = this.camera.position;

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

function SceneManager() {
  this.instance = null;
}

SceneManager.getInstance = function (canvas, data) {
  if (!this.instance) {
    this.instance = new SceneManagerProto(canvas, data);
  } else {
    this.instance.updateSceneData.call(this.instance, data);
  }
  return this.instance;
};

export default SceneManager;