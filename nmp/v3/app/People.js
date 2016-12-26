import $ from 'jquery';
import _ from 'underscore';


class Person {
  constructor(region, prefs) {
    this.region = region;
    this.prefs = prefs;

    this.traits = {
      cooperative: _.random(0, 10), 
      bravery: _.random(0, 10),
      dilligence: _.random(0, 10),
      dexterous: _.random(0, 10),
      migration_tendencies: 0
    }  

    this.features = {
      height: _.random(0, 10), 
      weight: _.random(0, 10), 
      hair_darkness: _.random(0, 10), 
      skin_darkness: _.random(0, 10),
      face_blemishedness: _.random(0, 10)
    }
  }

  comfort(feelsLikeTemp) {
    if (feelsLikeTemp < 40) {
      return -1;
    } else if (feelsLikeTemp >= 41 && feelsLikeTemp <= 70) {
      return 0;
    } else if (feelsLikeTemp >= 71) {
      return 1;
    }
  }

  utility() {
    //return region;

  }

  decide() {

  }
}

export default Person;