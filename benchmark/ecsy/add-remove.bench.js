/* eslint-disable */
const {Component, System, Types, World, Not} = require("ecsy");

module.exports = {
  name: 'Add Remove',
  beforeAll(context) {
    context.world = new World();

    context.world
        .registerComponent(A)
        .registerComponent(B)
        .registerSystem(AddB)
        .registerSystem(RemoveB);

    for (let i = 0; i < 1000; i++) {
      context.world
        .createEntity()
        .addComponent(A);
    }
  },
  measure(context) {
    context.world.execute();
  },
};

class A extends Component {
  static schema = {};
}

class B extends Component {
  static schema = {};
}

class AddB extends System {
  static queries = {
    entities: { components: [A, Not(B)] },
  };

  execute() {
    this.queries.entities.results.forEach((entity) => {
      entity.addComponent(B);
    });
  }
}

class RemoveB extends System {
  static queries = {
    entities: { components: [B] },
  };

  execute() {
    this.queries.entities.results.forEach((entity) => {
      entity.removeComponent(B);
    });
  }
}
