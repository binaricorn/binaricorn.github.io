const config = {
  WINTER_TEMPERATURE: [50, 60],
  SUMMER_TEMPERATURE: [81, 110],
  COSTS: {
  	cooking: 15,
    planting: 25,
  	storytelling: 10,
  	building: 35,
    migrating: 60
  },
  RESOURCES: {
    food: 10,
    home: 50,
    research: 0
  },
  FOODS: {
    starches: ['casava', 'potato', 'wheat'],
    main: ['beans', 'berries', 'rice', 'casava', 'carrots', 'cauliflower', 'broccoli'],
    hunt: ['fish', 'birds']
  },
  COMFORTS: ['hot', 'warm', 'comfortable', 'chilly', 'cold', 'freezing'],
  MEMORIES: ["killing a neighbor over a dying cornfield, and the sound of a skull hitting the pavement", "an argument over rights to a well that later became a very dry burial ground", "theft of cooling units for a father's ailing health", "taking to the streets to protest the rise of food prices, aish, attacking a policeman", "taking and beating a child for bread", "forced confession"],
  TUNDRA_COUNTRIES: ["Alaska", "Canada", "Greenland"],
  DESERT_COUNTRIES: ["Southwestern China", "Southeast Australia", "Pakistan", "Afghanistan", "Yemen", "Saudi Arabia", "Iraq", "Iran", "Texas, United States of America", "New Mexico, United States of America", "Southern California, United States of America"],
  TROPICAL_COUNTRIES: ["Bangladesh", "India", "Sierra Leone", "South Sudan", "Nigeria", "Chad", "Haiti", "Ethiopia", "Philippines", "Central African Republic", "Eritrea", "Bolivia"],
  THESAURUS: {
    progress: ['advancement', 'betterment', 'breakthroughs', 'development', 'enrichment'],
    fertile: ['ample', 'bountiful', 'copious', 'development', 'generous', 'rich', 'lavish'],
    affirmative: ['affirmative', 'amen', 'fine', 'gladly', 'granted', 'by all means', 'positively'],
    negative: ['maybe', 'by no means', 'probably not', 'not today']

  }
}

export default config;