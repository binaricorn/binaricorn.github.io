import './css/main.sass';
import $ from 'jquery';
import config from './config';
import World from './app/World';

const BIOME = {
  DESERT: {
    budget: 2000,
    temperature: [110,120],
    humidity: [-100, -20],
    waterCostMultiplier: 1.5,
    type: "desert",
    countries: ["Southwestern China", "Southeast Australia", "Pakistan", "Afghanistan", "Yemen", "Saudi Arabia", "Iraq", "Iran", "Texas, United States of America", "New Mexico, United States of America", "Southern California, United States of America"],
    objects: ["leathery earth", "gale of yellow sand", "quick evaporation of dew", "group of animal survivors dying under the shadeless sun", "sudden change in the wind's direction", "lizard drying up under the cloudless sky"],
    objects_wanted: ["balmy air", "swaying trees"],
    feeling_like: ["unbearably dry", "so brittle because no one was able to Sweat", "unbearably dry", "so brittle because no one was able to Sweat", "unbearably dry", "so brittle because no one was able to Sweat"]
  },
  TROPICAL: {
    budget: 1200,
    temperature: [80,110],
    humidity: [50, 100],
    waterCostMultiplier: 0.8,
    type: "tropical",
    countries: ["Bangladesh", "India", "Sierra Leone", "South Sudan", "Nigeria", "Chad", "Haiti", "Ethiopia", "Philippines", "Central African Republic", "Eritrea", "Bolivia"],
    objects: ["endless rain and moisture", "rain", "flood", "tears of Mother Earth", "destruction by water", "washing away of things"],
    objects_wanted: ["balmy air", "swaying trees"],
    feeling_like: ["so wet", "tired"]
  }
};
const REGIONS = [
  [BIOME.DESERT,  BIOME.TROPICAL]
];

// iraq
function darksky(){
    var apiKey = 'aa28b3a327af49fcad87d4454e1934b7';
    var url = 'https://api.darksky.net/forecast/';
    var lati = 40.7058316;
    var longi = -74.2581963;
    var data;
      $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
        var _windSpeed = data.currently.windSpeed;
        var _realFeelsTemp = data.currently.apparentTemperature;

        console.log(_windSpeed);
        windDescription(_windSpeed);
        realFeelsTempDescription(_realFeelsTemp);
        data.currently.apparentTemperature = data.currently.apparentTemperature.toFixed(0);
        $('.story > p.weather').append("She says that while the criminals were asleep, and their brains were getting filled with the Weathers from New York where it was <span class='highlight'>" + data.currently.apparentTemperature + "</span> degrees with a <span class='highlight'>" + windDescription(_windSpeed) + "</span>. <span class='highlight'>" + realFeelsTempDescription(_realFeelsTemp) + "</span>. I close my eyes and try to imagine what that feels like.");
        //return data.currently.apparentTemperature;
      });
}

function windDescription(windSpeed) {
  // wind
  var windSpeed = windSpeed;
  var windText;

  if (windSpeed < 1) {
    windText = "calmness in the air that made water feel like mirrors";
  } else if (windSpeed >= 1 && windSpeed < 3) {
    windText = "a little bit of stillness in the air";
  } else if (windSpeed >= 3 && windSpeed < 7) {
    windText = "light breeze that rustled the leaves, and caressed your face";
  } else if (windSpeed >= 7 && windSpeed < 12) {
    windText = "gentle breeze that caused leaves and small twigs move to move";
  } else if (windSpeed >= 12 && windSpeed < 18) {
    windText = "movement in the air that brought the smell of foods, swayed small branches and your clothes";
  } else if (windSpeed >= 18 && windSpeed < 24) {
    windText = "fresh fast breeze that made small trees sway";
  } else if (windSpeed >= 25 && windSpeed < 38) {
    windText = 'strong breeze. Large tree branches move,  telephone wires begin to "whistle", umbrellas are difficult to keep under control';
  } else if (windSpeed >= 39 && windSpeed <= 46) {
    windText = 'twigs and small branches are broken from trees, walking is difficult';
  }
  return windText;
}

function realFeelsTempDescription(realFeelsTemp) {
  var realFeelsTemp = realFeelsTemp;
  var realFeelsTempText;

  if (realFeelsTemp < 25) {
    realFeelsTempText = "Freezing";
  } else if (realFeelsTemp >= 26 && realFeelsTemp <= 40) {
    realFeelsTempText = "Chilly days that made you want to hug yourself tighter";
  } else if (realFeelsTemp >= 41 && realFeelsTemp <= 55) {
    realFeelsTempText = "Chilly af";
  } else if (realFeelsTemp >= 41 && realFeelsTemp <= 55) {
    realFeelsTempText = "Chilly af";
  } else if (realFeelsTemp >= 56 && realFeelsTemp <= 70) {
    realFeelsTempText = "Warm";
  } else if (realFeelsTemp >= 71 && realFeelsTemp <= 85) {
    realFeelsTempText = "Hot";
  } else if (realFeelsTemp >= 86 && realFeelsTemp <= 100) {
    realFeelsTempText = "Dying";
  }

  return realFeelsTempText;
}

darksky();

// at step xxx: i told her I already knew that part, that because she was getting old, her mind was getting  mushy. 
// at step xxx: ?

var world = new World(REGIONS);
world.run(config.DAYS);

