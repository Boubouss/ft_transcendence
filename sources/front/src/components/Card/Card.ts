import type { ComponentAttr, ComponentChildren } from "#core/framework.ts";
import { createElement } from "#core/render.ts";
import * as style from "./style";

const Card = (attr: ComponentAttr | null, ...children: ComponentChildren[]) => {
	const default_attr = { class: style.card_default };

	attr = { ...default_attr, ...attr };

	return createElement("div", attr, ...children);
};

export default Card;
