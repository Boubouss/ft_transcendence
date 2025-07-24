import { reRender } from "../render";

let index = 0;
let states: any[] = [];

export const resetStates = () => {
	index = 0;
	states = [];
};

export function useState<T>(initialValue: T): [T, (toSet: T) => void] {
	const currentIndex = index;

	if (!states[currentIndex]) {
		states[currentIndex] = JSON.parse(JSON.stringify(initialValue));
	}

	const setState = (newValue: T) => {
		// console.log("state: ", newValue);
		states[currentIndex] = JSON.parse(JSON.stringify(newValue));
		// console.log(states, currentIndex);
		index = 0;
		reRender();
	};

	const state = states[currentIndex];
	index++;

	return [state, setState];
}
