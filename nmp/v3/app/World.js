import $ from 'jquery';
import _ from 'underscore';
import Region from './Region';

class World {
  constructor(grid) {
    this.regions = _.chain(grid)
      .flatten()
      .map(biome => new Region(biome, 7, {comfort: 1, control: 1})) // TODO TEMP
      .value();
  }

  step() {
    _.each(this.regions, r => r.step());
  }

  run(days) {
    _.each(_.range(days), i => {
      this.step();
    });
  }
}

export default World;