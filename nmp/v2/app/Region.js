import $ from 'jquery';
import _ from 'underscore';
import config from '../config';
import Warden from './Warden';

class Region {
  constructor(biome, populationSize, wardenPrefs) {
    this.biome = biome;

    this.ac = 0;
    this.water = 0;
    this.telecom = 0;
    this.name = biome.type;
    this.countries = biome.countries;
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
        feelsLike = this.feelsLikeTemp(temp, this.ac, this.water);
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
    var random_country = _.random(0, config.CHILD_MEMORIES.length);
    var random_food = _.random(0, config.FOOD_DANGER.length); 
    $('.story').append(`<p>-------------------------------------------------------------------------- </p>`);


    // This line doesn't need to be displayed everytime.
    $('.story').append("<p><span class='cash'>" + this.today.temp + " degrees | " + this.cash + " units</span>. In the " + this.biome.objects[config.PLACE_COUNTER] + " " + this.biome.objects[config.PLACE_COUNTER+1] + " that could be " + this.countries[random_country] + " or " + this.countries[random_country+1] + " or " + this.countries[random_country+2] + ", there is a Re-education Center protruding from a blanket of" + this.biome.objects[config.PLACE_COUNTER+2] + ".</p><p>Since the region's collective vote in support of the " + config.POLITICS[config.PLACE_COUNTER] + " Party, movement towards establishment of the " + config.BILLS[config.PLACE_COUNTER] + " collapsed, and these lands have been laid to waste in the Great Migration northwards. <p>A few women were chosen to stay behind and prepare for Re-inhabitation. <p>Synthetic food meant to replicate " + config.FOOD_DANGER[random_food] + ". In here, the Mother starts preparing the Children assigned.");

    config.PLACE_COUNTER += 1;

    if (config.PLACE_COUNTER > this.biome.objects.length) {
      config.PLACE_COUNTER = 0;
    }
    
  }
    

  step() {
    // each step is a day
    this.today = this.newDay();
    this.writeStory();
    

    var breaks = this.machineBreaks(this.today.humidity, this.today.comfort);
    if (breaks && !this.machineBroken) {
//      $('.story').append(`The machine is broken.`);
      this.machineBroken = true;
    }

    if (this.machineBroken) {

      if (this.newDay().n_conscious > 0) {
        $('.story').append('The Simutero cell sometimes has leaks in memory, stuttering pauses that could take days to self-regulate and recover. Some blame the Outer Conditions. Some Mothers blame each other. Some awoke.');
      }

      // some people become conscious when the machine breaks
      _.each(this.population, (person, i) => {
        if (Math.random() < config.CONSCIOUS_PROB) {
          var random_child_memories = _.random(0, config.CHILD_MEMORIES.length);
          var random_child_appearance = _.random(0, config.CHILD_APPEARANCE.length);
          person.conscious = true;
          
          $('.story').append(`Child ${i}, a [${config.CHILD_APPEARANCE[random_child_appearance]}], has its first memory of a [${config.CHILD_MEMORIES[random_child_memories]}] inside this ${this.biome.objects_wanted[0]} [specific weather].`);
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
          $('.story').append(`<p>${this.name}: ${this.machineRepairCountdown} : After some days the machine is working again.</p>`);
          this.machineBroken = false;
          this.machineRepairing = false;
          _.each(this.population, person => { person.conscious = false });
        }
      }
    }

    if (this.nConscious <= this.today.n_conscious) {
      var random_payment = _.random(config.INCOME[0], config.INCOME[1]);
      var random_conflict = _.random(0, config.CONFLICTS.length);
      this.cash += random_payment;
      // random_payment is food
      $('.story').append("<p>In the middle of the day, the Habitable World Bank issues its currency metric. The Bank adds " + random_payment + " to Mother's wages. Nobody asks why its different every day. News says it's " + config.CONFLICTS[random_conflict] + ". No new Children woke up so mother is awarded this wage.</p>");
    }

    var toBuy = this.warden.decide();
    var body_feelings = {
      ac_most_comfortable: ["which brings the Inner Conditions down a smidge so that she's feeling pretty good."],
      ac_somewhat_comfortable: ["just somewhat comfortable"],
      ac_very_uncomfortable: ["almost going to die without it"],
      repair_most_comfortable: ["of course the machine needs to be fixed"],
      repair_somewhat_comfortable: ["even though she's not totally comfortable"],
      repair_very_uncomfortable: ["even despite her discomfort. The Central Bank make a note to consider this act of martyrdom in next year's promotion request."],
      water_most_comfortable: ["luckily there was a storage unit with a large amount"],
      water_somewhat_comfortable: ["and catches some from a reserve"],
      water_very_uncomfortable: ["she is so parched she will die."]
    }

    var body_feelings_choice = {

    }

    if (toBuy) {
      var body_feelings_text;

      if (this.today.comfort < 0.75) {
        if (toBuy.name == "ac") {
          body_feelings_text = body_feelings.ac_very_uncomfortable[0];  
        } else if (toBuy.name == "repair") {
          body_feelings_text = body_feelings.repair_very_uncomfortable[0];  
        } else if (toBuy.name == "water") {
          body_feelings_text = body_feelings.water_very_uncomfortable[0];  
        }
      } else if (this.today.comfort >= 0.75 && this.today.comfort <= 0.85) {
        if (toBuy.name == "ac") {
          body_feelings_text = body_feelings.ac_somewhat_comfortable[0];  
        } else if (toBuy.name == "repair") {
          body_feelings_text = body_feelings.repair_somewhat_comfortable[0];  
        } else if (toBuy.name == "water") {
          body_feelings_text = body_feelings.water_somewhat_comfortable[0];  
        }
        
      } else if (this.today.comfort >= 0.85 && this.today.comfort <= 0.95) {
        if (toBuy.name == "ac") {
          body_feelings_text = body_feelings.ac_most_comfortable[0];  
        } else if (toBuy.name == "repair") {
          body_feelings_text = body_feelings.repair_most_comfortable[0];  
        }
      } else if (toBuy.name == "ac" || toBuy.name == "repair" || toBuy.name == "water" ) {
        body_feelings_text = "and all the supplies are up to snuff. Nothing's broken, and the Inner and Outer Conditions feel balanced. She can go to sleep now.";
      }



      // mother forgoes her share to fix the machine
      $('.story').append(`<p>Mother spends her wages on ${toBuy.name}, ${body_feelings_text} [${this.today.comfort}].</p>`);
      _.extend(this, this.successor(toBuy));
    } else {
      $('.story').append(`<p>The Mother has run out of money and must suffer for the day.</p>`);
    }

    
  }

  successor(action) {
    var nextState = _.clone(this);
    switch (action.name) {
        case 'ac':
          nextState.ac++;
          break;
        case 'water':
          nextState.water++;
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
    var feelsLike = this.feelsLikeTemp(nextState.today.temp, nextState.ac, nextState.water);
    nextState.today.comfort = this.warden.comfort(feelsLike);
    nextState.cash -= action.cost;
    return nextState;
  }

  feelsLikeTemp(temperature, ac, water) {
    return temperature + (ac * config.AC_TEMPERATURE_EFFECT) + (water * config.WATER_TEMPERATURE_EFFECT);
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
