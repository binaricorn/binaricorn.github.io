import './css/main.sass';
import $ from 'jquery';
import config from './config';
import World from './app/World';

// import * as THREE from 'three';
// import Scene from './app/Scene';

// var scene = new Scene();
// var geometry = new THREE.BoxGeometry(1,1,1),
//     material = new THREE.MeshLambertMaterial(),
//     mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(0,0,0);
// scene.scene.add(mesh);

// function run() {
//   requestAnimationFrame(run);
//   scene.render();
// }
// run();


const BIOME = {
  DESERT: {
    budget: 2000,
    temperature: [100,130],
    humidity: [-100, -20],
    waterCostMultiplier: 1.5,
    type: "desert",
    descriptors: ["dry", "windy"]
  },
  TUNDRA: {
    budget: 1000,
    temperature: [-50,-20],
    humidity: [0, 20],
    waterCostMultiplier: 0.8,
    type: "tundra",
    descriptors: ["snowy", "blizzardy"]
  },
  TROPICAL: {
    budget: 1500,
    temperature: [80,110],
    humidity: [50, 100],
    waterCostMultiplier: 0.8,
    type: "tropical",
    descriptors: ["wet", "rainy"]
  },
  MODERATE: {
    budget: 2500,
    temperature: [80,110],
    humidity: [0,50],
    waterCostMultiplier: 1,
    type: "moderate",
    descriptors: ["sunny", "chilly"]
  }
};
const REGIONS = [
  [BIOME.TUNDRA,    BIOME.TUNDRA,   BIOME.TUNDRA,     BIOME.TUNDRA],
  [BIOME.MODERATE,  BIOME.DESERT,   BIOME.MODERATE,   BIOME.TROPICAL],
  [BIOME.DESERT,    BIOME.DESERT,   BIOME.DESERT,     BIOME.DESERT],
  [BIOME.TUNDRA,    BIOME.TUNDRA,   BIOME.TUNDRA,     BIOME.TUNDRA]
];


var world = new World(REGIONS);
world.run(config.DAYS);
