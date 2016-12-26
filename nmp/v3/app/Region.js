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
  }

  step() {
    
    this.weatherStory(this.population, this.biome, this.long_coord, this.lat_coord);
   // this.synonym();
  }


  weatherStory(_population, _biome, _lati, _longi){
    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    console.log(_biome);

    var data;
      $.getJSON(url + apiKey + "/" + _lati + "," + _longi + "?callback=?", function(data) {
        console.log(data);
        var summary = data.currently.summary;
        var apparentTemperature = data.currently.apparentTemperature;
        var apparentTemperatureFeeling;
        var cloudCover = data.currently.cloudCover;
        var precipProbability = data.currently.precipProbability;
        var precipProbabilityToday = data.daily.data[0].precipProbability;
        var precipTypeToday = data.daily.data[0].precipType;
        var summaryToday = data.daily.data[0].summary;
        var windSpeed = data.currently.windSpeed;

        var arraySummary = summary.split(" ");
        var arraySummaryToday = summaryToday.split(" ");
        var apiKey_thesaurus = 'cec24de13422f99ecbcda6603f345497';
        var url_thesaurus = 'http://words.bighugelabs.com/api/2/';
        var data_thesaurus;

        console.log(_population);
        var person_details_into_text = _population;

        // var population_total_coop_score;
        // var indv_total_coop_score;
        // var population_total_coop_array = [];
        // var temperature_feelings;

        var feature_threshold = 6;

        if (apparentTemperature <= 10 && apparentTemperature >= 28) {
          apparentTemperatureFeeling = config.COMFORTS[0];
        } else if (apparentTemperature >= 29 && apparentTemperature >= 46) {
          apparentTemperatureFeeling = config.COMFORTS[1];
        } else if (apparentTemperature >= 47 && apparentTemperature >= 59) {
          apparentTemperatureFeeling = config.COMFORTS[2];
        } else if (apparentTemperature >= 47 && apparentTemperature >= 59) {
          apparentTemperatureFeeling = config.COMFORTS[3];
        } else if (apparentTemperature >= 60 && apparentTemperature >= 74) {
          apparentTemperatureFeeling = config.COMFORTS[4];
        } else {
          apparentTemperatureFeeling = config.COMFORTS[5];
        }



        $('.story').append(`You wake again, welcomed by a morning in a place that could be . You hope this is the endpoint of your migration. You take in the sight of the others who ended up with you, as they also slowly awaken from sleep. You dont yet know their names.`);

        _.each(person_details_into_text, (person, i) => {
            if(person.features.height > feature_threshold) {
              person.features.height = 'tall';
            } else {
              person.features.height = 'short';
            }

            if(person.features.weight > feature_threshold) {
              person.features.weight = 'plump';
            } else {
              person.features.weight = 'thin';
            }

            if(person.features.hair_darkness > feature_threshold) {
              person.features.hair_darkness = 'brunette';
            } else {
              person.features.hair_darkness = 'blond';
            }

            if(person.features.skin_darkness > feature_threshold) {
              person.features.skin_darkness = 'tan';
            } else {
              person.features.skin_darkness = 'pale';
            }

            if(person.features.face_blemishedness > feature_threshold) {
              person.features.face_blemishedness = 'pimply';
            } else {
              person.features.face_blemishedness = 'smooth';
            }
        });

        _.each(person_details_into_text, (person, i) => {
          $('.story').append(`One is ${person.features.height}, ${person.features.weight}, ${person.features.hair_darkness}, ${person.features.skin_darkness}, and ${person.features.face_blemishedness}.`);
          console.log(person)
        });

        //console.log(person_details_into_text);  
          
          //person.deta

          // var indv_total_coop_score_text;
          // var indv_appearance_text = [];
          // var indv_height, indv_weight;
          // var indv_total_personality_score = [];
        //  console.log(person.comfort(apparentTemperature));

          
          // _.each(person.traits, (traits, j) => {
          //   indv_total_personality_score.push(traits)
          // });

          // indv_total_coop_score = indv_total_personality_score[0]; // 0 place is where that characteristic is

          // if (indv_total_coop_score <= 3) {
          //   indv_total_coop_score_text = 'angry and solitary. ';
          // } else if (indv_total_coop_score >= 7) {
          //   indv_total_coop_score_text = 'chatty and eager to start working. ';
          // } else {
          //   indv_total_coop_score_text = 'middle of the road and swayable. ';
          // }

          // population_total_coop_array.push(indv_total_coop_score);

          //var indv_appearance_text_array = []

          // _.each(person.features, (features, i) => {
          //   indv_appearance_text.push({
          //     name: i,
          //     value: features
          //   });
            //console.log(features);
            // if(j == 'height') {
            //   if(features > feature_threshold) {
            //     indv_appearance_text.push('tall');
            //   } else {
            //     indv_appearance_text.push('short');
            //   }
            // }
            // if(j == 'weight') {
            //   if(features > feature_threshold) {
            //     indv_appearance_text.push('plump');
            //   } else {
            //     indv_appearance_text.push('thin');
            //   }
            // }
            // if(j == 'hair_darkness') {
            //   if(features > feature_threshold) {
            //     indv_appearance_text.push('brunette');
            //   } else {
            //     indv_appearance_text.push('blond');
            //   }
            // }
           // console.log(`id: ${j} ${features}`);
           // $('.story').append(`person ${j}: ${indv_appearance_text}`);
           //   _.each(indv_appearance_text, (features_text, k) => {
           //    //$('.story').append(`${features_text}`);
           //    //thesaurus('One was ', `${features_text}`, '. ');
           //  });

      //    });



        


          //$('.story').append(`The ${indv_appearance_text} one seems ${indv_total_coop_score_text}`);
       

        

        // population_total_coop_score = _.reduce(population_total_coop_array, function(memo, num){ 
        //     return memo + num; }
        //   , 0)
        // population_total_coop_score = population_total_coop_score/100 + apparentTemperature/100;
        


        if (precipProbability > 0.2) arraySummary.push(precipTypeToday);
        //arraySummary.push(apparentTemperatureFeeling);
        //console.log(arraySummary);
        //console.log('It was shallowly ', thesaurus(arraySummary), '.');
     //   thesaurus('It was shallowly ', 'sad', '.');
        
        

        
    });
    function thesaurus(_stringBefore, _word, _stringAfter) {
      var apiKey_thesaurus = 'cec24de13422f99ecbcda6603f345497';
        var url_thesaurus = 'http://words.bighugelabs.com/api/2/';
        var w_array_length;
        var data_thesaurus;
            $.ajax({
              url: url_thesaurus + apiKey_thesaurus + "/" + _word + "/json",
              dataType: 'json',
              success: function(data_thesaurus) {
                for (var name in data_thesaurus) {
              //    console.log(`${_word}: ${data_thesaurus}`);
                  if (data_thesaurus.hasOwnProperty(name)) {
                    if (name == 'adjective') {
                      // some adjectives have small corpus
                      if(data_thesaurus.adjective.sim.length <= 1) {
                        data_thesaurus = data_thesaurus.adjective.syn[0];  
                      } else {
                        w_array_length = _.random(0, data_thesaurus.adjective.sim.length)
                        data_thesaurus = data_thesaurus.adjective.sim[w_array_length];  
                      }
                    } else if (name == 'noun') {
                      w_array_length = _.random(0, data_thesaurus.noun.syn.length);
                      data_thesaurus = data_thesaurus.noun.syn[0];
                    } else if (name == 'adverb') {
                      w_array_length = _.random(0, data_thesaurus.adverb.syn.length);
                      data_thesaurus = data_thesaurus.adverb.syn[w_array_length];
                    } else if (name == 'verb') { 
                      w_array_length = _.random(0, data_thesaurus.verb.syn.length);
                      data_thesaurus = data_thesaurus.verb.syn[w_array_length];
                    }
                  }                  
                }
                $('.story').append(`${_stringBefore} ${data_thesaurus}${_stringAfter}`);
                
              },
              error: function( req, status, err ) {
                console.log( 'something went wrong', status, err );
              }
            });
        

    
        
    }
  }




  

  poll_migration() {
    
   
    
  }
}

export default Region;