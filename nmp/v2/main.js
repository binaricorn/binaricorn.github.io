import './css/main.sass';
import $ from 'jquery';
import _ from 'underscore';
import * as THREE from 'three';
import Scene from './app/Scene';

var scene = new Scene();
var geometry = new THREE.BoxGeometry(1,1,1),
    material = new THREE.MeshLambertMaterial(),
    mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0,0,0);
scene.scene.add(mesh);

function run() {
  requestAnimationFrame(run);
  scene.render();
}
run();


const config = {
  COMFORTABLE_TEMPERATURE: [50, 80],
  AC_TEMPERATURE_EFFECT: -10,
  HEATING_TEMPERATURE_EFFECT: 10,
  CONSCIOUS_PROB: 0.1,
  MACHINE_REPAIR_DAYS: [4,10],
  INCOME: [100,800]
}


function temperatureComfort(feelsLikeTemp) {
  if (feelsLikeTemp <= config.COMFORTABLE_TEMPERATURE[1] && feelsLikeTemp >= config.COMFORTABLE_TEMPERATURE[0]) {
    return 1;
  } else if (feelsLikeTemp < config.COMFORTABLE_TEMPERATURE[0]) {
    return Math.max(0, 1 - (config.COMFORTABLE_TEMPERATURE[0] - feelsLikeTemp)/100);
  } else if (feelsLikeTemp > config.COMFORTABLE_TEMPERATURE[1]) {
    return Math.max(0, 1 - (feelsLikeTemp - config.COMFORTABLE_TEMPERATURE[1])/100);
  }
}
function feelsLikeTemp(temperature, ac, heating) {
  return temperature + (ac * config.AC_TEMPERATURE_EFFECT) + (heating * config.HEATING_TEMPERATURE_EFFECT);
}
function todaysTemp(region) {
  return _.random(region.temperature[0], region.temperature[1]);
}
function todaysHumidity(region) {
  return _.random(region.humidity[0], region.humidity[1]);
}
function machineBreaks(humidity, comfort) {
  return Math.random() < (Math.abs(humidity)/100 + (1 - comfort))/1.5;
}
function startRepair(state) {
  state.machineRepairCountdown = _.random(config.MACHINE_REPAIR_DAYS[0], config.MACHINE_REPAIR_DAYS[1]) * 1/state.today.comfort;
}
function nConscious(population) {
    return _.reduce(population, (m, p) => { return m + (p.conscious ? 1 : 0) }, 0);
}

const BIOME = {
  DESERT: {
    budget: 2000,
    temperature: [100,130],
    ac: 0,
    heating: 0,
    telecom: 0,
    humidity: [-100, -20],
    waterCostMultiplier: 1.5,
    machineBroken: false,
    machineRepairing: false,
    machineRepairCountdown: 0,
    population: [],
    warden: {
      comfort: 1,
      control: 1
    }
  },
  TUNDRA: {
    budget: 1000,
    temperature: [-50,-20],
    ac: 0,
    heating: 0,
    telecom: 0,
    humidity: [0, 20],
    waterCostMultiplier: 0.8,
    machineBroken: false,
    machineRepairing: false,
    machineRepairCountdown: 0,
    population: [],
    warden: {
      comfort: 1,
      control: 1
    }
  },
  TROPICAL: {
    budget: 1500,
    temperature: [80,110],
    ac: 0,
    heating: 0,
    telecom: 0,
    humidity: [50, 100],
    waterCostMultiplier: 0.8,
    machineBroken: false,
    machineRepairing: false,
    machineRepairCountdown: 0,
    population: [],
    warden: {
      comfort: 1,
      control: 1
    }
  },
  MODERATE: {
    budget: 2500,
    temperature: [80,110],
    ac: 0,
    heating: 0,
    telecom: 0,
    humidity: [0,50],
    waterCostMultiplier: 1,
    machineBroken: false,
    machineRepairing: false,
    machineRepairCountdown: 0,
    population: [],
    warden: {
      comfort: 1,
      control: 1
    }
  }
};
const REGIONS = [
  [BIOME.TUNDRA,    BIOME.TUNDRA,   BIOME.TUNDRA,     BIOME.TUNDRA],
  [BIOME.MODERATE,  BIOME.DESERT,   BIOME.MODERATE,   BIOME.TROPICAL],
  [BIOME.DESERT,    BIOME.DESERT,   BIOME.DESERT,     BIOME.DESERT],
  [BIOME.TUNDRA,    BIOME.TUNDRA,   BIOME.TUNDRA,     BIOME.TUNDRA]
];
const COSTS = {
  ac: 300,
  heating: 300,
  repair: 1000,
  telecom: 800,
  water: 400
};

