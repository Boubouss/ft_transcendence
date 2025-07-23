import _ from "lodash";
import { reRender } from "../render";
import { useEffect } from "./useEffect";

let index = 0;
let states: any[] = [];

export const resetStates = () => {
	index = 0;
	states = [];
};

export function useState<T>(
	initialValue: T,
	isConditional = false
): [T, (toSet: T) => void] {
	const currentIndex = index;

	if (!states[currentIndex]) {
		states[currentIndex] = JSON.parse(JSON.stringify(initialValue));
	}

	const setState = (newValue: T) => {
		states[currentIndex] = JSON.parse(JSON.stringify(newValue));
		index = 0;
		reRender();
	};

	if (isConditional) {
		useEffect(() => {
			setState(initialValue);
		}, []);
	}

	const state = states[currentIndex];
	index++;

	return [state, setState];
}
