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

    _.each(this.population, (person, i) => {

      person.traits.bravery = i+2;
      person.traits.dilligence = i+1;
      person.traits.dexterous = i+1;
      person.traits.cooperative = i+1;
      person.traits.migration = i;
      person.traits.countries = i+2;

      person.features.height = i+2;
      person.features.face_blemishedness = i*3;

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

    
    

    this.weatherStory(this.days, this.resourceFoods, this.planting, this.population, this.biome, this.long_coord, this.lat_coord);
  }


  weatherStory(_days, _resourceFoods, _planting, _population, _biome, _lati, _longi){

    
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

        console.log(solarPower(cloudCover));
        
        
        

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

        function precip() {
          if(precipProbabilityToday > 0) {
            return "If luck is on your side, there may still be " + precipTypeToday + " for the garden";
          } else {
            return "If there is no rain, the vegetation would take longer to harvest. Moral would be low";
          }
        }


        $('.story').append(`<span class='hide-story'>Today feels like a </span>${apparentTemperature} degrees and <span class='summary'>${summary}</span>, your <span class='hide-story'>no longer sentient but still-functional</span> device displays<span class='hide-story'>on its cracked and dusty screen. You close your eyes against the ${config.THESAURUS.bright[_.random(0,config.THESAURUS.bright.length-1)]} sky of the Alaskan horizon</span>. ${precip()}. A ${windDescription(windSpeed)}. <span class='hide-story'>The device continues to remind you how far away you are from home and stutters attempting to figure out the fastest route from the Park to here. The others are slow to rise. Some still have not yet acclimated to the current migration location climate. But you, you have gotten used to your new home, and immediately go check on the supplies. </span><p>The crowd: <span class='hide-story'>sentiment gauge is not an option with such low connectivity, but no need to shout either, as the sustenance project is so small and makeshift. You tell the recruits that</span>`); // new mercy parks?
        
          // $('.story').append(`Given the  and <span class='summary'>${summary}</span> state of the weather, `);
        
        
          // if (resourcesFoods > 0) {
          //   $('.story').append(` there will only be enough food for ${resourcesFoods - _population.length} more meals`);  
          // } else {
          //   $('.story').append(` there is no more food left`);  
          // }

        //$('.story').append(`, and call for a simple majority vote:<p>`);

          
          var cc_population_total_coop_score = [];
          var temp_cooperative_score = 0;
          var person_comfort;
          var person_comfort_num;
          var person_comfort_text;

        _.each(person_details_into_text, (person, i) => {  
          console.log(person.features);
            person_comfort = person.comfort(apparentTemperature, person.country_region);
            person_comfort_num = person_comfort.num;
            person_comfort_text = person_comfort.text;
            console.log(`${person_comfort_text} ${person.country_region}`); 

            temp_cooperative_score = person.traits.cooperative;
            temp_cooperative_score += person_comfort_num;
            
            $('.story').append(`the one from the ${person.country_region} `);

            if(person_comfort_num < 1) {
              $('.story').append(`${config.THESAURUS.complain[_.random(0,config.THESAURUS.complain.length-1)]}` + "s it's too " + `${person_comfort.text}, `);
            } else {
              $('.story').append(`${config.THESAURUS.say[_.random(0,config.THESAURUS.say.length-1)]}` + "s says it's " + `${person_comfort.text}, `); 

              if(person.traits.dilligence >= 1 && temp_cooperative_score <= 4.9) {
                $('.story').append(` and is ${config.THESAURUS.eager[_.random(0,config.THESAURUS.eager.length-1)]} for renewed agrarian ${config.THESAURUS.progress[_.random(0,config.THESAURUS.progress.length-1)]}, `);
              } else {
                $('.story').append(` that work is work, `);
              }
            }
            
            

            // console.log("cooperativeness of person: " + temp_cooperative_score);
            
            // if(person.traits.dilligence >= 1 && temp_cooperative_score <= 4.9) {
            //   $('.story').append(`the <span class='hide-story'>${person.features.height} ${person.features.face_blemishedness}</span> one from the ${person.country_region} looks ${config.THESAURUS.hesitant[_.random(0, config.THESAURUS.hesitant.length-1)]}, `);
            // } else {
            //   $('.story').append(`the <span class='hide-story'>${person.features.height} ${person.features.face_blemishedness}</span> one from the ${person.country_region} looks ${config.THESAURUS.eager[_.random(0, config.THESAURUS.eager.length-1)]}, `);
            // }
            
            cc_population_total_coop_score.push(temp_cooperative_score);

        });
          

          cc_population_total_coop_score = _.reduce(cc_population_total_coop_score, function(memo, num){ return memo + num; }, 0);
          cc_population_total_coop_score = potential(cc_population_total_coop_score);
          console.log(cc_population_total_coop_score)

          var containsStory = _.contains(cc_population_total_coop_score, 'storytelling');
          var containsFooding = _.contains(cc_population_total_coop_score, 'fooding');
          var containsCooking = _.contains(cc_population_total_coop_score, 'cooking');
          var containsBuilding = _.contains(cc_population_total_coop_score, 'building');

          if(containsCooking == true) {
            
             $('.story').append(` but after awhile a ${_population[3].features.face_blemishedness}-faced newcomer prepares the ${config.FOODS.starches[_.random(0,config.FOODS.starches.length-1)]}<span class='hide-story'>harvested yesterday</span> over a fire, `); 
          }

          if(containsStory == true) {
            $('.story').append(` and stories of ${config.MEMORIES[_.random(0,config.MEMORIES.length-1)]} <span class='hide-story'> that would</span>provide entertainment for the entire day.`);
          }

          if(containsBuilding == true) {
            $('.story').append(` The recruits are even feeling good enough with the weather to make much-needed repairs on their sustenance center. `);
          }

          

          if(containsFooding == true) { // if there is enough cooperation to deal with the food. if the plants are already being grown, no need to grow more, so best to harvest and hunt and prepare the food. meanwhile food is being consumed the whole time.
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
            
          }
            
            $('.story').append(` The rest eat <span class='hide-story'>and </span>the <span class='hide-story'>grips of ambivalence seems to releases a few of them. Theysow the seeds, harvest the ripe </span>${config.FOODS.main[_.random(0,config.FOODS.main.length-1)]}. <span class='hide-story'>Farm implements, scavenged out of whatever detritus remained from a more ${config.THESAURUS.fertile[_.random(0,config.THESAURUS.fertile.length-1)]} time, raise to meet the ${config.THESAURUS.bright[_.random(0,config.THESAURUS.bright.length-1)]} clouds. with the light of renewed agrarian ${config.THESAURUS.progress[_.random(0,config.THESAURUS.progress.length-1)]}<span>.`); 
            $('.story').append(`Remaining from the harvest are ${val} total items of `);

          _.each(config.FOODS.main, (item, i) => {
            $('.story').append(`${item}, `);
          });
          _.each(config.FOODS.hunt, (item, i) => {
            $('.story').append(`${item}, `);
          });
          $('.story').append(` and after all is done, <p>you allow yourself to wonder: who were they before all this? How did they end up here?`);
            
          //}

          
          
          

          //console.log(_population);

          $('.story').append(`<br>---------------------------------------<br>`);



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
        windText = "a wind that blows sand into your eyes and coats your clothes in dust";
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