var world = [];

// initialize each region
_.each(REGIONS, (row, i) => {
  _.each(row, (region, j) => {
    world.push(_.extend({
      name: `region: ${i}-${j}`
    }, region));
  });
});

function utility(state, prefs) {
  // the higher the utility, the happier the warden
  var machineState = 1;
  if (state.machineRepairing) {
    machineState = 0.5;
  } else if (state.machineBroken) {
    machineState = 0;
  }
  return state.today.comfort * prefs.comfort + machineState * prefs.control;
}

function decide(state) {
  var currentUtilty = utility(state, state.warden);
  var options = _.chain(COSTS)
    .map((cost, item) => {
      if (state.budget < cost) {
        return;
      }
      var item = {
        name: item,
        cost: cost
      }
      var nextState = successor(state, item);
      var expectedUtility = utility(nextState, state.warden);
      return {
        item: item,
        expectedUtility: expectedUtility
      }
    }).compact().value();
  if (options.length > 0) {
    return _.max(options, option => option.expectedUtility).item;
  }
}

function successor(state, action) {
  var nextState = _.clone(state);
  switch (action.name) {
      case 'ac':
        nextState.ac++;
        break;
      case 'heating':
        nextState.heating++;
        break;
      case 'telecom':
        nextState.telecom++;
        break;
      case 'water':
        nextState.water++;
        break;
      case 'repair':
        if (nextState.machineBroken) {
          nextState.machineRepairing = true;
          startRepair(nextState);
        }
        break;
  }
  var feelsLike = feelsLikeTemp(nextState.today.temp, nextState.ac, nextState.heating);
  nextState.today.comfort = temperatureComfort(feelsLike);
  nextState.budget -= action.cost;
  return nextState;
}

function step_region(region) {
  // each step is a day
  var temp = todaysTemp(region),
      humidity = todaysHumidity(region),
      feelsLike = feelsLikeTemp(temp, region.ac, region.heating),
      comfort = temperatureComfort(feelsLike),
      breaks = machineBreaks(humidity, comfort),
      n_conscious = nConscious(region.population);

  if (breaks && !region.machineBroken) {
    $('.story').append(`<p>${region.name}: My machine broke!</p>`);
    region.machineBroken = true;
  }

  if (region.machineBroken) {
    // some people become conscious when the machine breaks
    _.each(region.population, person => {
      if (Math.random() < CONSCIOUS_PROB) {
        person.conscious = true;
      }
    });

    // conscious people tell some unconscious people
    // depending on the telecom of the region
    var awoken = _.filter(region.population, person => person.conscious),
        asleep = _.filter(region.population, person => !person.conscious);
    _.each(awoken, a => {
      _.each(asleep, a_ => {
        if (Math.random() < region.telecom/20) { // 20 is a arbitrary scaling value
          a_.conscious = true;
        }
      });
    });

    if (region.machineRepairing) {
      // repair
      if (region.machineRepairCountdown > 0) {
        region.machineRepairCountdown--;
      }
      if (region.machineRepairCountdown <= 0) {
        $('.story').append(`<p>${region.name}: My machine is working again :)</p>`);
        region.machineBroken = false;
        region.machineRepairing = false;
        _.each(region.population, person => { person.conscious = false });
      }
    }
  }

  var state = _.extend({
    today: {
      temp: temp,
      humidity: humidity,
      feelsLike: feelsLike,
      comfort: comfort
    }
  }, region);

  var toBuy = decide(state);
  if (toBuy) {
    $('.story').append(`<p>${state.name}: I decided to buy ${toBuy.name}. It's ${state.today.temp}F</p>`);
    _.extend(region, successor(state, toBuy));
  } else {
    $('.story').append(`<p>${state.name}: I can't buy anything</p>`);
  }

  if (nConscious(region.population) <= n_conscious) {
    state.budget += _.random(config.INCOME[0], config.INCOME[1]);
  }
}

function step() {
  _.each(world, step_region);
}


_.each(_.range(10), i => {
  $('.story').append(`<h1>DAY ${i}</h1>`);
  step();
});
