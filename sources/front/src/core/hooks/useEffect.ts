import _ from "lodash";

type CleanUp = () => void;
type Callback = () => void | CleanUp;

type Effect = {
  dependencies: any[];
};

let index = 0;
const effects: Effect[] = [];
const callbacks: Callback[] = [];
const cleanUps: CleanUp[] = [];

export function resetEffectIndex() {
  index = 0;
}

export function resetEffects() {
  effects.splice(0, effects.length);

  while (_.first(cleanUps)) cleanUps.shift()!();
}

function isDependenciesSame(effect: Effect, dependencies: any[]) {
  if (dependencies.length !== effect.dependencies.length) return false;

  return _.isEqual(dependencies, effect.dependencies);
}

export function useEffect(callback: () => void, dependencies: any[]) {
  const effect = effects[index];

  if (!effect) {
    effects.push({
      dependencies: _.cloneDeep(dependencies),
    });

    callbacks.push(callback);
  } else if (!isDependenciesSame(effect, dependencies)) {
    effect.dependencies = _.cloneDeep(dependencies);
    callbacks.push(callback);
  }

  index++;
}

export function handleEffects() {
  while (_.first(callbacks)) {
    const cleanUp = callbacks.shift()!();

    if (typeof cleanUp === "function") {
      cleanUps.push(cleanUp);
    }
  }
}
