type Callback = () => void;

type Effect = {
  callback: Callback;
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
    effects.push({ callback, dependencies });
    callbacks.push(callback);
  } else if (!isDependenciesSame(effect, dependencies)) {
    effect.dependencies = dependencies;
    callbacks.push(effect.callback);
  }

  index++;
}

export function handleEffects() {
  let begin = 0;
  const end = callbacks.length - 1;

  while (begin++ < end) callbacks.shift()!();
}
