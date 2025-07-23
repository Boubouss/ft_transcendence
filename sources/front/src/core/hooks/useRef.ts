import { useState } from "./useState";

export function useRef(init: any): { current: any } {
	const [state, _] = useState({ current: init });

	return state;
}
