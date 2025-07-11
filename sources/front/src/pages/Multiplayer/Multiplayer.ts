import { createElement } from "#core/framework.ts";
import { multi_background } from "./style";

const Multiplayer = () => {
	return createElement("div", { id: "multiplayer", class: multi_background });
};

export default Multiplayer;
