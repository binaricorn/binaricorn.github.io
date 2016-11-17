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
    descriptors: ["eternal heat and leathery earth", "wind"],
    objects: ["shadeless sun", "unbearable heat"],
    objects_wanted: ["balmy air", "swaying trees"]
  },
  TUNDRA: {
    budget: 1000,
    temperature: [-40,-10],
    humidity: [0, 20],
    waterCostMultiplier: 0.8,
    type: "tundra",
    descriptors: ["endless cold", "blizzard"],
    objects: ["forever snow", "terrible winds"],
    objects_wanted: ["balmy air", "swaying trees"]
  },
  TROPICAL: {
    budget: 1200,
    temperature: [80,110],
    humidity: [50, 100],
    waterCostMultiplier: 0.8,
    type: "tropical",
    descriptors: ["endless rain and moisture", "rain"],
    objects: ["water and more water", "tears"],
    objects_wanted: ["balmy air", "swaying trees"]
  },
  MODERATE: {
    budget: 2500,
    temperature: [80,110],
    humidity: [0,50],
    waterCostMultiplier: 1,
    type: "moderate",
    descriptors: ["moderate", "nice sunshine"],
    objects: ["mild air", "trees"],
    objects_wanted: ["different things"]
  }
};
const REGIONS = [
  [BIOME.DESERT,   BIOME.TUNDRA,    BIOME.TROPICAL]
];


var world = new World(REGIONS);
world.run(config.DAYS);

