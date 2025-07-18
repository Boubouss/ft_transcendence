import _ from "lodash";

type Callback = () => void | (() => void);

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
	while (_.first(effects)) {
		const cleanUp = effects.shift()!.callback();

		if (typeof cleanUp === "function") {
			cleanUp();
		}
	}
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

export function useEffect(callback: Callback, dependencies: any[]) {
	const effect = effects[index];

	if (!effect) {
		effects.push({
			callback,
			dependencies: JSON.parse(JSON.stringify(dependencies)),
		});

		callbacks.push(callback);
	} else if (!isDependenciesSame(effect, dependencies)) {
		effect.callback = callback;
		effect.dependencies = JSON.parse(JSON.stringify(dependencies));
		callbacks.push(callback);
	}

	index++;
}

export function handleEffects() {
	while (_.first(callbacks)) callbacks.shift()!();
}
