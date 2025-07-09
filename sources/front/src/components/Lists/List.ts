import {
	createElement,
	type Component,
	type ComponentAttr,
} from "#src/core/framework";
import { list_default } from "./style";

const List = (
	props: {
		attr?: ComponentAttr;
	},
	model: (props?: any) => Component,
	childrens: any[]
) => {
	let { attr } = props;

	const default_attr = { class: list_default };

	attr = { ...default_attr, ...attr };

	return createElement("div", attr, ...childrens.map((child) => model(child)));
};

export default List;
