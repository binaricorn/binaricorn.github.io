import $ from 'jquery';
import _ from 'underscore';
import config from '../config';
import Warden from './Warden';

class Region {
  constructor(biome, populationSize, wardenPrefs) {
    this.biome = biome;

    this.cooling = 0;
    this.water = 0;
    this.heating = 0;
    this.telecom = 0;
    this.name = biome.type;
    this.countries = biome.countries;
    this.feeling_like = biome.feeling_like;
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
        feelsLike = this.feelsLikeTemp(temp, this.cooling, this.water, this.heating);
    return {
      temp: temp,
      humidity: this.todaysHumidity(),
      feelsLike: feelsLike,
      comfort: this.warden.comfort(feelsLike),
      n_conscious: this.nConscious
    };
  }

  writeStory() {    
    
    //$('.story').append("<div class='" + this.name + "'></div>")
    var counter = _.random(0, 5);

    $('.story').append(`She tells me to call her Grandma. In a place that could be <span class="highlight">${this.countries[counter]}</span> or <span class="highlight">${this.countries[counter+1]}</span> or <span class="highlight">${this.countries[counter+2]}</span>, <span class="hide-story">women known as the Cover Girls lived in towns called New Mercy Parks. They made
     Climate Simulation machines to bring peace and justice to the New World. These machines were made up of stuff like “data” and “models” of what the Weather was like before the Great Migration Northwards. There were the Cover Girls and the bad people. Then Grandma says the scientists of New York uploaded their memories into the machine so it could remember, and that bad people were trapped and sleeping inside the machines because they were criminals.</span>Those days were <span class="highlight">${this.today.temp} degrees</span> outside and <span class="highlight">${this.feeling_like[counter]}</span>.`);
      
      $('.story').append(`<p class='weather'></p>`);      

      // $('.story').append("<p>Sure, the region's collective vote in support of the " + config.POLITICS[config.PLACE_COUNTER] + " Party could be blamed. Or the abandonment of the " + config.BILLS[config.PLACE_COUNTER] + " that caused these lands to be laid to waste; we prepare the children so they don't think of Home like we do; of just " + this.biome.objects[config.PLACE_COUNTER] + ".");

      
   

    config.PLACE_COUNTER += 1;

    if (config.PLACE_COUNTER > this.biome.objects.length-2) {
      config.PLACE_COUNTER = 0;
    }
    
  }
    

