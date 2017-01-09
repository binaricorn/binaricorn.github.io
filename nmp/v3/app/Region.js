import $ from 'jquery';
import _ from 'underscore';
import config from '../config';
import People from './Person';

class Region {
  constructor(biome, populationSize, peoplePrefs) {
    this.biome = biome;
    this.budget = biome.budget;
    this.weather_data = biome.weather_data;
    this.temperature_feelings = biome.temperature_feelings;
    this.long_coord = biome.long_coord;
    this.lat_coord = biome.lat_coord;
    this.countries = biome.countries;
    this.population = _.map(_.range(populationSize), i => { return new People(this, peoplePrefs) });
    this.feeling_like = biome.feeling_like;
    this.cash = biome.budget;
    this.resourcesFoods = config.FOODS.count;
    this.feature_threshold = 6;
    this.feature_threshold_highest = 8;
    this.days = 0;
    this.pillsLasts = _.random(2, 5);
  }

  step() {
    this.days++;
    this.resourcesFoods -= this.population.length;

   _.each(this.population, (person, i) => {
    person.traits.firstname = config.NAMES[18-(i*2)];
    person.traits.lastname = config.NAMES[(i+2)*2];
    person.traits.bravery = i+2;
    person.traits.dilligence = i+1;
    person.traits.dexterous = i+1;
    person.traits.cooperative = i+1;
    person.traits.migration = i;
    person.traits.countries = i+2;
    person.features.height = i+2;
    person.features.sex = i*2;

    if(person.features.height > this.feature_threshold) {
      person.features.height = 'tall';
    } else {
      person.features.height = 'short';
    }

    if(person.features.weight > this.feature_threshold) {
      person.features.weight = 'plump';
    } else {
      person.features.weight = 'thin';
    }

    if(person.features.hair_darkness > this.feature_threshold) {
      person.features.hair_darkness = 'raven';
    } else {
      person.features.hair_darkness = 'blond';
    }

    if(person.features.face_blemishedness > this.feature_threshold) {
      person.features.face_blemishedness = 'pimply';
    } else {
      person.features.face_blemishedness = 'smooth';
    }

    if(person.features.sex > this.feature_threshold) {
      person.features.sex = 'male';
    } else {
      person.features.sex = 'female';
    }

    if(person.traits.countries <= 3) {
      person.country_region = 'Tundra';
      person.country = config.TUNDRA_COUNTRIES[0];
    } else if (person.traits.countries >= 4 && person.traits.countries <= 7) {
      person.country_region = 'Desert';
      person.country = config.DESERT_COUNTRIES[0]
    } else if (person.traits.countries >= 8 && person.traits.countries <= 10) {
      person.country_region = 'Tropics';
      person.country = config.TROPICAL_COUNTRIES[0]
    }
  });

  this.weatherStory(this.pillsLasts, this.days, this.resourcesFoods, this.population, this.biome, this.long_coord, this.lat_coord);
  
  }

