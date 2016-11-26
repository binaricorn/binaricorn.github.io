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
    countries: ["Southwestern China", "Southeast Australia", "Pakistan", "Afghanistan", "Yemen", "Saudi Arabia", "Iraq", "Iran", "Texas, United States of America", "New Mexico, United States of America", "Southern California, United States of America"],
    objects: ["eternal heat and leathery earth", "yellow sand", "howling wind", "shadeless sun", "unbearable heat", "drought"],
    objects_wanted: ["balmy air", "swaying trees"],
    feeling: {
      is_cold: [`They are is cold. Dangerous and revolutionary thoughts.`, "happy_cold2"],
      is_okay: ["The women are accepting of this turn of events.", "happy_okay2"],
      is_hot: ["Heat can drive a person mad. And has even been proven to stop Re-education", "happy_hot2"]
    }
  },
  TROPICAL: {
    budget: 1200,
    temperature: [80,110],
    humidity: [50, 100],
    waterCostMultiplier: 0.8,
    type: "tropical",
    countries: ["Bangladesh", "India", "Sierra Leone", "South Sudan", "Nigeria", "Chad", "Haiti", "Ethiopia", "Philippines", "Central African Republic", "Eritrea", "Bolivia"],
    objects: ["endless rain and moisture", "rain", "flood", "tears of Mother Earth", "destruction by water", "washing away of things"],
    objects_wanted: ["balmy air", "swaying trees"],
    feeling: {
      is_cold: [`They are is cold. Dangerous and revolutionary thoughts.`, "happy_cold2"],
      is_okay: ["The women are accepting of this turn of events.", "happy_okay2"],
      is_hot: ["Heat can drive a person mad. And has even been proven to stop Re-education", "happy_hot2"]
    }
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
  [BIOME.DESERT,  BIOME.TROPICAL]
];

// iraq
function darksky_desert(){
    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    var lati = 33.1489438;
    var longi = 39.1975202;
    var data;
      $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
        var _windSpeed = data.daily.data[0].windSpeed;
        var _realFeelsTemp = data.currently.apparentTemperature;

        
        windDescription(_windSpeed);
        realFeelsTempDescription(_realFeelsTemp);

        $('.story > p.weather_desert').append(data.currently.apparentTemperature + " degrees with " + windDescription(_windSpeed) + ". It feels like " + realFeelsTempDescription(_realFeelsTemp));
        //return data.currently.apparentTemperature;
      });
}

function darksky_tropical(){
    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    var lati = 23.7808331;
    var longi = 90.3494175;
    var data;
      $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
        var _windSpeed = data.daily.data[0].windSpeed;
        var _realFeelsTemp = data.currently.apparentTemperature;

        
        windDescription(_windSpeed);
        realFeelsTempDescription(_realFeelsTemp);

        $('.story > p.weather_tropical').append(data.currently.apparentTemperature + " degrees with " + windDescription(_windSpeed) + ". It feels like " + realFeelsTempDescription(_realFeelsTemp));
        //return data.currently.apparentTemperature;
      });
}

function windDescription(windSpeed) {
  // wind
  var windSpeed = windSpeed;
  var windText;

  if (windSpeed < 1) {
    windText = "Calm. Ponds are mirror-like and placid";
  } else if (windSpeed >= 1 && windSpeed <= 3) {
    windText = "Light Air. Small ripples appear on water surface";
  } else if (windSpeed >= 4 && windSpeed <= 7) {
    windText = "Light Breeze. Leaves rustle, can feel wind on your face, wind vanes begin to move. Small wavelets develop, crests are glassy";
  } else if (windSpeed >= 8 && windSpeed <= 12) {
    windText = "Gentle Breeze. Leaves and small twigs move, light weight flags extend";
  } else if (windSpeed >= 13 && windSpeed <= 18) {
    windText = "Moderate Breeze. Small branches move, raises dust, leaves and paper";
  } else if (windSpeed >= 19 && windSpeed <= 24) {
    windText = "Fresh Breeze. Small trees sway";
  } else if (windSpeed >= 32 && windSpeed <= 38) {
    windText = 'Strong Breeze. Large tree branches move,  telephone wires begin to "whistle", umbrellas are difficult to keep under control';
  } else if (windSpeed >= 39 && windSpeed <= 46) {
    windText = 'Twigs and small branches are broken from trees, walking is difficult';
  }
  return windText;
}

function realFeelsTempDescription(realFeelsTemp) {
  var realFeelsTemp = realFeelsTemp;
  var realFeelsTempText;

  if (realFeelsTemp < 25) {
    realFeelsTempText = "Freezing";
  } else if (realFeelsTemp >= 26 && realFeelsTemp <= 40) {
    realFeelsTempText = "Pretty damn cold";
  } else if (realFeelsTemp >= 41 && realFeelsTemp <= 55) {
    realFeelsTempText = "Chilly af";
  } else if (realFeelsTemp >= 41 && realFeelsTemp <= 55) {
    realFeelsTempText = "Chilly af";
  } else if (realFeelsTemp >= 56 && realFeelsTemp <= 70) {
    realFeelsTempText = "Warm";
  } else if (realFeelsTemp >= 71 && realFeelsTemp <= 85) {
    realFeelsTempText = "Hot";
  } else if (realFeelsTemp >= 86 && realFeelsTemp <= 100) {
    realFeelsTempText = "Dying";
  }

  return realFeelsTempText;
}

darksky_desert();
darksky_tropical();

var world = new World(REGIONS);
world.run(config.DAYS);

