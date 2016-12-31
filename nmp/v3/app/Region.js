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
    this.machineBroken = false;
    this.machineRepairing = false;
    this.machineRepairCountdown = 0;
    this.resourcesFoods = config.FOODS;
    this.indv_coop_score;
    this.indv_total_personality_score = [];
    this.population_total_coop_array = [];
    this.population_total_coop_score;
    this.feature_threshold = 6;
    this.feature_threshold_highest = 8;
  }

  step() {
    //this.resources -= this.population.length; // one edible/drinkable resource for each person
    //var resources = [];
    this.resourcesFoods = config.FOODS.count -= this.population.length;

    
    var most_brave;


    _.each(this.population, (person, i) => {
      person.traits.bravery = i+2;
      person.traits.dilligence = i+1;
      person.traits.dexterous = i+1;
      person.traits.cooperative = i+1;
      person.traits.migration = i;
      console.log(person.traits.bravery)
      this.indv_total_personality_score.push(person.traits)
      this.indv_coop_score = this.indv_total_personality_score[i].cooperative;
      this.population_total_coop_array.push(this.indv_coop_score);
      // most_brave = _.max(person.traits, _.property('bravery'));
      
      // most_brave = _.sortBy(person.traits, function(item){
      //     return item.bravery;
      // });

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
    });
    this.population_total_coop_score = _.reduce(this.population_total_coop_array, function(memo, num){ return memo + num; }, 0)
    

    this.weatherStory(this.resourcesFoods, this.population, this.biome, this.long_coord, this.lat_coord);
  }


  weatherStory(resourcesFoods, _population, _biome, _lati, _longi){
    var _this_population_total_coop_score = this.potential(this.population_total_coop_score);

    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    
   

    console.log(_biome);

    var data;
      $.getJSON(url + apiKey + "/" + _lati + "," + _longi + "?callback=?", function(data) {
        console.log(data);
        
        var summary = data.currently.summary;
        var weekSummary = data.daily.summary;
        var apparentTemperature = data.currently.apparentTemperature;
        var apparentTemperatureFeeling;
        var cloudCover = data.currently.cloudCover;
        var precipProbability = data.currently.precipProbability;
        var precipProbabilityToday = data.daily.data[0].precipProbability;
        var precipTypeToday = data.daily.data[0].precipType;
        var summaryToday = data.daily.data[0].summary;
        var windSpeed = data.currently.windSpeed;

        // var arraySummary = summary.split(" ");
        // var arraySummaryToday = summaryToday.split(" ");
        var apiKey_thesaurus = 'cec24de13422f99ecbcda6603f345497';
        var url_thesaurus = 'http://words.bighugelabs.com/api/2/';
        var data_thesaurus;

        //console.log(_population);
        var person_details_into_text = _population;
        // var temperature_feelings;

        

        if (apparentTemperature <= 10 && apparentTemperature >= 28) {
          COMFORTS: ['hot', 'warm', 'comfortable', 'chilly', 'cold', 'freezing'],
          apparentTemperatureFeeling = 'bone-chilling subzeo'; //subzero
        } else if (apparentTemperature >= 29 && apparentTemperature <= 34) {
          apparentTemperatureFeeling = 'frigid';
        } else if (apparentTemperature >= 35 && apparentTemperature <= 46) {
          apparentTemperatureFeeling = 'freezing';
        } else if (apparentTemperature >= 42 && apparentTemperature <= 48) {
          apparentTemperatureFeeling = 'cold';
        } else if (apparentTemperature >= 49 && apparentTemperature <= 58) {
          apparentTemperatureFeeling = 'chilly'
        } else {
          apparentTemperatureFeeling = 'just fine';
        }



        $('.story').append(`Morning comes over the Alaskan horizon, ${apparentTemperature} degrees, ${apparentTemperatureFeeling} but with a ${windDescription(windSpeed)}. The others are slow to rise. Some still have not yet acclimated to the current migration location climate. But you, this has been your home. You look to them to see if work can be done, in the fields, and in the small makeshift factory for at the end of the day `); // new mercy parks?
        
        console.log(resourcesFoods);
        
          if (resourcesFoods > 0) {
            $('.story').append(` there will only be enough food for ${resourcesFoods - _population.length} people.`);  
          } else {
            $('.story').append(` there is no more food.`);  
          }

        $('.story').append(`<p>`);

        //$('.story').append(` all vague and nameless still. `);




          // if (indv_total_coop_score <= 3) {
          //   indv_total_coop_score_text = 'angry and solitary. ';
          // } else if (indv_total_coop_score >= 7) {
          //   indv_total_coop_score_text = 'chatty and eager to start working. ';
          // } else {
          //   indv_total_coop_score_text = 'middle of the road and swayable. ';
          // }


        _.each(person_details_into_text, (person, i) => {    
            person.traits.dilligence -= person.comfort(apparentTemperature, person.country_region); 

            // thesaurus(' ', person.features.height, ' while');
            // thesaurus(' ', person.features.weight, ', ');
            // thesaurus(' ', person.features.hair_darkness, ', ');
            // //thesaurus(' ', person.features.skin_darkness, ' while');
            // thesaurus(' ', person.features.face_blemishedness, ', ');

            // $('.story').append(`${person.features.height}, ${person.features.weight} one with the ${person.features.hair_darkness} hair from ${person.country}, `);
            if(person.traits.dilligence >= 1 && person.traits.cooperative <= 4) {
              $('.story').append(`${config.THESAURUS.negative[_.random(0, config.THESAURUS.negative.length-1)]} says the ${person.features.height} ${person.features.face_blemishedness} one from the ${person.country_region}, `);
            } else {
              $('.story').append(`${config.THESAURUS.affirmative[_.random(0, config.THESAURUS.affirmative.length-1)]} says the ${person.features.height} ${person.features.face_blemishedness} one from the ${person.country_region}, `);
              // thesaurus('', 'possible', ' says the ' + person.features.hair_darkness + ' one from the ' + person.country_region + ', ');
            }
            

        });
        console.log(_this_population_total_coop_score);

        
          

        
        
          var containsStory = _.contains(_this_population_total_coop_score, 'storytelling');
          var containsPlanting = _.contains(_this_population_total_coop_score, 'planting');

          //$('.story').append(`<p>then they turn to ask you a question with the same eyes.`); 
          
          // if (_this_population_total_coop_score.length == 1) {
          //   $('.story').append(`<br><br>you heave a sigh. Seems like only ${_this_population_total_coop_score} can be accomplished today.`);   
          // } else {
          //   $('.story').append(`<br><br>good news. Seems like`);
          //   _.each(_this_population_total_coop_score, (action, i) => {
          //     $('.story').append(` ${action},`);
          //   });
          //   $('.story').append(` are all possible.`);
          // }
          $('.story').append(`<br><br>`);

          if(containsStory == true) {
            $('.story').append(`a voice speaks telling a story of the ${config.MEMORIES[_.random(0,config.MEMORIES.length-1)]}.`);
          };

          if(containsPlanting == true) {

            $('.story').append(` Rakes, fashioned out of detritus from a more ${config.THESAURUS.fertile[_.random(0,config.THESAURUS.fertile.length-1)]} time, raised to meet the sun shine with the light of renewed agrarian ${config.THESAURUS.progress[_.random(0,config.THESAURUS.progress.length-1)]}. seeds into the ground, ${config.FOODS.main[_.random(0,config.FOODS.main.length-1)]} harvested, ${config.FOODS.starches[_.random(0,config.FOODS.starches.length-1)]} prepared. <p>`);
          };

          $('.story').append(`<br><br>`);

          
        

        

        

        //if (precipProbability > 0.2) arraySummary.push(precipTypeToday);
        
        
    });

    // function thesaurus(_stringBefore, _word, _stringAfter) {
    //   var apiKey_thesaurus = 'cec24de13422f99ecbcda6603f345497';
    //     var url_thesaurus = 'http://words.bighugelabs.com/api/2/';
    //     var w_array_length;
    //     var data_thesaurus;
    //         $.ajax({
    //           url: url_thesaurus + apiKey_thesaurus + "/" + _word + "/json",
    //           dataType: 'json',
    //           success: function(data_thesaurus) {
    //             for (var name in data_thesaurus) {
    //           //    console.log(`${_word}: ${data_thesaurus}`);
    //               if (data_thesaurus.hasOwnProperty(name)) {
    //                 if (name == 'adjective') {
    //                   // some adjectives have small corpus
    //                   if(data_thesaurus.adjective.sim.length <= 1) {
    //                     data_thesaurus = data_thesaurus.adjective.syn[0];  
    //                   } else {
    //                     w_array_length = _.random(0, data_thesaurus.adjective.sim.length)
    //                     data_thesaurus = data_thesaurus.adjective.sim[w_array_length];  
    //                   }
    //                 } else if (name == 'noun') {
    //                   w_array_length = _.random(0, data_thesaurus.noun.syn.length);
    //                   data_thesaurus = data_thesaurus.noun.syn[0];
    //                 } else if (name == 'adverb') {
    //                   w_array_length = _.random(0, data_thesaurus.adverb.syn.length);
    //                   data_thesaurus = data_thesaurus.adverb.syn[w_array_length];
    //                 } else if (name == 'verb') { 
    //                   w_array_length = _.random(0, data_thesaurus.verb.syn.length);
    //                   data_thesaurus = data_thesaurus.verb.syn[w_array_length];
    //                 }
    //               }                  
    //             }
    //             $('.story').append(`${_stringBefore} ${data_thesaurus}${_stringAfter}`);
                
    //           },
    //           error: function( req, status, err ) {
    //             console.log( 'something went wrong', status, err );
    //           }
    //         });
    // }

    function windDescription(_windSpeed) {
      // wind
      var windSpeed = _windSpeed;
      var windText;

      if (windSpeed < 1) {
        windText = "calmness in the air";
      } else if (windSpeed >= 1 && windSpeed < 3) {
        windText = "a little bit of stillness in the air";
      } else if (windSpeed >= 3 && windSpeed < 7) {
        windText = "light breeze that rustle the leaves, and caress your face";
      } else if (windSpeed >= 7 && windSpeed < 12) {
        windText = "gentle breeze that causes detritus to scatter sounds of their previously liquid past";
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

    
  }
  
  potential(_population_total_coop_score) {
   var all_actions = [];
      all_actions = _.pairs(config.COSTS)
      var possible_actions = [];
      var chosen_possible_actions = [];

      _.each(all_actions, (key, value) => {

        possible_actions = _.filter(key, function(action) {
          // first let's see if the people are even willing to work together
          if (_population_total_coop_score >= key[1]) {
            if(_.isString(action)) {
             chosen_possible_actions.push(action)
            }
          }
        });
      });

      return chosen_possible_actions;
  }
}

export default Region;