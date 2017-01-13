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
    person.traits.sentimental = i*2;
    person.traits.dexterous = i+1;
    person.traits.cooperative = i+1;
    person.traits.migration = i;
    person.traits.veteran = i+2;
    person.traits.countries = i+2;
    person.features.height = i+2;
    person.features.sex = i*2;
    person.traits.veteran = i*2;

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
      var apparentTemperatureFeeling;
      var cloudCover = data.currently.cloudCover;
      var precipProbability = data.currently.precipProbability;
      var precipType = data.currently.precipType;
      var summaryToday = data.daily.data[0].summary;
      var windSpeed = data.currently.windSpeed;

      if (apparentTemperature >= 10 && apparentTemperature <= 28) {
          apparentTemperatureFeeling = 'bone-chilling'; //subzero
      } else if (apparentTemperature >= 29 && apparentTemperature <= 34.99) {
          apparentTemperatureFeeling = 'frigid';
      } else if (apparentTemperature >= 35 && apparentTemperature <= 41.99) {
          apparentTemperatureFeeling = 'freezing';
      } else if (apparentTemperature >= 42 && apparentTemperature <= 48.99) {
          apparentTemperatureFeeling = 'cold';
      } else if (apparentTemperature >= 49 && apparentTemperature <= 58.99) {
          apparentTemperatureFeeling = 'chilly'
      } else {
          apparentTemperatureFeeling = 'comfortable';
      }
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
          console.log(`${person_comfort_num} ${person.country_region}`)
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
          pills = true;
        }

        if(pills) {
          resourcesFoods += 5;
          pickBestTeam()
          console.log(bestTeam.most_cooperative.traits.cooperative);
          pillsLasts--;
          //console.log(getCooperationScores(bestTeam));            
          if(pillsLasts > 0 ) {
            // config coop decrease to something feasible for "3" people
            $('.story').append("You stayed awake through the night, allowing yourself to sleep only for small stretches, each time feeling relieved to find your shelter warming as the sun rose. You let yourself find optimism in the chance that those who awake would start their day feeling comfort first before apprehension. At sunrise you began shoveling the pristine and powder white snow into large biodegradable sacs. These would go between the bodies, melt, and become tube-fed water sources for those sleeping. <p>The nanos have seen and known more lifetimes than you could ever conceive of. They know the interconnections and mechanics, the deep-rooted causes of arguments, of embittered rivalries that form over linguistic nuances, the mechanisms of insecurity and of coping. Their knowledge is vast and deep, and your intuition long gone. ");

            $('.story').append(`You daydream a little by yourself outside under the sun. Perhaps after the meal you will be able to really go outside for the first time as a group, in what feels like forever. Plant and harvest, fix and rebuild, cook and clean, and tell each other stories. Let yourselves get distracted by tracing the path of a leaf, led around by a warm, ${windDescription(windSpeed)}, loose and slow and open. You remember having been at a project where the people had built their homes out of shiny parts, and how the people marveled at the reflections when the days were bright. No one used their devices to remember anything, there would never be enough memory to hold all the strange and bizarre, the beautiful and the devastating scenes you would come to witness. You learned early on.`);

            $('.story').append(`<p>${bestTeam.most_cooperative.traits.firstname}${bestTeam.most_cooperative.traits.lastname} was the first to approach you, having heard you struggle to drag the first slumbering body across the crude floor.`);
            bestTeamBehaviors(bestTeam.most_cooperative, 0);
            $('.story').append(`Then, voices from from another corner: Are they dead? What did you do to them? `);
            bestTeamBehaviors(bestTeam.most_strong, 0);
            //, taking off the outer layer of their clothes and throwing them in a pile.

            // $('.story').append(`Then ${bestTeam.most_cooperative.traits.firstname}${bestTeam.most_cooperative.traits.lastname}, and then finally ${bestTeam.medium_dilligent.traits.firstname}${bestTeam.medium_dilligent.traits.lastname}`).

            
            bestTeamBehaviors(bestTeam.medium_dilligent, 0);
            
            $('.story').append(` ${bestTeam.most_cooperative.traits.firstname}${bestTeam.most_cooperative.traits.lastname} speaks with reassuring tones, no doubt honed over the decades, and calms everyone down. Including you. It's late now, and the sky gray again. But maybe everything is still possible.`);
            
            //The  , as long as some form of heating and hydration were provided.
            //${bestTeam.most_strong.traits.firstname}${bestTeam.most_strong.traits.lastname} from ${bestTeam.most_strong.country}, ${bestTeam.most_cooperative.traits.firstname}${bestTeam.most_cooperative.traits.lastname} ${bestTeam.most_cooperative.country}, and ${bestTeam.medium_dilligent.traits.firstname}${bestTeam.medium_dilligent.traits.lastname} from ${bestTeam.medium_dilligent.country}`
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

      
      
      function bestTeamBehaviors(bestTeamMember, state) {
        // states --
        // 0 : waking up
        // 1 : being told what's happening
        // 2 : helping or not helping
        // 3 : doing what's possible together or not

        console.log(bestTeamMember.traits.dexterous);
        console.log(bestTeamMember.traits.veteran);
       

          if(bestTeamMember.traits.veteran > 5 && bestTeamMember.traits.dexterous > 5) { 
            $('.story').append(`${bestTeamMember.traits.firstname}${bestTeamMember.traits.lastname} is a veteran of many projects past and has seen and been through everything, sighs, as if to question and accept your judgement in the same breath. `);
          } else if(bestTeamMember.traits.veteran > 5 && bestTeamMember.traits.dexterous < 5) {
            $('.story').append(`${bestTeamMember.traits.firstname}${bestTeamMember.traits.lastname} has been through these but still cant cope.`);
          } else if(bestTeamMember.traits.veteran < 5 && bestTeamMember.traits.dexterous < 5) {
            $('.story').append(` ${bestTeamMember.traits.firstname}${bestTeamMember.traits.lastname} stammered, eyes darting back and forth, possibly looking for a weapon. `); 
          }
        
        

        // if(bestTeamMember.traits.cooperative > 5) {
        //   $('.story').append(`At some point he is willing to help `);
        // } else {
        //   $('.story').append(`He is not willing to help `);
        // }

        // if(bestTeamMember.traits.sentimental > 5) {
        //  $('.story').append(`even though he is sentimental and misses the rest. Espcially this one.`);
        // } else {
        //   $('.story').append(`and he formed no attachments.`);
        // }

         


        // if(bestTeam.most_strong.traits.sentimental > 5) {
        //   console.log('the most strong is sentimental')
        // } else {
        //   console.log('the most strong is not sentimental')
        // } else if(bestTeam.most_strong.traits.cooperative > 5) {
        //   console.log('the most strong is not sentimental')
        // }
      }

      function pickBestTeam() {        
          
        var most_cooperative = _.max(_population, function(_population){ return _population.traits.dexterous; });
        var most_strong = _.max(_population, function(_population){ return _population.traits.strength; });
        var medium_dilligent = _population[3];
        var most_veteran = _.max(bestTeam, function(bestTeam){ return bestTeam.traits.veteran; });

        bestTeam.most_cooperative = most_cooperative;
        bestTeam.most_strong = most_strong;
        bestTeam.medium_dilligent = medium_dilligent;

        return bestTeam;
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

      function windDescription(_windSpeed) {
      // wind
        var windSpeed = _windSpeed;
        var windText;

        if (windSpeed < 1) {
          windText = "calmness in the air";
        } else if (windSpeed >= 1 && windSpeed < 3) {
          windText = "a little bit of stillness in the air";
        } else if (windSpeed >= 3 && windSpeed < 7) {
          windText = "light breeze rustles the corn stalks and " + config.THESAURUS.caress[_.random(0, config.THESAURUS.caress.length-1)] + " your face";
        } else if (windSpeed >= 7 && windSpeed < 12) {
          windText = `${config.THESAURUS.gentle[_.random(0, config.THESAURUS.gentle.length-1)]} breeze that causes detritus to scatter sounds of their previously liquid past`;
        } else if (windSpeed >= 12 && windSpeed < 18) {
          windText = "movement in the air that brings the smell of foods, sway small branches and your clothes";
        } else if (windSpeed >= 18 && windSpeed < 24) {
          windText = "fresh fast breeze that makes small bony twigs sway";
        } else if (windSpeed >= 25 && windSpeed < 38) {
          windText = 'strong breeze. Large tree branches are bent out of shape';
        } else if (windSpeed >= 39 && windSpeed <= 46) {
          windText = 'twigs and small branches are broken from trees and walking is difficult';
        }
        return windText;
      }


    });
    

  }
  
  
  
}

export default Region;