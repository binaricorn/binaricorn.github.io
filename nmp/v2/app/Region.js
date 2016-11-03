import $ from 'jquery';
import _ from 'underscore';
import config from '../config';
import Warden from './Warden';

class Region {
  constructor(biome, populationSize, wardenPrefs) {
    this.biome = biome;

    this.ac = 0;
    this.heating = 0;
    this.telecom = 0;
    this.name = biome.type;
    this.cash = biome.budget;
    this.machineBroken = false;
    this.machineRepairing = false;
    this.machineRepairCountdown = 0;
    // TODO more detailed people
    this.population = _.map(_.range(populationSize), i => { return {}});
    this.warden = new Warden(this, wardenPrefs);
  }

  newDay() {
    var temp = this.todaysTemp(),
        feelsLike = this.feelsLikeTemp(temp, this.ac, this.heating);
    return {
      temp: temp,
      humidity: this.todaysHumidity(),
      feelsLike: feelsLike,
      comfort: this.warden.comfort(feelsLike),
      n_conscious: this.nConscious
    };
  }

  step() {
    // each step is a day
    this.today = this.newDay();

    $('.story').append(`<p>In the ${this.name}, you're given a budget of $${this.cash} to spend on maintaining your sanity. You look at your state issued thermometer. It reads ${this.today.temp}F. Through the window you see it's ${this.biome.descriptors[0]} again.`);

    var breaks = this.machineBreaks(this.today.humidity, this.today.comfort);
    if (breaks && !this.machineBroken) {
      $('.story').append(`The machine is broken when you walk in. You check the dialogue box for the damage. `);
      this.machineBroken = true;
    }

    if (this.machineBroken) {
      // some people become conscious when the machine breaks
      _.each(this.population, (person, i) => {
        if (Math.random() < config.CONSCIOUS_PROB) {
          person.conscious = true;
          $('.story').append(`Civilian ${i} was awoken. `);
        }
      });

      // conscious people tell some unconscious people
      // depending on the telecom of the region
      var awoken = _.filter(this.population, person => person.conscious),
          asleep = _.filter(this.population, person => !person.conscious);
      _.each(awoken, a => {
        _.each(asleep, a_ => {
          if (Math.random() < this.telecom/20) { // 20 is a arbitrary scaling value
            a_.conscious = true;
          }
        });
      });

      if (this.machineRepairing) {
        // repair
        if (this.machineRepairCountdown > 0) {
          this.machineRepairCountdown--;
        }
        if (this.machineRepairCountdown <= 0) {
          $('.story').append(`<p>${this.name}: My machine is working again :)</p>`);
          this.machineBroken = false;
          this.machineRepairing = false;
          _.each(this.population, person => { person.conscious = false });
        }
      }
    }

    var toBuy = this.warden.decide();
    if (toBuy) {
      $('.story').append(`<p>${this.name}: I decided to buy ${toBuy.name}.</p>`);
      _.extend(this, this.successor(toBuy));
    } else {
      $('.story').append(`<p>${this.name}: I can't buy anything</p>`);
    }

    if (this.nConscious <= this.today.n_conscious) {
      this.cash += _.random(config.INCOME[0], config.INCOME[1]);
    }
  }

  successor(action) {
    var nextState = _.clone(this);
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
            nextState.machineRepairCountdown = _.random(config.MACHINE_REPAIR_DAYS[0], config.MACHINE_REPAIR_DAYS[1]) * 1/nextState.today.comfort;
          }
          break;
    }
    var feelsLike = this.feelsLikeTemp(nextState.today.temp, nextState.ac, nextState.heating);
    nextState.today.comfort = this.warden.comfort(feelsLike);
    nextState.cash -= action.cost;
    return nextState;
  }

  feelsLikeTemp(temperature, ac, heating) {
    return temperature + (ac * config.AC_TEMPERATURE_EFFECT) + (heating * config.HEATING_TEMPERATURE_EFFECT);
  }

  todaysTemp() {
    return _.random(this.biome.temperature[0], this.biome.temperature[1]);
  }

  todaysHumidity() {
    return _.random(this.biome.humidity[0], this.biome.humidity[1]);
  }

  machineBreaks(humidity, comfort) {
    return Math.random() < (Math.abs(humidity)/100 + (1 - comfort))/1.5;
  }

  get nConscious() {
    return _.reduce(this.population, (m, p) => { return m + (p.conscious ? 1 : 0) }, 0);
  }
}

export default Region;
