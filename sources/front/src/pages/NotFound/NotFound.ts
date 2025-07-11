import { createElement } from "#src/core/render.ts";

const NotFound = () => {
	return createElement("div", { id: "404" }, "Not Found sorry =)");
};

export default NotFound;
