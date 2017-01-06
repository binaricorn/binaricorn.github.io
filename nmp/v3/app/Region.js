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
    this.past_weather = [{
      day: 1,
      apparentTemperature: 0,
      windSpeed: 0
    },
    {
      day: 2,
      apparentTemperature: 0,
      windSpeed: 0
    },
    {
      day: 3,
      apparentTemperature: 45,
      windSpeed: 12,
      cloudCover: 0.60
    },
    { 
      day: 4,
      apparentTemperature: 29,
      windSpeed: 9,
      cloudCover: 0.66
    },
    {
      day: 5,
      apparentTemperature: 29,
      windSpeed: 9,
      cloudCover: 0.66,
      precipType: 'snow',
      summary: 'Snow (under 1 in.) overnight.'
    }];
    // how to deal with the snow?
    this.cash = biome.budget;
    this.feature_threshold = 6;
    this.feature_threshold_highest = 8;
    this.planting = {
      countdown: _.random(3, 6),
      is_planting: false,
      is_harvesting: false
    };
    this.days = 0;
    this.resourceFoods = 17;
    
  }

  step() {
    this.days++;
    this.resourceFoods -= this.population.length; // at baseline, food is going bad. food is rationed so that no one eats when there is no food to conserve energy
    console.log(this.past_weather);

    _.each(this.population, (person, i) => {
      
      person.traits.firstname = config.NAMES[18-(i*2)];
      person.traits.lastname = config.NAMES[(i+2)*2];
      person.traits.strength = 9-(i*2);
      person.traits.bravery = i+2;
      person.traits.dilligence = i+1;
      person.traits.cooperative = i+1;
      person.traits.migration = i;
      person.traits.countries = i+2;
      person.features.height = i+2;
      person.features.face_blemishedness = i*3;
      person.features.sex = i*2;

      //console.log("original cooperativeness of person: " + person.traits.cooperative);

      
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

            // if(person.traits.bravery > feature_threshold) {
            //   person.traits.bravery = 'brave';
            // } else {     
            //   person.traits.bravery = 'cowardly';
            // }

            // if(person.traits.cooperative > feature_threshold) {
            //   person.traits.cooperative = 'community';
            // } else {
            //   person.traits.cooperative = 'individualistic';
            // }

            // if(person.traits.dilligence > feature_threshold) {
            //   person.traits.dilligence = 'hard-working';
            // } else {
            //   person.traits.dilligence = 'lazy';
            // }

            // if(person.traits.dexterous > feature_threshold) {
            //   person.traits.dexterous = 'flexible';
            // } else {
            //   person.traits.dexterous = 'stubborn';
            // }


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

           // console.log("person countries: " + person.country_region);
    });

    
    

    this.weatherStory(this.days, this.resourceFoods, this.planting, this.past_weather, this.population, this.biome, this.long_coord, this.lat_coord);
  }


  weatherStory(_days, _resourceFoods, _planting, _pastWeather, _population, _biome, _lati, _longi){

    
    var population_total_coop_score = 28;

    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    

    var data;
      $.getJSON(url + apiKey + "/" + _lati + "," + _longi + "?callback=?", function(data) {
        
        $('.story').append(`<h1>Days ${_days}</h1>`);

       // console.log(population_total_coop_score);
        
        var summary = data.currently.summary;
        var weekSummary = data.daily.summary;
        var apparentTemperature = data.currently.apparentTemperature;
        var apparentTemperatureFeeling;
        var cloudCover = data.currently.cloudCover;
        var precipProbability = data.currently.precipProbability;
        var precipType = data.currently.precipType;
        var precipProbabilityToday = data.daily.data[0].precipProbability;
        var precipTypeToday = data.daily.data[0].precipType;
        var summaryToday = data.daily.data[0].summary;
        var windSpeed = data.currently.windSpeed;
        
        var person_details_into_text = _population;
        //console.log(_population);
        
        
        console.log(data);

        

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
          apparentTemperatureFeeling = 'tolerable';
        }
        var solarPowerText = solarPower(cloudCover).text;
          
          var cc_population_total_coop_score = [];
          var temp_cooperative_score = 0;
          var person_comfort;
          var person_comfort_num;
          var person_comfort_text;

        _.each(person_details_into_text, (person, i) => { 

            person_comfort = person.comfort(apparentTemperature, person.country_region);
            person_comfort_num = person_comfort.num;
            person_comfort_text = person_comfort.text;
            console.log(`${person_comfort_text} ${person.country_region}`); 

            temp_cooperative_score = person.traits.cooperative;
            temp_cooperative_score += person_comfort_num;

            console.log("cooperativeness of person: " + temp_cooperative_score);
            
            cc_population_total_coop_score.push(temp_cooperative_score);

        });
          
          $('.story').append(`<p></p>`);

          cc_population_total_coop_score = _.reduce(cc_population_total_coop_score, function(memo, num){ return memo + num; }, 0);
          cc_population_total_coop_score = potential(cc_population_total_coop_score);
          console.log(cc_population_total_coop_score)

          var containsStory = _.contains(cc_population_total_coop_score, 'storytelling');
          var containsFooding = _.contains(cc_population_total_coop_score, 'fooding');
          var containsCooking = _.contains(cc_population_total_coop_score, 'cooking');
          var containsBuilding = _.contains(cc_population_total_coop_score, 'building');

          if(containsStory == true) {
            var sperson;
            var md = dexterousPerons();

            if(md.features.sex == 'female') {
              sperson = 'she';
            } else {
              sperson = 'he';
            }

              //.traits.firstname + most_dexterous_person.traits.lastname
            $('.story').append(`${md.traits.firstname}${md.traits.lastname} tells the story today. Up until this point, they speak very little about their lives. You strain to hear but can only catch every other word because of the heavy accent: ${sperson} brought this ${config.SOLAR_POWERED.name} all the way from home, an item passed down from family member to family member. Something about someone who ${config.THESAURUS.actions[_.random(0, config.THESAURUS.actions.length-1)]} ———— ${config.THESAURUS.actions[_.random(0, config.THESAURUS.actions.length-1)]} ———————— this or that ${config.THESAURUS.actions[_.random(0, config.THESAURUS.actions.length-1)]} and ${config.THESAURUS.actions[_.random(0, config.THESAURUS.actions.length-1)]} —— something or other. `); 
          }


          if(containsCooking) {
          } else {
            var md = dexterousPerons();
            $('.story').append(`The ${apparentTemperature} degree weather makes everyone ${config.THESAURUS.hesitant[_.random(0, config.THESAURUS.hesitant.length-3)]} and ${config.THESAURUS.hesitant[_.random(4, config.THESAURUS.hesitant.length-1)]} and no one wants to go outdoors, even though it is <span class="summary">${summary}</span> outside. Nothing gets cooked, but someone had the wisdom a few days ago to leave some ${config.FOODS.main[_.random(0, 2)]} and ${config.FOODS.main[_.random(3, config.FOODS.main.length-1)]} to dry and turn into vegetable leather. They dust off the snow and chew in silence, remembering parables of once ${config.THESAURUS.fertile[_.random(3, config.THESAURUS.fertile.length-1)]} lands. Did ${md.traits.firstname}${md.traits.lastname}'s ancestors great-grandparents, or their great-great-grandparents have an endless supply of ${config.FOODS.starches[_.random(0, config.FOODS.starches.length-1)]} to harvest with the ${config.SOLAR_POWERED.name}?<br><br>`);
          }

          
          if(containsBuilding) {
            $('.story').append(` The recruits are even feeling good enough with the weather to make much-needed repairs on their sustenance center. `);
          chargeTools(data.currently, config.WIND_POWERED);
          } else {
            $('.story').append(` No one gets up. `);
          }

          

          if(containsFooding) { // if there is enough cooperation to deal with the food. if the plants are already being grown, no need to grow more, so best to harvest and hunt and prepare the food. meanwhile food is being consumed the whole time.
            _planting.is_planting = true;
            var temp_resources = _population.length * 9;
            var val;
            

            if(_planting.is_planting == true) {
              console.log("planting");
               val = _resourceFoods + temp_resources;
               _planting.is_planting = false;
              
            }

            if(val < _population.length * 3 && _planting.is_planting == false) {
                console.log("need to plant now");
                val += temp_resources; 
                _planting.is_planting = true;
              }
            
          } else {
            // $('.story').append(`No ${config.THESAURUS.progress[_.random(4, config.THESAURUS.progress.length-1)]} on planting or harvesting either. `);
            $('.story').append(` Or leaves the room, other than to use the outhouse. `);
            chargeTools(data.currently, config.WIND_POWERED); 
          }
        
          $('.story').append(`<p></p>`);

          _.each(person_details_into_text, (person, i) => { 
            $('.story').append(`${person.traits.firstname}${person.traits.lastname}, `);  
          });
          
          $('.story').append(" the names remain on the walls. Someone has carved the scores from " +  "yesterday's game underneath, and they take on an eerie quality.");
          
          

          $('.story').append(`<br>---------------------------------------<br>`);
  
          function chargeTools(weather, tool) {
            console.log(weather);            

            if(weather.windSpeed > tool.threshold) {
              console.log(`wind power threshold passed`);
              $('.story').append(`The wind powered ${config.WIND_POWERED.tool} kicks, and the steam expands and fills up their little refuge, and a ${config.THESAURUS.caress[_.random(3, config.THESAURUS.caress.length-1)]} makes you instantly sleepy.`);
            } else {
              $('.story').append(`If only the wind powered ${tool.tool} kicked in, the steam could warm up their refuge. `);
            }
            console.log(weather.cloudCover);

            if(weather.cloudCover < config.SOLAR_POWERED.threshold) {
              $('.story').append(`The ${config.SOLAR_POWERED.name} was charged up from the previous ` +  "days' solar power, but there are not many trees left to fell and no one volunteers to help. ");
            }
            
          }

          function dexterousPerons() {
            var most_dexterous_person = _.max(_population, function(_population){ return _population.traits.dexterous; });
            return most_dexterous_person;
          }

          function potential(cc_population_total_coop_score) {
            console.log(cc_population_total_coop_score)

             var all_actions = [];
                all_actions = _.pairs(config.COSTS)
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

    function solarPower(_cloudCover) {
      var cloudCover = _cloudCover;
      var connectivity = {};

      if (cloudCover == 1) {
        connectivity.num = 0;
        connectivity.text = 'no';
      } else if (cloudCover <= 0.99 && cloudCover >= 0.7) {
        connectivity.num = 0.5;
        connectivity.text = 'low';
      } else  {
        connectivity.num = 1;
        connectivity.text = 'acceptable';
      }

      return connectivity;
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
        windText = "light breeze rustles<span class='hide-story'>the corn stalks and " + config.THESAURUS.caress[_.random(0, config.THESAURUS.caress.length-1)] + " your face</span>";
      } else if (windSpeed >= 7 && windSpeed < 12) {
        windText = `${config.THESAURUS.gentle[_.random(0, config.THESAURUS.gentle.length-1)]} breeze that causes brittle debris to scatter where there used to sit heavy and stubborn sheets of ice`;
      } else if (windSpeed >= 12 && windSpeed < 18) {
        windText = "wind that blows sand into your eyes and coats your clothes in dust";
      } else if (windSpeed >= 18 && windSpeed < 24) {
        windText = "fresh fast breeze that makes small bony twigs sway";
      } else if (windSpeed >= 25 && windSpeed < 38) {
        windText = 'strong breeze. Large tree branches are bent out of shape';
      } else if (windSpeed >= 39 && windSpeed <= 46) {
        windText = 'twigs and small branches are broken from trees and walking is difficult';
      }
      return windText;
    }

    
  }
  
  
}

export default Region;