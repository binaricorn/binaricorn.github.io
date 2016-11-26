const config = {
  COMFORTABLE_TEMPERATURE: [30, 50],
  AC_TEMPERATURE_EFFECT: -10,
  WATER_TEMPERATURE_EFFECT: -20,
  CONSCIOUS_PROB: 0.1,
  PLACE_COUNTER: 0,
  // generate text for each of these variables
  MACHINE_REPAIR_DAYS: [1,4],
  INCOME: [100,800],
  DAYS: 356,
  COSTS: {
    ac: 300, //each of these get text descriptions?
    repair: 500,
    telecom: 800,
    water: 400
  },
  HTML_DIV: "region_day",
  CHILD_APPEARANCE: ["light-skinned man", "cross-eyed woman", "barely-teenage boy", "pimply young adult"],
  CHILD_MEMORIES: ["murdering a neighbor over a dying cornfield, and the sound of a skull hitting the pavement", "abduction", "terrorism", "abject sins", "cruelty", "forced confession"],
  FOOD_DANGER: ["meat", "rice", "wheat", "maize", "soy", "sugar cane", "potato"],
  CONFLICTS: ["a coup in a faraway place", "power change in the Bank", "factory explosions", "dictorial decision", "capitalism", "consumerism"],
  BILLS: ["Paris Agreement", "C02 Emissions", "Paris Agreement", "C02 Emissions", "Paris Agreement", "NATO"],
  POLITICS: ["Avoidance", "Feigned Ignorance", "Extract and Exploit", "Progress First", "Escapism", "Localisms"]

}

export default config;
