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
    states[currentIndex] = initialValue;
  }

  // console.log(states);

  const setState = (newValue: T) => {
    states[currentIndex] = newValue;
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
