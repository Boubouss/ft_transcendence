import { reRender } from "../render";

let index = 0;
let states: any[] = [];

export function useState<T>(initialValue: T): [T, (toSet: T) => void] {
	const currentIndex = index;

	if (!states[currentIndex]) {
		states[currentIndex] = JSON.parse(JSON.stringify(initialValue));
	}

	const setState = (newValue: any) => {
		states[currentIndex] = JSON.parse(JSON.stringify(newValue));
		index = 0;
		reRender();
	};

	const state = states[currentIndex];
	index++;

	return [state, setState];
}