  weatherStory(pillsLasts, days, resourcesFoods, _population, _biome, _lati, _longi){
    
    var emergency = false;
    var pills = false;
    var pillEffect = false;
    var cc_population_total_coop_score = [];
    var temp_cooperative_score = 0;
    var person_comfort;
    var person_comfort_num;
    var person_comfort_text;
    
    var normalFoodConsumed = _population.length * 3;
    var emergencyFoodConsumed = 3;
    var bestTeam = {};

    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    var data;
    $.getJSON(url + apiKey + "/" + _lati + "," + _longi + "?callback=?", function(data) {
      var summary = data.currently.summary;
      var apparentTemperature = data.currently.apparentTemperature;
      var cloudCover = data.currently.cloudCover;
      var precipProbability = data.currently.precipProbability;
      var precipType = data.currently.precipType;
      var summaryToday = data.daily.data[0].summary;
      var windSpeed = data.currently.windSpeed;

      $('.story').append(`<h1>${days}</h1>`);

      countFood();
      console.log(getCooperationScores(bestTeam));

      console.log(potential(getCooperationScores(bestTeam)));
      
      function getCooperationScores(group) {
        cc_population_total_coop_score = [];
        _.each(group, (person, i) => { 
          person_comfort = person.comfort(apparentTemperature, person.country_region);
          person_comfort_num = person_comfort.num;
          person_comfort_text = person_comfort.text;
          temp_cooperative_score = person.traits.cooperative;
          temp_cooperative_score += person_comfort_num;           
          cc_population_total_coop_score.push(temp_cooperative_score);
        });
        cc_population_total_coop_score = _.reduce(cc_population_total_coop_score, function(memo, num){ return memo + num; }, 0);

        return cc_population_total_coop_score;
      }

      function countFood() {

        console.log(`${days}`)
        if(resourcesFoods < 0) {
          console.log(`no more food ${resourcesFoods}`);
          emergency = true;
        } 

        if(emergency) {
          pickBestTeam();
          pills = true;
        }

        if(pills) {
          resourcesFoods += 4;
          console.log(bestTeam.most_cooperative.traits.cooperative);
          pillsLasts--;
          //console.log(getCooperationScores(bestTeam));            
          if(pillsLasts > 0 ) {
            bestTeam.most_cooperative.traits.cooperative += 5;

            $('.story').append(` There were obviously times when you didn't witness it either, because you were asleep yourself. When their voices sound raw and their faces marked with signs of loneliness. One time you were out for almost a week. A week for you looked like a month on their faces. You mentally run through the steps, miming with your hands in the air when they slept on. In the morning you feed everyone the best scraps of whatever's left of the very negligible foodstuffs. The ones who you chose - some looked startled. It would be shocking if they've never witnessed it. <p>Are--are they dead? What happened? One stammered, eyes darting back and forth, possibly looking for a weapon. This is normal. Depending on their personality, they may try to reason with you instead of attacking you. Aren't you going to help? You pack the soft snow into small water resitant bags and strap them to the armpits of the sleeping. That's their water source. I've seen this done at the other projects before I met you. You don't mention that you've never done it yourself. Help me move them closer together, or else they'll die in their sleep. Your hands actually shake as you do this but you try not to let others see. That's one of the many unwritten rules.`);
            $('.story').append(`pills now. reduced amount of food consumed: ${resourcesFoods}`);         
          } else {
            $('.story').append(`no more pills, we good now? ${resourcesFoods}`);         
          }
          //console.log(emergency_act(apparentTemperature, pillsLasts)); //cooperative score
          // made up reasoning to rationalize why the last the amount of time they do
        } else {
          console.log(`no more pills now: ${resourcesFoods}`);
        }

        //console.log(getCooperationScores(_population));
        
      }
      
      //function 

      function pickBestTeam() {        
          
        var most_cooperative = _.max(_population, function(_population){ return _population.traits.dexterous; });
        var most_strong = _.max(_population, function(_population){ return _population.traits.strength; });
        var medium_dilligent = _population[3];

        bestTeam.most_cooperative = most_cooperative;
        bestTeam.most_strong = most_strong;
        bestTeam.medium_dilligent = medium_dilligent;

        $('.story').append(`You pick ${bestTeam.most_strong.traits.firstname}${bestTeam.most_strong.traits.lastname} from ${bestTeam.most_strong.country}, ${bestTeam.most_cooperative.traits.firstname}${bestTeam.most_cooperative.traits.lastname} ${bestTeam.most_cooperative.country}, and ${bestTeam.medium_dilligent.traits.firstname}${bestTeam.medium_dilligent.traits.lastname} from ${bestTeam.medium_dilligent.country}`);
      }


      function potential(cc_population_total_coop_score) {

        var all_actions = [];
        var new_costs = config.COSTS;

        if(cc_population_total_coop_score < 15) {
          _.each(new_costs, (cost, i) => {
            cost = cost/2;
           // console.log(cost)
          });
          all_actions = _.pairs(new_costs)  
        } else {
          all_actions = _.pairs(config.COSTS)
        }
        
        var possible_actions = [];
        var chosen_possible_actions = [];

        _.each(all_actions, (key, value) => {
          possible_actions = _.filter(key, function(action) {
          // first let's see if the people are even willing to work together
          if (cc_population_total_coop_score >= key[1]) {
            if(_.isString(action)) {
              chosen_possible_actions.push(action)
            }
          }
          });
        });
        return chosen_possible_actions;
      }


    });
    

  }
  
  
  
}

export default Region;