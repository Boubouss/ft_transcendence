import Friends from "#components/Friends/Friends.ts";
import { createElement } from "#core/render.ts";

const Local = () => {
	return createElement("div", {}, Friends());
};

export default Local;
