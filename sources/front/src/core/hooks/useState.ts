import {
  componentStates,
  currentStateId,
  currentComponentId,
  reRender,
  setCurrentStateId,
} from "../render";

export function useState(initialValue: any) {
  console.log(currentComponentId, currentStateId);
  if (!componentStates.has(currentComponentId)) {
    componentStates.set(currentComponentId, []);
  }

  const states = componentStates.get(currentComponentId);
  if (!states[currentStateId]) {
    states[currentStateId] = initialValue;
  }

  function setValue(newValue: any) {
    states[currentStateId] = newValue;
    reRender();
  }

  const state = states[currentStateId];
  setCurrentStateId(currentStateId + 1);

  return [state, setValue];
}
