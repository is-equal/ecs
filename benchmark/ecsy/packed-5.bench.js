/* eslint-disable */
const {Component, System, Types, World} = require("ecsy");

module.exports = {
    name: 'Packed 5',
    beforeAll(context) {
        context.world = new World();

        context.world
            .registerComponent(A)
            .registerComponent(B)
            .registerComponent(C)
            .registerComponent(D)
            .registerComponent(E);
        context.world
            .registerSystem(ASystem)
            .registerSystem(BSystem)
            .registerSystem(CSystem)
            .registerSystem(DSystem)
            .registerSystem(ESystem);

        for (let i = 0; i < 1000; i++) {
            context.world
                .createEntity()
                .addComponent(A, {value: 0})
                .addComponent(B, {value: 0})
                .addComponent(C, {value: 0})
                .addComponent(D, {value: 0})
                .addComponent(E, {value: 0});
        }
    },
    measure(context) {
        context.world.execute();
    }
};

class A extends Component {
    static schema = {
        value: {type: Types.Number},
    };
}

class B extends Component {
    static schema = {
        value: {type: Types.Number},
    };
}

class C extends Component {
    static schema = {
        value: {type: Types.Number},
    };
}

class D extends Component {
    static schema = {
        value: {type: Types.Number},
    };
}

class E extends Component {
    static schema = {
        value: {type: Types.Number},
    };
}

class ASystem extends System {
    static queries = {
        entities: {components: [A]},
    };

    execute() {
        this.queries.entities.results.forEach((entity) => {
            entity.getMutableComponent(A).value *= 2;
        });
    }
}

class BSystem extends System {
    static queries = {
        entities: {components: [B]},
    };

    execute() {
        this.queries.entities.results.forEach((entity) => {
            entity.getMutableComponent(B).value *= 2;
        });
    }
}

class CSystem extends System {
    static queries = {
        entities: {components: [C]},
    };

    execute() {
        this.queries.entities.results.forEach((entity) => {
            entity.getMutableComponent(C).value *= 2;
        });
    }
}

class DSystem extends System {
    static queries = {
        entities: {components: [D]},
    };

    execute() {
        this.queries.entities.results.forEach((entity) => {
            entity.getMutableComponent(D).value *= 2;
        });
    }
}

class ESystem extends System {
    static queries = {
        entities: {components: [E]},
    };

    execute() {
        this.queries.entities.results.forEach((entity) => {
            entity.getMutableComponent(E).value *= 2;
        });
    }
}
