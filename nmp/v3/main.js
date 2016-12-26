import './css/main.sass';
import $ from 'jquery';
import World from './app/World';

const BIOME = {
  DESERT: {
    budget: 2000,
    long_coord: 16.3471,
    lat_coord: 47.8915,
    countries: ["Southwestern China", "Southeast Australia", "Pakistan", "Afghanistan", "Yemen", "Saudi Arabia", "Iraq", "Iran", "Texas, United States of America", "New Mexico, United States of America", "Southern California, United States of America"],
    temperature_feelings: ["frown", "cold", "partially"],
    weather_data: {
      cloudCover: 0,
      precipProbability: 0,
      windSpeed: 0
    }
  },
  TROPICAL: {
    budget: 3000,
    long_coord: 23.7594,
    lat_coord: 90.3788,
    countries: ["Bangladesh", "India", "Sierra Leone", "South Sudan", "Nigeria", "Chad", "Haiti", "Ethiopia", "Philippines", "Central African Republic", "Eritrea", "Bolivia"],
    temperature_feelings: ["dry", "dusty", "leathery"],
    weather_data: {
      cloudCover: 0,
      precipProbability: 0,
      windSpeed: 0
    }
  },
  MODERATE: {
    budget: 3000,
    long_coord: 40.719203,
    lat_coord: -73.9449426,
    countries: ["New York", "New York", "New York", "New York", "New York", "New York"],
    temperature_feelings: ["dry", "dusty", "leathery"],
    weather_data: {
      cloudCover: 0,
      precipProbability: 0,
      windSpeed: 0
    }
  }
}

const REGIONS = [
  [BIOME.MODERATE]
]


var world = new World(REGIONS);
world.run(1);