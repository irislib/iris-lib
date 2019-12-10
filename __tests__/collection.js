/**
  @jest-environment node
*/
const Collection = require(`collection.js`);
const Gun = require(`gun`);
const open = require(`gun/lib/open`);

class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  serialize() {
    return {name: this.name, species: this.species};
  }

  static deserialize(data) {
    return new Animal(data.name, data.species);
  }
}

describe(`Collection`, () => {
  test(`write & read`, (done) => {
    const gun = new Gun();
    const animals = new Collection({gun, class: Animal, indexes: ['name', 'species']});
    animals.put(new Animal('Moisture', 'cat'));
    animals.put(new Animal('Petard', 'cat'));
    animals.put(new Animal('Pete', 'cat'));
    animals.put(new Animal('Oilbag', 'cat'));
    animals.put(new Animal('Scumbag', 'dog'));
    animals.put(new Animal('Deadbolt', 'parrot'));
    let timesCalled = 0;
    function callback(animal) {
      console.log('got', animal);
      if (timesCalled++ === 5) {
        done();
      }
    }
    animals.get({callback});
  });
});
