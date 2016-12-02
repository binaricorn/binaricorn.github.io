const config = {
  COMFORTABLE_TEMPERATURE: [30, 50],
  AC_TEMPERATURE_EFFECT: -5,
  HEATING_TEMPERATURE_EFFECT: 6,
  WATER_TEMPERATURE_EFFECT: -5, // change these if you want different variance in text
  CONSCIOUS_PROB: 0.1,
  PLACE_COUNTER: 0,
  MACHINE_REPAIR_DAYS: [1,4],
  INCOME: [200,500],
  DAYS: 356,
  COSTS: {
    cooling: 100, 
    repair: 500,
    heating: 100,
    telecom: 800,
    water: 200
  },
  HTML_DIV: "region_day",
  CHILD_APPEARANCE: ["light-skinned", "cross-eyed", "barely-teenage", "pimply"],
  CHILD_MEMORIES: ["killing a neighbor over a dying cornfield, and the sound of a skull hitting the pavement", "an argument over rights to a well that later became a very dry burial ground", "theft of cooling units for a father's ailing health", "taking to the streets to protest the rise of food prices, aish, attacking a policeman", "taking and beating a child for bread", "forced confession"],
  CHILD_QUESTIONS: ["Did you ever think you weren't going to surive?", "Did you ever get bored?", "Did you Cover Girls start hating each other?", "Did you have nightmares?", "Did you ever want to just die and get it over with?", "Did you ever pray?"],
  FOOD_DANGER: ["meat", "rice", "wheat", "maize", "soy", "sugar cane", "potato"],
  CONFLICTS: ["a coup in a faraway place", "power change in the Bank", "factory explosions", "dictorial decision", "capitalism", "the North's rollercoaster economy"],
  BILLS: ["Paris Agreement", "C02 Emissions", "Paris Agreement", "C02 Emissions", "Paris Agreement", "NATO"],
  POLITICS: ["Avoidance", "Feigned Ignorance", "Extract and Exploit", "Progress First", "Escapism", "Localisms"],
}

export default config;