  step() {
    // each step is a day
    this.today = this.newDay();
    this.writeStory();

   
    

    var breaks = this.machineBreaks(this.today.humidity, this.today.comfort);
    if (breaks && !this.machineBroken) {
      this.machineBroken = true;
      $('.story').append(`<p class="highlight bg">She say that sometimes the machine broke and the good people had to fix it because the criminals would wake up and remember all the bad things they did when they were living in the Old World. They would try to fight the machine and sometimes they were close to breaking it when they started ripping the wires out of their heads.</p>`);
      // $('.story').append(`They all knew leaks in memory would happen in the simulation engine in the form of stuttering pauses that could take days to repair. Some blamed the Outer Conditions; the ${this.biome.objects[config.PLACE_COUNTER+1]}. Some blamed each other.`);
    }

    var someoneWokeUp = false;

    if (this.machineBroken) {
      
      // some people become conscious when the machine breaks
      _.each(this.population, (person, i) => {
        if (Math.random() < config.CONSCIOUS_PROB && !person.conscious) {
          var random_child_memories = _.random(0, config.CHILD_MEMORIES.length-1);
          var random_child_appearance = _.random(0, config.CHILD_APPEARANCE.length-1);
          person.conscious = true;
          someoneWokeUp = true;
          
          $('.story').append(`Things like <span class="highlight">${config.CHILD_MEMORIES[random_child_memories]}.</span> `);
        }
      });

    // conscious people tell some unconscious people depending on the telecom of the region
      var awoken = _.filter(this.population, person => person.conscious),
          asleep = _.filter(this.population, person => !person.conscious);
      _.each(awoken, a => {
        _.each(asleep, a_ => {
          if (Math.random() < this.telecom/20) { // 20 is a arbitrary scaling value
            a_.conscious = true;
            someoneWokeUp = true;
           }
        });
      });


     if (this.machineRepairing) {
        // repair
        if (this.machineRepairCountdown > 0) {
          this.machineRepairCountdown--;
        }
        if (this.machineRepairCountdown <= 0) {
          
          $('.story').append(`<p>After some days the machine started working again.</p>`);
          _.each(this.population, (person, i) => {
            person.conscious = false;
          });
          this.machineBroken = false;
          this.machineRepairing = false;
          _.each(this.population, (person, i) => {
            person.conscious = false;
          });
        }
      }
    } 

    if (someoneWokeUp && this.nConscious <= this.today.n_conscious) {
      console.log('this shouldnt happen');
      $('.story').append("But sometimes they got scared over glitches in the system, where for a second, the bad guys would wake up like zombies then fall back asleep.");
    }

    if (this.nConscious <= this.today.n_conscious) {
      var random_payment = _.random(config.INCOME[0], config.INCOME[1]);
      var random_conflict = _.random(0, config.CONFLICTS.length-1);
      var random_payment_food = random_payment;
      this.cash += random_payment;

      $('.story').append("When the machine worked smoothly these criminals wouldn't be able to wake you up and cause you trouble. The Cover Girls who took care of the machine would get paid about <span class='highlight bg'>" + random_payment + "</span> American Dollars. Got you ");


      var foods_costs = _.zip(["bags of Synthetic casavas, potatos, and berry powder", "bags of wheat or rice", "special pills to help them Sweat"], [_.random(70, 120), _.random(50, 100), _.random(200, 300)]);

      var bought_food = {};
      while (random_payment_food > 0) {
        var affordable = _.filter(foods_costs, f => f[1] <= random_payment_food);
        if (affordable.length === 0) {
          break;
        }
        var food = _.sample(affordable),
            name = food[0],
            cost = food[1];
        random_payment_food -= cost;
        if (!(name in bought_food)) {
          bought_food[name] = 1;
        } else {
          bought_food[name]++;
        }
      }

      _.each(bought_food, (amount, name) => {
        $('.story').append(`<span class='highlight'>${amount} ${name}, </span>`);
      });

      $('.story').append(`and it was different every day because of the <span class='highlight bg'>${config.CONFLICTS[random_conflict]}</span>.`); 
      
    } else {
          $('.story').append(`<p class="highlight bg">Grandma says the bank didn’t give the good people food when the bad ones woke up.</p>`);
    }

    

    var toBuy = this.warden.decide();

    if (toBuy) {
      var body_feelings_text = "they used some of the machine's powers so they could sleep better."

      if (this.today.comfort < 0.80) {
        if (toBuy.name == "cooling") {
          body_feelings_text = "they used some of the machine's powers for themselves so they could get a little asleep.";  //very uncomfortable without ac
        } else if (toBuy.name == "repair") {
          body_feelings_text = "they did it for the common good, even if they were so uncomfortable they couldn't fall asleep.";  //very uncomfortable but need to buy repair
        } else if (toBuy.name == "water") {
          body_feelings_text = "they had to boil their pee and drink it they couldn't speak out loud their throats were so dry.";  //very uncomfortable without water
        }
      } else if (this.today.comfort >= 0.80 && this.today.comfort <= 0.95) {
        if (toBuy.name == "cooling") {
          body_feelings_text = "they all tried to persuade each other they needed it even if they really didn't."; //comfortable
        } else if (toBuy.name == "repair") {
          body_feelings_text = "then of course they would fix it.";
        }
      } 

    if (toBuy.name == "repair") {
      //$('.story').append(`Getting the machine fixed is no trivial matter. It takes lots of things.`);
    }

    $('.story').append(`<p>At the end of the day the Cover Girls would always decide on the best way to spend the <span class='highlight bg'>${this.cash}</span> Dollars they had. Inside the Park it was ${this.today.feelsLike} degrees. If they agreed <span class='highlight bg'>${toBuy.name}</span> made the most sense, <span class='highlight bg'>${body_feelings_text}</span> She said every day was like this. <span class='highlight bg'>${config.CHILD_QUESTIONS[config.PLACE_COUNTER]}</span> Yes, she says, <em>they</em> probably did. But it was important, and so like this it went on and on.</p><h2>The sound of a <span class='highlight bg'>${this.biome.objects[config.PLACE_COUNTER]}</span> lulls me to sleep, and I dream of <span class="highlight">${config.CHILD_MEMORIES[config.PLACE_COUNTER]}, and an old woman.</span></h2>`);  

    _.extend(this, this.successor(toBuy));

    }
  
  }

  successor(action) {
    var nextState = _.clone(this);
    switch (action.name) {
        case 'cooling':
          nextState.cooling++;
          break;
        case 'water':
          nextState.water++;
          break;
        case 'telecom':
          nextState.telecom++;
          break;
        case 'heating':
          nextState.heating++;
          break;
        case 'repair':
          if (nextState.machineBroken) {
            nextState.machineRepairing = true;
            nextState.machineRepairCountdown = _.random(config.MACHINE_REPAIR_DAYS[0], config.MACHINE_REPAIR_DAYS[1]) * 1/nextState.today.comfort;
          }
          break;
    }
    var feelsLike = this.feelsLikeTemp(nextState.today.temp, nextState.cooling, nextState.water, nextState.heating);
    nextState.today.comfort = this.warden.comfort(feelsLike);
    nextState.cash -= action.cost;
    return nextState;
  }

  feelsLikeTemp(temperature, cooling, water, heating) {
    return temperature + (cooling * config.AC_TEMPERATURE_EFFECT) + (water * config.WATER_TEMPERATURE_EFFECT) + (heating * config.HEATING_TEMPERATURE_EFFECT);
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
