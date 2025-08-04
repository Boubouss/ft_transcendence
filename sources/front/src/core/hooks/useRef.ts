import { useState } from "./useState";

export interface Ref<T> {
	current: T;
}

export function useRef<T>(init: T): Ref<T> {
	const [state, _] = useState({ current: init });

	return state;
}
