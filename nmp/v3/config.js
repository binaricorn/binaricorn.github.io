const config = {
  DAYS: 7,
  WINTER_TEMPERATURE: [50, 60],
  SUMMER_TEMPERATURE: [81, 110],
  COSTS: {
  	cooking: 14,
    fooding: 14.5,
  	storytelling: 15,
  	building: 14.8,
    migrating: 98
  },
  FOODS: {
    count: 35,
    starches: ['casava', 'potato', 'wheat', 'rice'],
    main: ['beans', 'berries', 'casava', 'carrots', 'cauliflower', 'broccoli'],
    hunt: ['fish', 'birds']
  },
  SOLAR_POWERED: {
    tool: 'chainsaw',
    name: 'Oregon 40-Volt Battery Powered Chainsaw',
    power: 'solar',
    threshold: 0.7
  },
  WIND_POWERED: {
    tool: 'heater',
    name: 'heater',
    power: 'wind',
    threshold: 7
  },
  MEMORIES: ["broken noses over a dying cornfield", "how to make water last", "day the United States backed out of the Paris Agreement, and the bloody riots afterwards", "learning how to count with your own ribcage", "running water and dental hygiene"],
  TUNDRA_COUNTRIES: ["Iceland", "Quebec", "Greenland"],
  DESERT_COUNTRIES: ["Kazakhstan", "Pakistan", "Afghanistan", "Yemen", "Saudi Arabia", "Iraq", "Iran", "Texas, United States of America", "New Mexico, United States of America", "Southern California, United States of America"],
  TROPICAL_COUNTRIES: ["Bangladesh", "India", "Sierra Leone", "South Sudan", "Nigeria", "Chad", "Haiti", "Ethiopia", "Philippines", "Central African Republic", "Eritrea", "Bolivia"],
  NAMES: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Y'],
  THESAURUS: {
    progress: ['advancement', 'betterment', 'breakthroughs', 'development', 'enrichment', 'progress', 'evolution', 'momentum', 'stride'],
    gentle: ['benign', 'moderate', 'tender', 'mellow', 'placid', 'genial', 'gentle'],
    fertile: ['ample', 'bountiful', 'copious', 'generous', 'rich', 'lavish', 'fertile'],
    affirmative: ['affirmative', 'amen', 'fine', 'gladly', 'granted', 'by all means', 'positively', 'yes'],
    fine: ['OK', 'alright', 'no problem'],
    eager: ['eager', 'keen', 'fervent', 'dedicated', 'impatient', 'ready', 'intent'],
    negative: ['maybe', 'by no means', 'probably not', 'not today'],
    hesitant: ['halting', 'doubtful', 'indecisive', 'reluctant', 'hesitant', 'skeptical', 'unwilling'],
    caress: ['pets', 'kisses', 'strokes', 'embraces', 'like a vapor of smoke, envelops', 'caresses'],
    bright: ['shadeless', 'bright', 'piercing', 'merciless', 'cold', 'bright but listless', 'terse', 'oppressive'],
    complain: ['gripe', 'oppose', 'protest', 'fret', 'nag', 'object', 'moan'],
    say: ['announce', 'claim', 'declare', 'mention', 'communicate', 'say'],
    actions: ['jumped', 'climbed', 'lost', 'killed', 'died', 'continued', 'won', 'cried', 'laughed', 'took', 'returned', 'cut', 'built', 'sunk', 'drowned', 'starved']
  }
}

export default config;