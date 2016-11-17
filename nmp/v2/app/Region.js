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

  darksky(){
    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    var lati = 37.8267;
    var longi = -122.4233;
    var data;
      $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
                //console.log(data);
        console.log('and the temperature is: ' + data.currently);
        return data.currently.summary;
      });
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

  writeStory() {
    //this.darksky();
    //$('.story').append("<div class='" + this.name + "'></div>")
    $('.story').append(`<p>--------------------------------------------------------------------------</p>`);

    // This line doesn't need to be displayed everytime.
    $('.story').append(`<p>In this ${this.biome.descriptors[0]} with the ${this.biome.descriptors[1]} desecrated by [industry]. This Mother is with the assigned Children. $${this.cash} units. `);

    $('.story').append(`<p>-----${this.today.temp}----</p>`);

    $('.story').append(`<p>Mother is curious about the ${this.biome.objects_wanted[1]}. She is tired of the ${this.biome.objects[0]}. ${this.warden.feeling(this.today.temp)}</p>`);

    $('.story').append(`<p>Machine stops Mother from entering Field. For the Intention to work, she cannot feel what Children feel. The children get to enjoy ${this.biome.objects_wanted[0]} that she cannot. The reason is clear.`);


    // WARDEN's feelings about situation
    
  }
    

  step() {
    // each step is a day
    this.today = this.newDay();
    this.writeStory();

    var breaks = this.machineBreaks(this.today.humidity, this.today.comfort);
    if (breaks && !this.machineBroken) {
      $('.story').append(`Machine is old and repairs take long, but Re-education must continue.`);
      this.machineBroken = true;
    }

    if (this.machineBroken) {

      $('.story').append(`Inside the Field, those who are awoken are surrounded by ${this.biome.objects_wanted[0]}.`);

      // some people become conscious when the machine breaks
      _.each(this.population, (person, i) => {
        if (Math.random() < config.CONSCIOUS_PROB) {
          person.conscious = true;
          $('.story').append(`Child ${i} feels the ${this.biome.objects_wanted[0]} [specific weather].`);
        }
      });

      $('.story').append(`The scabs fall off.`);

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
      $('.story').append(`<p>Mother cries out, voice parched, for ${toBuy.name}.</p>`);
      _.extend(this, this.successor(toBuy));
    } else {
      $('.story').append(`<p>I cant buy anything</p>`);
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
