import {
	createElement,
	type Component,
	type ComponentAttr,
} from "#core/framework";
import { useRef } from "#core/hooks/useRef.ts";
import _ from "lodash";
import { input_default, label_default } from "./style";

const Input = (
	props: { attr: ComponentAttr; labelAttr?: ComponentAttr },
	...children: Component[]
) => {
	let { attr, labelAttr } = props;

	const ref = useRef(null);

	const default_attr = {
		ref,
		value:
			typeof ref.current !== "undefined" && ref.current !== null
				? ref.current.value
				: "",
		class: input_default,
	};
	const default_label_attr = { class: label_default };

	attr = { ...default_attr, ...attr };
	labelAttr = { ...default_label_attr, ...labelAttr };

	return createElement(
		"label",
		labelAttr,
		createElement("input", attr),
		...children
	);
};

export default Input;
