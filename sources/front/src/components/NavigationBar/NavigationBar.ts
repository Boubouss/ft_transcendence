import { createElement, type ComponentAttr } from "#core/framework.ts";
import { useLanguage } from "#hooks/useLanguage";
import type { User } from "#types/user.ts";
import Button from "../Buttons/Button";
import { btn_modal } from "../Buttons/style";
import DropdownUser from "../Dropdowns/DorpdownUser/DropdownUser";
import DropdownLang from "../Dropdowns/DropdownLang/DropdownLang";
import { navbar_default } from "./style";

const NavigationBar = (props: {
	userState: { user: User | null; setUser: (toSet: User | null) => void };
	modalState?: { modalAuth: boolean; setModalAuth: (toSet: boolean) => void };
	attr?: ComponentAttr;
}) => {
	let { userState, modalState, attr } = props;
	let { user, setUser } = userState;
	const { modalAuth, setModalAuth } = modalState ?? {
		modalAuth: false,
		setModalAuth: (toSet: boolean) => {
			return toSet;
		},
	};

	const default_attr = { class: navbar_default };

	attr = { ...default_attr, ...attr };

	return createElement(
		"div",
		attr,
		DropdownLang({}),
		user
			? DropdownUser({ state: { user, setUser } })
			: Button({
				children: useLanguage("signin") + " / " + useLanguage("loginin"),
				attr: {
					class: btn_modal,
					onClick: () => setModalAuth(!modalAuth),
				},
			})
	);
};

export default NavigationBar;
