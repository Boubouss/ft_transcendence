import _ from "lodash";

type Callback = () => void;

type Effect = {
  dependencies: any[];
};

let index = 0;
const effects: Effect[] = [];
const callbacks: Callback[] = [];

export function resetEffectIndex() {
  index = 0;
}

export function resetEffects() {
  effects.splice(0, effects.length);
}

function isDependenciesSame(effect: Effect, dependencies: any[]) {
  if (dependencies.length !== effect.dependencies.length) {
    return false;
  } else if (
    JSON.stringify(dependencies) !== JSON.stringify(effect.dependencies)
  ) {
    return false;
  }

  return true;
}

export function useEffect(callback: () => void, dependencies: any[]) {
  const effect = effects[index];

  if (!effect) {
    effects.push({
      dependencies: JSON.parse(JSON.stringify(dependencies)),
    });

    callbacks.push(callback);
  } else if (!isDependenciesSame(effect, dependencies)) {
    effect.dependencies = JSON.parse(JSON.stringify(dependencies));
    callbacks.push(callback);
  }

  index++;
}

export function handleEffects() {
  for (let i = 0; i <= callbacks.length; i++) if (_.first(callbacks)) callbacks.shift()!();
}
