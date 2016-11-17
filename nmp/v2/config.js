const config = {
  COMFORTABLE_TEMPERATURE: [50, 80],
  AC_TEMPERATURE_EFFECT: -10,
  HEATING_TEMPERATURE_EFFECT: 10,
  CONSCIOUS_PROB: 0.1,
  // generate text for each of these variables
  MACHINE_REPAIR_DAYS: [4,10],
  INCOME: [100,800],
  DAYS: 40,
  COSTS: {
    ac: 300,
    heating: 300,
    repair: 500,
    telecom: 800,
    water: 400
  },
  HTML_DIV: "region_day"
}

export default config;
