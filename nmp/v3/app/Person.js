import $ from 'jquery';
import _ from 'underscore';
import config from '../config';


class Person {
  constructor(region, prefs) {
    this.region = region;
    this.prefs = prefs;

    this.traits = {
      cooperative: _.random(0, 10), 
      bravery: _.random(0, 10),
      dilligence: 2,
      dexterous: _.random(0, 10),
      migration_tendencies: _.random(0, 10),
      countries: _.random(0, 10)
    }  

    this.features = {
      height: _.random(0, 10), 
      weight: _.random(0, 10), 
      hair_darkness: _.random(0, 10), 
      eye_darkness: _.random(0, 10),
      face_blemishedness: _.random(0, 10)
    }

  }

   comfort(CCfeelsLikeTemp, country_region) {
    var comfort_temp;
    var collaboration_score;

    if(country_region == 'Tundra') {
      comfort_temp = [30, 50];
    } else if(country_region == 'Desert') {
      comfort_temp = [40, 80];
    } else {
      comfort_temp = [50, 70];
    }

    if (CCfeelsLikeTemp <= comfort_temp[1] && CCfeelsLikeTemp >= comfort_temp[0]) {
      return 1;
      // if colder than preferred
    } else if (CCfeelsLikeTemp < comfort_temp[0]) {
      return (1 - (comfort_temp[0] - CCfeelsLikeTemp)/100);
      // if hotter than preferred
    } else if (CCfeelsLikeTemp > comfort_temp[1]) {
      return (1 - (CCfeelsLikeTemp - comfort_temp[0])/100);
    }

  }

  do_work() {

  }

}

export default Person;